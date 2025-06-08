import { PrismaClient } from '@prisma/client';
import { Queue, Job } from 'bullmq';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const pingQueue = new Queue('ping-queue', {
    connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD
    },
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

interface PingJob {
    serverId: string;
    url: string;
    userId: string;
}

async function findServersToDispatch() {
    try {
        /*
            This function finds all active servers that need to be pinged.
            It checks for servers that are active and whose nextPingAt time is less than or equal to the current time.
        */        const servers = await prisma.server.findMany({
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

// Handle Redis connection errors
pingQueue.on('error', (error) => {
    console.error('Redis Queue Error:', error);
});

// Handle process termination
process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    await pingQueue.close();
    process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', async (error) => {
    console.error('Uncaught Exception:', error);
    await prisma.$disconnect();
    await pingQueue.close();
    process.exit(1);
});
