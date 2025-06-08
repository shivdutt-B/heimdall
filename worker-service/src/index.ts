import { Worker, Job } from 'bullmq';
import { PrismaClient, Prisma } from '@prisma/client';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

// Interface for ping response
interface PingResponse {
    status: string;
    message: string;
    timestamp: string;
    memory: {
        heapUsed: number;
        heapTotal: number;
        rss: number;
        external: number;
    };
}

// Interface for the job data
interface PingJob {
    serverId: string;
    url: string;
    userId: string;
}

// Create Redis connection configuration
const redisConnection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD
};

async function handlePing(job: Job<PingJob>) {
    const { serverId, url } = job.data;
    const pingUrl = `${url.replace(/\/$/, '')}/__ping__`;
    console.log(`📡 Pinging server ${serverId} at ${pingUrl}`);

    try {
        // Get server data in a single query before the ping attempt
        const server = await prisma.server.findUnique({
            where: { id: serverId }
        });

        if (!server) {
            throw new Error('Server not found');
        }

        // Attempt to ping the server with a 5-second timeout
        const startTime = Date.now();
        const response = await axios.get<PingResponse>(pingUrl, { 
            timeout: 5000,
            validateStatus: (status) => status === 200 // Only 200 is considered success
        });
        const responseTime = Date.now() - startTime;

        // Validate response structure
        // Need to review this
        if (!response.data?.memory || response.data.status !== 'ok') {
            throw new Error('Invalid response format from server');
        }

        const memory = response.data.memory;

        // Use transaction to update server and create ping history in one go
        await prisma.$transaction([
            // Update server status
            prisma.server.update({
                where: { id: serverId },
                data: {
                    isActive: true,
                    consecutiveFailures: 0,
                    lastPingedAt: new Date(),
                    nextPingAt: new Date(Date.now() + server.pingInterval * 1000)
                }
            }),
            // Create success history
            prisma.pingHistory.create({
                data: {
                    serverId,
                    status: true,
                    responseTime,
                    statusCode: response.status,
                    timestamp: new Date(),
                    heapUsage: memory.heapUsed,
                    totalHeap: memory.heapTotal,
                    rssMemory: memory.rss,
                    totalRss: memory.external
                }
            })
        ]);

        console.log(`✅ Successfully pinged ${url} (${responseTime}ms, Heap: ${memory.heapUsed}MB/${memory.heapTotal}MB)`);
        
        // If this was a retry, log it
        if (job.attemptsMade > 0) {
            console.log(`🔄 Success after ${job.attemptsMade + 1} attempts`);
        }

    } catch (error: any) {
        // Use transaction for failure updates
        const server = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // Get current server state
            const currentServer = await tx.server.findUnique({
                where: { id: serverId }
            });

            if (!currentServer) {
                throw new Error('Server not found');
            }

            // Update server status
            const updatedServer = await tx.server.update({
                where: { id: serverId },
                data: {
                    isActive: false, // Mark inactive on any failure
                    consecutiveFailures: {
                        increment: 1
                    },
                    lastPingedAt: new Date(),
                    nextPingAt: new Date(Date.now() + currentServer.pingInterval * 1000)
                }
            });

            // Create failure history
            await tx.pingHistory.create({
                data: {
                    serverId,
                    status: false,
                    statusCode: error.response?.status || null,
                    timestamp: new Date(),
                    heapUsage: null,
                    totalHeap: null,
                    rssMemory: null,
                    totalRss: null
                }
            });

            return updatedServer;
        });        const errorMessage = `Attempt ${job.attemptsMade + 1}/3 failed - ${error.message}`;
        console.error(`❌ Server ${serverId} deactivated. Error: ${errorMessage}`);
        
        // Throw error to trigger BullMQ's retry mechanism
        throw new Error(errorMessage);
    }
}

// Create the worker with retry configuration
const worker = new Worker('ping-queue', async (job: Job<PingJob>) => {
    await handlePing(job);
}, {
    connection: redisConnection,
    // Worker will process the retries configured in the Queue
    // No need to set removal options here as they're handled by the Queue configuration
});

// Handle worker events
worker.on('completed', (job: Job<PingJob>) => {
    console.log(`✨ Job ${job.id} completed for server ${job.data.serverId}`);
});

worker.on('failed', (job: Job<PingJob> | undefined, err: Error) => {
    if (job) {
        console.error(`💥 Job ${job.id} failed for server ${job.data.serverId} (Attempt ${job.attemptsMade}/3):`, err.message);
    }
});

// Handle process termination
process.on('SIGTERM', async () => {
    await worker.close();
    await prisma.$disconnect();
    process.exit(0);
});

process.on('uncaughtException', async (err) => {
    console.error('Uncaught Exception:', err);
    await worker.close();
    await prisma.$disconnect();
    process.exit(1);
});

console.log('🚀 Worker service started and listening for ping jobs...');
