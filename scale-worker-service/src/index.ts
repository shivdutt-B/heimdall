import { Queue } from 'bullmq';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as dotenv from 'dotenv';

dotenv.config();

const execAsync = promisify(exec);

// Constants from environment variables
const REDIS_CONFIG = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: 3,
    retryStrategy: (times: number) => {
        const delay = Math.min(times * 1000, 5000);
        console.log(`[${new Date().toISOString()}] Retrying Redis connection in ${delay}ms... (attempt ${times})`);
        return delay;
    }
};

const WORKER_IMAGE = process.env.WORKER_IMAGE || 'heimdall-worker:latest';
const MIN_WORKERS = parseInt(process.env.MIN_WORKERS || '1');
const MAX_WORKERS = parseInt(process.env.MAX_WORKERS || '10');
const JOBS_PER_WORKER = parseInt(process.env.JOBS_PER_WORKER || '100');
const SCALE_CHECK_INTERVAL = parseInt(process.env.SCALE_CHECK_INTERVAL || '30000');
const SCALE_COOLDOWN = parseInt(process.env.SCALE_COOLDOWN || '60000');

// BullMQ queue instance
let queue: Queue;
async function initializeQueue() {
    try {
        if (queue) {
            await queue.close();
        }
        queue = new Queue('ping-queue', {
            connection: REDIS_CONFIG
        });        // Set up Redis error handling
        const connection = queue.connection;
        
        // Remove any existing listeners to prevent memory leaks
        connection.removeAllListeners('error');
        connection.removeAllListeners('connect');
        
        connection.on('error', async (error) => {
            console.error('Redis connection error:', error);
            // Close the existing queue before reconnecting
            if (queue) {
                try {
                    await queue.close();
                } catch (err) {
                    console.error('Error closing queue:', err);
                }
                queue = null;
            }
            // Try to reconnect after a short delay
            setTimeout(() => {
                console.log('Attempting to reconnect to Redis...');
                initializeQueue();
            }, 5000);
        });

        connection.on('connect', () => {
            console.log(`[${new Date().toISOString()}] Successfully connected to Redis`);
        });

        return true;
    } catch (error) {
        console.error('Failed to initialize queue:', error);
        return false;
    }
}

let lastScaleTime = 0;

interface WorkerContainer {
    id: string;
    name: string;
    created: Date;
    state?: string;
}

// Helper functions
async function getQueueMetrics(): Promise<number> {
    try {
        if (!queue) {
            console.error('Queue not initialized');
            return 0;
        }
        const counts = await queue.getJobCounts();
        return (counts.waiting || 0) + (counts.delayed || 0);
    } catch (error) {
        console.error('Error getting queue metrics:', error);
        return 0;
    }
}

async function listRunningWorkers(): Promise<WorkerContainer[]> {    try {
        const { stdout } = await execAsync(
            'docker ps -a --filter name=worker- --format "{{.ID}}\t{{.Names}}\t{{.CreatedAt}}\t{{.Status}}"'
        );

        if (!stdout.trim()) {
            return [];
        }

        return stdout.trim().split('\n')
            .filter(Boolean)
            .map(line => {
                const [id, name, created, state] = line.split('\t');
                return { 
                    id, 
                    name, 
                    created: new Date(created), 
                    state 
                };
            });
    } catch (error) {
        console.error('Error listing workers:', error);
        return [];
    }
}

async function cleanupStoppedWorkers(name: string): Promise<void> {
    try {
        // Find stopped containers with this name
        const { stdout } = await execAsync(
            `docker ps -a -q --filter name=${name} --filter status=exited`
        );
        
        if (stdout.trim()) {
            // Remove any found containers
            await execAsync(`docker rm -f ${stdout.trim()}`);
            console.log(`[${new Date().toISOString()}] Cleaned up stopped container(s) with name: ${name}`);
        }    } catch (error: any) {
        // Only log if it's not a "no such container" error
        if (error && typeof error.message === 'string' && !error.message.includes('No such container')) {
            console.error(`Error cleaning up stopped containers for ${name}:`, error);
        }
    }
}

async function startWorker(workerNumber: number) {
    const containerName = `worker-${workerNumber}`;
    try {
        // First, cleanup any existing stopped containers with this name
        await cleanupStoppedWorkers(containerName);

        // Check if a container with this name is already running
        const existingWorkers = await listRunningWorkers();     
        
        const isRunning = existingWorkers.some(w => 
            w.name === containerName && 
            (w.state?.toLowerCase().startsWith('up') || w.state?.toLowerCase().includes('running'))
        );
        
        if (!isRunning) {
            // Start the new container
            await execAsync(
                `docker run -d --env-file .env --name ${containerName} --restart unless-stopped ${WORKER_IMAGE}`
            );
            console.log(`[${new Date().toISOString()}] Started new worker: ${containerName}`);
        } else {
            console.log(`[${new Date().toISOString()}] Worker ${containerName} is already running`);
        }    } catch (error: any) {
        console.error(`Error starting worker ${containerName}:`, error);
        if (error && typeof error.message === 'string' && !error.message.includes('is already in use')) {
            throw error;
        }
    }
}

async function stopWorker(container: WorkerContainer) {
    try {
        // Force remove the container to ensure it's gone
        await execAsync(`docker rm -f ${container.id}`);
        console.log(`[${new Date().toISOString()}] Stopped and removed worker: ${container.name}`);
    } catch (error: any) {
        // If the container doesn't exist anymore, that's okay
        if (error && typeof error.message === 'string' && !error.message.includes('No such container')) {
            console.error(`Error stopping worker ${container.name}:`, error);
            throw error;
        }
    }
}

async function scaleWorkers() {
    try {
        // Check cooldown period
        const now = Date.now();
        if (now - lastScaleTime < SCALE_COOLDOWN) {
            return;
        }

        // Get current metrics
        const pendingJobs = await getQueueMetrics();
        const runningWorkers = await listRunningWorkers();
        
        // Calculate desired number of workers
        const desiredWorkers = Math.min(
            Math.max(
                Math.ceil(pendingJobs / JOBS_PER_WORKER),
                MIN_WORKERS
            ),
            MAX_WORKERS
        );

        // Log current state
        console.log(`[${new Date().toISOString()}] Current state:`, {
            pendingJobs,
            runningWorkers: runningWorkers.length,
            desiredWorkers
        });        // Get count of actually running workers
        const runningCount = runningWorkers.filter(w => 
            w.state?.toLowerCase().startsWith('up') || 
            w.state?.toLowerCase().includes('running')
        ).length;

        // Scale up or down if needed
        if (desiredWorkers > runningCount) {
            // Scale up
            // Find the highest numbered worker to avoid name conflicts
            const maxWorkerNum = Math.max(0, ...runningWorkers
                .map(w => parseInt(w.name.replace('worker-', '')) || 0));
            
            for (let i = 1; i <= desiredWorkers - runningCount; i++) {
                await startWorker(maxWorkerNum + i);
            }
            lastScaleTime = now;
        } else if (desiredWorkers < runningCount) {
            // Scale down - remove oldest containers first
            const containersToRemove = runningWorkers
                .filter(w => w.state === 'running')
                .sort((a, b) => a.created.getTime() - b.created.getTime())
                .slice(0, runningCount - desiredWorkers);

            for (const container of containersToRemove) {
                await stopWorker(container);
            }
            lastScaleTime = now;
        }
    } catch (error) {
        console.error('Error in scaling operation:', error);
    }
}

// Main scaling loop
async function startScalingService() {
    console.log(`[${new Date().toISOString()}] Worker scaling service started`);
    console.log('Configuration:', {
        MIN_WORKERS,
        MAX_WORKERS,
        JOBS_PER_WORKER,
        SCALE_CHECK_INTERVAL,
        SCALE_COOLDOWN
    });

    // Initial scale to ensure minimum workers
    await scaleWorkers();

    // Start periodic scaling checks
    setInterval(scaleWorkers, SCALE_CHECK_INTERVAL);
}

// Cleanup function
async function cleanup() {
    console.log('Starting cleanup...');
    try {
        // Close queue connection
        if (queue) {
            await queue.close();
        }

        // Stop all running workers
        const workers = await listRunningWorkers();
        const runningWorkers = workers.filter(w => w.state === 'running');
        
        if (runningWorkers.length > 0) {
            console.log(`Stopping ${runningWorkers.length} running workers...`);
            await Promise.all(runningWorkers.map(w => stopWorker(w)));
        }
    } catch (error) {
        console.error('Error during cleanup:', error);
    }
}

// Error handling
process.on('SIGTERM', async () => {
    console.log('Received SIGTERM signal. Shutting down...');
    await cleanup();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('Received SIGINT signal. Shutting down...');
    await cleanup();
    process.exit(0);
});

process.on('uncaughtException', async (error) => {
    console.error('Uncaught Exception:', error);
    await cleanup();
    process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    await cleanup();
    process.exit(1);
});

// Start the service with retries
async function start() {
    let retries = 0;
    const maxRetries = 5;

    while (retries < maxRetries) {
        if (await initializeQueue()) {
            startScalingService().catch(error => {
                console.error('Failed to start scaling service:', error);
                process.exit(1);
            });
            return;
        }
        retries++;
        if (retries < maxRetries) {
            const delay = Math.min(retries * 5000, 30000);
            console.log(`[${new Date().toISOString()}] Retrying initialization in ${delay}ms... (attempt ${retries}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    
    console.error(`Failed to initialize after ${maxRetries} attempts`);
    process.exit(1);
}

start();
