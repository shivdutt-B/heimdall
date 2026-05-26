import { getQueueMetrics } from './queue';
import { 
    listRunningWorkers, 
    isWorkerRunning, 
    startWorker, 
    stopWorker 
} from './docker';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();
dotenv.config({ path: '.env.worker-service' });

const {
    MIN_WORKERS = '1',
    MAX_WORKERS = '5',
    JOBS_PER_WORKER = '20'
} = process.env;

export let lastScaleTime = 0;

export const scaleWorkers = async () => {
    const now = Date.now();

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
