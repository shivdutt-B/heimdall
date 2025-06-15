import { PrismaClient } from '@prisma/client';
import { Queue, Job, QueueEvents } from 'bullmq';
import * as dotenv from 'dotenv';
const express = require('express');

dotenv.config();

const prisma = new PrismaClient();

interface PingJob {
    serverId: string;
    url: string;
    userId: string;
}

// Enhanced Redis configuration
const redisConfig = {
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

const pingQueue = new Queue<PingJob>('ping-queue', {
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
const queueEvents = new QueueEvents('ping-queue', {
    connection: redisConfig
});

async function findServersToDispatch() {
    try {
        /*
            This function finds all active servers that need to be pinged.
            It checks for servers that are active and whose nextPingAt time is less than or equal to the current time.
        */       
        const servers = await prisma.server.findMany({
        where: {
            nextPingAt: { lte: new Date() }
        }
    });

        /*
            Adds each server to the ping queue for processing.
            Each server's ID, URL, and user ID are passed to the job.
        */
        for (const server of servers) {
            const job: Job<PingJob> = await pingQueue.add('ping-server', {
                serverId: server.id,
                url: server.url,
                userId: server.userId
            }, {
                jobId: server.id // avoid duplicate job for same server
            });

            // Print job details in a structured format
            console.log('\n📋 Job Added to Queue:', JSON.stringify({
                jobId: job.id,
                name: job.name,
                data: job.data,
                timestamp: new Date().toISOString(),
                options: job.opts
            }, null, 2));

        }

        console.log(`Dispatched ${servers.length} ping jobs at ${new Date().toISOString()}`);
    } catch (error) {
        console.error('Error in dispatcher:', error);
    }
}

// Get dispatch interval from env or default to 60 seconds
const DISPATCH_INTERVAL = parseInt(process.env.DISPATCH_INTERVAL || '60000');

// Run the dispatcher every DISPATCH_INTERVAL milliseconds
setInterval(findServersToDispatch, DISPATCH_INTERVAL);

// Initial run
findServersToDispatch();

// Enhanced queue event handling
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

// Express server setup for Render deployment
const app = express();
const PORT = parseInt(process.env.PORT || '3000');

app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
});

// Cleanup function for graceful shutdown
async function cleanup() {
    console.log(`[${new Date().toISOString()}] Starting cleanup...`);
    try {
        // Close database connection
        await prisma.$disconnect();
        console.log('Database connection closed');

        // Close queue and events connections
        await Promise.all([
            pingQueue.close(),
            queueEvents.close()
        ]);
        console.log('Queue connections closed');
    } catch (error) {
        console.error('Error during cleanup:', error);
        process.exit(1);
    }
}

// Handle process termination
process.on('SIGTERM', async () => {
    console.log('Received SIGTERM. Shutting down gracefully...');
    await cleanup();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('Received SIGINT. Shutting down gracefully...');
    await cleanup();
    process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', async (error) => {
    console.error('Uncaught Exception:', error);
    await cleanup();
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', async (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    await cleanup();
    process.exit(1);
});
