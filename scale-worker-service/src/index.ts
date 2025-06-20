// worker-scaler.ts
import { Queue, QueueEvents } from 'bullmq';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as dotenv from 'dotenv';
import { Redis } from 'ioredis';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables
dotenv.config();
dotenv.config({ path: '.env.worker-service' });

const execAsync = promisify(exec);

// Environment variables
const {
    REDIS_HOST = 'localhost',
    REDIS_PORT = '6379',
    REDIS_USERNAME,
    REDIS_PASSWORD,
    WORKER_IMAGE = 'heimdall-worker:latest',
    MIN_WORKERS = '1',
    MAX_WORKERS = '5',
    JOBS_PER_WORKER = '20',
    SCALE_CHECK_INTERVAL = '30000',
    SCALE_COOLDOWN = '60000'
} = process.env;

const REDIS_CONFIG = {
    host: REDIS_HOST,
    port: parseInt(REDIS_PORT),
    username: REDIS_USERNAME,
    password: REDIS_PASSWORD,
    maxRetriesPerRequest: null, // Set to null for BullMQ compatibility
    retryStrategy: (times: number) => Math.min(times * 1000, 5000)
};

let queue: Queue | null;
let queueEvents: QueueEvents | null = null;
let lastScaleTime = 0;

interface WorkerContainer {
    id: string;
    name: string;
    created: Date;
    state?: string;
}

const isWorkerRunning = (state?: string): boolean =>
    !!state && (state.toLowerCase().startsWith('up') || state.toLowerCase().includes('running'));

const initializeQueue = async (): Promise<boolean> => {
    try {
        if (queue) await queue.close();
        if (queueEvents) await queueEvents.close();

        queue = new Queue('ping-queue', { connection: REDIS_CONFIG });
        queueEvents = new QueueEvents('ping-queue', { connection: REDIS_CONFIG });

        let hasLogged = false;
        queueEvents.on('error', async (err) => {
            console.error('Redis connection error:', err);
            if (queue) await queue.close();
            if (queueEvents) await queueEvents.close();
            queue = null;
            queueEvents = null;
            setTimeout(() => initializeQueue(), 5000);
        });

        queueEvents.on('waiting', () => {
            if (!hasLogged) {
                console.log(`[${new Date().toISOString()}] Successfully connected to Redis`);
                hasLogged = true;
            }
        });

        return true;
    } catch (err) {
        console.error('Failed to initialize queue:', err);
        return false;
    }
};

const getQueueMetrics = async (): Promise<number> => {
    if (!queue) return 0;
    const counts = await queue.getJobCounts();
    return (counts.waiting || 0) + (counts.delayed || 0);
};

const listRunningWorkers = async (): Promise<WorkerContainer[]> => {
    const { stdout } = await execAsync('docker ps -a --filter name=worker- --format "{{.ID}}\t{{.Names}}\t{{.CreatedAt}}\t{{.Status}}"');
    return stdout.trim().split('\n').filter(Boolean).map(line => {
        const [id, name, created, state] = line.split('\t');
        return { id, name, created: new Date(created), state };
    });
};

const cleanupStoppedWorkers = async (name: string) => {
    const { stdout } = await execAsync(`docker ps -a -q --filter name=${name} --filter status=exited`);
    if (stdout.trim()) await execAsync(`docker rm -f ${stdout.trim()}`);
};

const startWorker = async () => {
    const name = `worker-${uuidv4()}`;
    await cleanupStoppedWorkers(name);
    const workers = await listRunningWorkers();
    const isRunning = workers.some(w => w.name === name && isWorkerRunning(w.state));
    if (!isRunning) {
        await execAsync(`docker run -d --name ${name} --restart unless-stopped ${WORKER_IMAGE}`);
        console.log(`[${new Date().toISOString()}] Started new worker: ${name}`);
    }
};

const stopWorker = async (worker: WorkerContainer) => {
    await execAsync(`docker rm -f ${worker.id}`);
    console.log(`[${new Date().toISOString()}] Stopped worker: ${worker.name}`);
};

const acquireLock = async (key: string, ttl: number): Promise<boolean> => {
    const client = new Redis(REDIS_CONFIG);
    const res = await client.set(key, 'locked', 'PX', ttl, 'NX');
    client.quit();
    return res === 'OK';
};

const releaseLock = async (key: string) => {
    const client = new Redis(REDIS_CONFIG);
    await client.del(key);
    client.quit();
};

const scaleWorkers = async () => {
    const lockKey = 'scale-workers-lock';
    const lockTTL = parseInt(SCALE_COOLDOWN);
    if (!(await acquireLock(lockKey, lockTTL))) return;

    const now = Date.now();
    if (now - lastScaleTime < lockTTL) return;

    const pending = await getQueueMetrics();
    const workers = await listRunningWorkers();
    const runningCount = workers.filter(w => isWorkerRunning(w.state)).length;

    const desired = Math.min(
        Math.max(Math.ceil(pending / parseInt(JOBS_PER_WORKER)), parseInt(MIN_WORKERS)),
        parseInt(MAX_WORKERS)
    );

    console.log(`[${new Date().toISOString()}] Scaling check: pending jobs = ${pending}, running containers = ${runningCount}, desired containers = ${desired}`);

    let started = 0;
    let stopped = 0;

    if (desired > runningCount) {
        for (let i = 0; i < desired - runningCount; i++) {
            await startWorker();
            started++;
        }
    } else if (desired < runningCount) {
        const toRemove = workers
            .filter(w => isWorkerRunning(w.state))
            .sort((a, b) => a.created.getTime() - b.created.getTime())
            .slice(0, runningCount - desired);
        for (const worker of toRemove) {
            await stopWorker(worker);
            stopped++;
        }
    }

    if (started > 0) {
        console.log(`[${new Date().toISOString()}] Started ${started} container(s).`);
    }
    if (stopped > 0) {
        console.log(`[${new Date().toISOString()}] Stopped ${stopped} container(s).`);
    }

    lastScaleTime = now;
};

const startScalingService = async () => {
    // Worker scaler started
    await scaleWorkers();
    setInterval(scaleWorkers, parseInt(SCALE_CHECK_INTERVAL));
};

const cleanup = async () => {
    // Cleanup started
    if (queue) await queue.close();
    if (queueEvents) await queueEvents.close();
    const workers = await listRunningWorkers();
    for (const w of workers.filter(w => isWorkerRunning(w.state))) await stopWorker(w);
};

['SIGTERM', 'SIGINT'].forEach(sig => {
    process.on(sig, async () => {
        // Received signal, shutting down...
        await cleanup();
        process.exit(0);
    });
});

process.on('uncaughtException', async err => {
    // Uncaught Exception
    await cleanup();
    process.exit(1);
});

process.on('unhandledRejection', async (reason, p) => {
    // Unhandled Rejection
    await cleanup();
    process.exit(1);
});

(async () => {
    for (let i = 0; i < 5; i++) {
        if (await initializeQueue()) return startScalingService();
        const delay = Math.min(i * 5000, 30000);
        await new Promise(res => setTimeout(res, delay));
    }
    // Failed to initialize queue after retries
    process.exit(1);
})();
