import axios from 'axios';
import { prisma } from './db';
import { Prisma } from '@prisma/client';
import { Job } from 'bullmq';

// Interface for ping response
export interface PingResponse {
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
export interface PingJob {
    serverId: string;
    url: string;
    userId: string;
}

export async function handlePing(job: Job<PingJob>) {
    const { serverId, url } = job.data;
    const pingUrl = `${url.replace(/\/$/, '')}/__ping__`;

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
                    nextPingAt: new Date(Date.now() + server.pingInterval * 1000),
                    lastImmediateAlertAt: null // Reset immediate alert flag on recovery
                }
            }),

            // Create success history
            prisma.pingHistory.create({
                data: {
                    serverId,
                    status: true,
                    responseTime,
                    statusCode: response.status,
                    timestamp: new Date()
                }
            }),

            // Store memory data in MemoryHistory (new table)
            prisma.memoryHistory.create({
                data: {
                    serverId,
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
                    timestamp: new Date()
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
            }

            return updatedServer;
        });
    }
}
