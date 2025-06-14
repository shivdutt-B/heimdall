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
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: 3,
    retryStrategy: (times: number) => {
        const delay = Math.min(times * 1000, 5000);
        console.log(`[${new Date().toISOString()}] Retrying Redis connection in ${delay}ms... (attempt ${times})`);
        return delay;
    }
};

async function handlePing(job: Job<PingJob>) {
    const { serverId, url } = job.data;
    const pingUrl = `${url.replace(/\/$/, '')}/__ping__`;
    console.log(`📡 Pinging server ${serverId} at ${pingUrl}`);

    try {
        // Get server data
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
        if (!response.data?.memory || response.data.status !== 'ok') {
            throw new Error('Invalid response format from server');
        }

        const memory = response.data.memory;

        // Use transaction to handle successful ping
        await prisma.$transaction([
            // Update server status and reset failures
            prisma.server.update({
                where: { id: serverId },
                data: {
                    isActive: true,
                    consecutiveFailures: 0, // Reset failures on success
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
            }),

            // Clean up any existing alert
            prisma.$executeRaw`DELETE FROM alerts WHERE server_id = ${serverId}`
        ]);

        console.log(`✅ Successfully pinged ${url} (${responseTime}ms, Heap: ${memory.heapUsed}MB/${memory.heapTotal}MB)`);

    } catch (error: any) {
        // Use transaction for failure handling
        const updatedServer = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // Get current server state with alert
            const currentServer = await tx.server.findUnique({
                where: { id: serverId },
                select: {
                    id: true,
                    name: true,
                    userId: true,
                    consecutiveFailures: true,
                    failureThreshold: true,
                    pingInterval: true,
                    alert: true
                }
            });

            if (!currentServer) {
                throw new Error('Server not found');
            }

            const newFailureCount = currentServer.consecutiveFailures + 1;
            // Check if we need to create an alert (failures = threshold + 1 and no existing alert)
            const shouldCreateAlert = newFailureCount === currentServer.failureThreshold + 1 && !currentServer.alert;

            // Update server status and increment failures
            const updatedServer = await tx.server.update({
                where: { id: serverId },
                data: {
                    isActive: false,
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

            // Create alert if threshold + 1 failures reached
            if (shouldCreateAlert) {
                await tx.server.update({
                    where: { id: serverId },
                    data: {
                        alert: {
                            create: {
                                userId: currentServer.userId,
                                lastAlertAt: new Date(),
                                nextAlertAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
                            }
                        }
                    }
                });
                console.log(`🚨 Alert created for server ${currentServer.name} - Consecutive failures exceeded threshold`);
            }

            return updatedServer;
        });

        console.error(`❌ Server ${serverId} deactivated (${updatedServer.consecutiveFailures}/${updatedServer.failureThreshold} failures). Error: ${error.message}`);
    }
}

// Create the worker with no retry configuration
const worker = new Worker('ping-queue', async (job: Job<PingJob>) => {
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
    console.log('🟢 Worker connected to Redis and ready to process jobs');
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
        console.error(`💥 Job ${job.id} failed for server ${job.data.serverId}: ${err.message}`);
    }
});

worker.on('completed', (job: Job<PingJob>) => {
    console.log(`✨ Job ${job.id} completed for server ${job.data.serverId}`);
});

worker.on('drained', () => {
    console.log('Queue is empty, waiting for more jobs...');
});

// Enhanced process termination handling
async function gracefulShutdown(signal: string) {
    console.log(`\nReceived ${signal}. Shutting down gracefully...`);
    try {
        console.log('Closing worker...');
        await worker.close();
        console.log('Disconnecting from database...');
        await prisma.$disconnect();
        console.log('Cleanup completed');
        process.exit(0);
    } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', async (err) => {
    console.error('Uncaught Exception:', err);
    await gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', async (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    await gracefulShutdown('unhandledRejection');
});

// Start the worker
console.log('🚀 Worker service starting...');
