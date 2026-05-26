import { Worker, Job } from 'bullmq';
import { redisConnection } from './redis';
import { handlePing, PingJob } from './ping';

export const worker = new Worker('ping-queue', async (job: Job<PingJob>) => {
    await handlePing(job);
}, {
    connection: redisConnection,
    autorun: false, // Don't start processing until we're ready
    concurrency: parseInt(process.env.WORKER_CONCURRENCY || '1'), // Control concurrent job processing
    removeOnComplete: { count: 0 }, // Remove jobs immediately after completion
    removeOnFail: { count: 0 } // Remove jobs immediately after failure
});

// Handle worker events for better monitoring
worker.on('ready', () => {
    console.log('Worker connected to Redis and ready to process jobs');
    worker.run(); // Start processing jobs
});

worker.on('closing', () => {
    console.log('Worker is closing...');
});

worker.on('closed', () => {
    console.log('Worker closed gracefully');
});

worker.on('error', err => {
    console.error('Worker encountered an error:', err);
});

worker.on('failed', (job: Job<PingJob> | undefined, err: Error) => {
    if (job) {
        console.error(`Job ${job.id} failed for server ${job.data.serverId}: ${err.message}`);
    }
});

worker.on('completed', (job: Job<PingJob>) => {
    console.log(`Job ${job.id} completed for server ${job.data.serverId}`);
});

worker.on('drained', () => {
    console.log('Queue is empty, waiting for more jobs...');
});
