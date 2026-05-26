import { Queue, QueueEvents } from 'bullmq';
import { redisConfig } from './redis';

export interface PingJob {
    serverId: string;
    url: string;
    userId: string;
}

export const pingQueue = new Queue<PingJob>('ping-queue', {
    connection: redisConfig,
    defaultJobOptions: {
        attempts: 3,                    // Try each job up to 3 times
        backoff: {                     // Exponential backoff between retries
            type: 'exponential',
            delay: 2000                // Start with 2 seconds, then 4s, then 8s
        },
        removeOnComplete: {
            count: 0                   // Remove successful jobs immediately
        },
        removeOnFail: {
            count: 0                   // Remove failed jobs only after all attempts
        }
    }
});

// Create queue events instance
export const queueEvents = new QueueEvents('ping-queue', {
    connection: redisConfig
});

// Setup event listeners
queueEvents.on('error', (error) => {
    console.error(`[${new Date().toISOString()}] Redis Queue Error:`, error);
});

queueEvents.on('waiting', ({ jobId }) => {
    console.log(`[${new Date().toISOString()}] Job ${jobId} is waiting to be processed`);
});

queueEvents.on('failed', ({ jobId, failedReason }) => {
    console.error(`[${new Date().toISOString()}] Job ${jobId} failed:`, failedReason);
});

queueEvents.on('removed', ({ jobId }) => {
    console.log(`[${new Date().toISOString()}] Job ${jobId} was removed`);
});
