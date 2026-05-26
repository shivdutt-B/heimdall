import { exec } from 'child_process';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();
dotenv.config({ path: '.env.worker-service' });

const execAsync = promisify(exec);

const WORKER_IMAGE = process.env.WORKER_IMAGE || 'heimdall-worker:latest';

export interface WorkerContainer {
    id: string;
    name: string;
    created: Date;
    state?: string;
}

export const isWorkerRunning = (state?: string): boolean =>
    !!state && (state.toLowerCase().startsWith('up') || state.toLowerCase().includes('running'));

export const listRunningWorkers = async (): Promise<WorkerContainer[]> => {
    const { stdout } = await execAsync('docker ps -a --filter name=worker- --format "{{.ID}}\t{{.Names}}\t{{.CreatedAt}}\t{{.Status}}"');
    return stdout.trim().split('\n').filter(Boolean).map(line => {
        const [id, name, created, state] = line.split('\t');
        return { id, name, created: new Date(created), state };
    });
};

export const cleanupStoppedWorkers = async (name: string) => {
    const { stdout } = await execAsync(`docker ps -a -q --filter name=${name} --filter status=exited`);
    if (stdout.trim()) await execAsync(`docker rm -f ${stdout.trim()}`);
};

export const startWorker = async () => {
    const name = `worker-${uuidv4()}`;
    await cleanupStoppedWorkers(name);
    const workers = await listRunningWorkers();
    const isRunning = workers.some(w => w.name === name && isWorkerRunning(w.state));
    if (!isRunning) {
        await execAsync(`docker run -d --name ${name} --restart unless-stopped ${WORKER_IMAGE}`);
        console.log(`[${new Date().toISOString()}] Started new worker: ${name}`);
    }
};

export const stopWorker = async (worker: WorkerContainer) => {
    await execAsync(`docker rm -f ${worker.id}`);
    console.log(`[${new Date().toISOString()}] Stopped worker: ${worker.name}`);
};
