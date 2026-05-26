import Docker from 'dockerode';
import { randomUUID } from 'crypto';

// Connect to the local Docker socket
const docker = new Docker({ socketPath: '/var/run/docker.sock' });
const WORKER_IMAGE = process.env.WORKER_IMAGE || 'heimdall-worker:latest';

export interface WorkerContainer {
    id: string;
    name: string;
    created: Date;
    state?: string;
}

export const isWorkerRunning = (state?: string): boolean =>
    !!state && (state.toLowerCase().startsWith('up') || state.toLowerCase().includes('running'));

// 1. List workers without parsing stdout strings
export const listRunningWorkers = async (): Promise<WorkerContainer[]> => {
    const containers = await docker.listContainers({ all: true });
    
    return containers
        .filter(c => c.Names.some(name => name.includes('/worker-')))
        .map(c => {
            const name = c.Names[0].replace(/^\//, ''); // Strip leading slash
            return {
                id: c.Id,
                name,
                created: new Date(c.Created * 1000), // API returns Unix epoch seconds
                state: c.Status // e.g. "Up 2 hours"
            };
        });
};

// 2. Clean up exited containers cleanly
export const cleanupStoppedWorkers = async (name: string) => {
    const containers = await docker.listContainers({
        all: true,
        filters: JSON.stringify({ name: [name], status: ['exited'] })
    });
    
    for (const containerInfo of containers) {
        const container = docker.getContainer(containerInfo.Id);
        await container.remove({ force: true });
    }
};

// 3. Start worker containers programmatically
export const startWorker = async () => {
    const name = `worker-${randomUUID()}`;
    await cleanupStoppedWorkers(name);
    
    const containers = await docker.listContainers({ all: true });
    const isRunning = containers.some(c => 
        c.Names.some(n => n.replace(/^\//, '') === name) && 
        isWorkerRunning(c.Status)
    );

    if (!isRunning) {
        const container = await docker.createContainer({
            Image: WORKER_IMAGE,
            name: name,
            HostConfig: {
                RestartPolicy: { Name: 'unless-stopped' }
            }
        });
        await container.start();
    }
};

// 4. Force remove containers directly
export const stopWorker = async (worker: WorkerContainer) => {
    const container = docker.getContainer(worker.id);
    await container.remove({ force: true });
    console.log(`[${new Date().toISOString()}] Stopped worker: ${worker.name}`);
};
