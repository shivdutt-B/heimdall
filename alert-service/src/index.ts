import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { sendImmediateAlert, sendRecurringAlert } from './utils/mailer';

dotenv.config();

const prisma = new PrismaClient();

// Constants from environment variables
const IMMEDIATE_CHECK_INTERVAL = parseInt(process.env.IMMEDIATE_CHECK_INTERVAL || '60000');  // 1 minute
const RECURRING_CHECK_INTERVAL = parseInt(process.env.RECURRING_CHECK_INTERVAL || '3600000');  // 1 hour
const ALERT_RECURRING_INTERVAL = parseInt(process.env.ALERT_RECURRING_INTERVAL || '86400000');  // 24 hours

function formatDowntime(startDate: Date): string {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
        return `${diffInHours} hours`;
    }
    
    const days = Math.floor(diffInHours / 24);
    const hours = diffInHours % 24;
    return `${days} days${hours > 0 ? ` and ${hours} hours` : ''}`;
}

async function checkForNewFailures() {
    try {
        // Find servers that just hit their failure threshold
        const failedServers = await prisma.server.findMany({
            where: {
                isActive: false,
                alert: null, // No alert record exists yet
                consecutiveFailures: {
                    not: 0 // Must have at least one failure
                }
            },
            include: {
                user: true
            }
        });

        // Process each failed server that has hit its threshold
        for (const server of failedServers) {
            // Only create alert if consecutive failures equals threshold
            if (server.consecutiveFailures === server.failureThreshold) {
                try {
                    // Send immediate alert
                    await sendImmediateAlert(server, server.user);

                    // Create alert record
                    await prisma.alert.create({
                        data: {
                            serverId: server.id,
                            userId: server.userId,
                            lastAlertAt: new Date(),
                            nextAlertAt: new Date(Date.now() + ALERT_RECURRING_INTERVAL)
                        }
                    });

                    console.log(`Created new alert for server ${server.name} (${server.consecutiveFailures}/${server.failureThreshold} failures)`);
                } catch (error) {
                    console.error(`Error processing immediate alert for server ${server.name}:`, error);
                }
            }
        }
    } catch (error) {
        console.error('Error in checkForNewFailures:', error);
    }
}

async function checkForRecurringAlerts() {
    try {
        // Find alerts that need to be sent
        const pendingAlerts = await prisma.alert.findMany({
            where: {
                nextAlertAt: {
                    lte: new Date()
                }
            },
            include: {
                server: {
                    include: {
                        user: true
                    }
                }
            }
        });

        // Process each pending alert
        for (const alert of pendingAlerts) {
            try {
                const { server } = alert;
                if (!server || !server.user) continue;

                // Calculate downtime
                const downtime = formatDowntime(alert.createdAt);

                // Send recurring alert
                await sendRecurringAlert(server, server.user, downtime);

                // Update alert timestamps
                await prisma.alert.update({
                    where: { id: alert.id },
                    data: {
                        lastAlertAt: new Date(),
                        nextAlertAt: new Date(Date.now() + ALERT_RECURRING_INTERVAL)
                    }
                });

                console.log(`Sent recurring alert for server ${server.name}`);
            } catch (error) {
                console.error(`Error processing recurring alert for alert ${alert.id}:`, error);
            }
        }
    } catch (error) {
        console.error('Error in checkForRecurringAlerts:', error);
    }
}

// Start the service
console.log('🚀 Alert service starting...');

// Run immediate checks every minute
setInterval(checkForNewFailures, IMMEDIATE_CHECK_INTERVAL);

// Run recurring checks every hour
setInterval(checkForRecurringAlerts, RECURRING_CHECK_INTERVAL);

// Initial run
checkForNewFailures();
checkForRecurringAlerts();

// Handle process termination
async function cleanup() {
    console.log('\nCleaning up...');
    await prisma.$disconnect();
}

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
