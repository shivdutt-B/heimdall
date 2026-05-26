import { prisma } from './db';
import { sendImmediateAlert, sendRecurringAlert } from './mailer';

const ALERT_RECURRING_INTERVAL = parseInt(process.env.ALERT_RECURRING_INTERVAL || '86400000');  // 24 hours

/**
 * Formats the downtime of a server.
 * @param {Date} startDate - The date and time when the server went down.
 * @returns {string} The downtime of the server.
 */
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

/**
 * Checks for new failures and sends immediate alerts if needed.
 */
export async function checkForNewFailures() {
    try {
        // Find servers that hit their failure threshold and haven't been alerted yet
        const failedServers = await prisma.server.findMany({
            where: {
                isActive: false,
                consecutiveFailures: {
                    not: 0 // Must have at least one failure
                },
                failureThreshold: {
                    not: 0
                },
                lastImmediateAlertAt: null, // Only servers that haven't been alerted for this failure
            },
            include: {
                user: true
            }
        });

        // Process each failed server that has hit its threshold
        for (const server of failedServers) {
            // Only send alert if consecutive failures equals threshold and not alerted yet
            if (server.consecutiveFailures === server.failureThreshold) {
                try {
                    // Send immediate alert email only
                    await sendImmediateAlert(server, server.user);
                    // Update lastImmediateAlertAt to prevent duplicate alerts
                    await prisma.server.update({
                        where: { id: server.id },
                        data: { lastImmediateAlertAt: new Date() }
                    });
                    console.log(`Sent alert email for server ${server.name} (${server.consecutiveFailures}/${server.failureThreshold} failures)`);
                } catch (error) {
                    console.error(`Error sending alert email for server ${server.name}:`, error);
                }
            }
        }
    } catch (error) {
        console.error('Error in checkForNewFailures:', error);
    }
}

/**
 * Checks for recurring alerts and sends them if needed.
 */
export async function checkForRecurringAlerts() {
    try {
        // Find existing alerts that need to be sent (created by worker service)
        const pendingAlerts = await prisma.alert.findMany({
            where: {
                nextAlertAt: {
                    lte: new Date() // Only get alerts that are due
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

                // Verify alert still exists and get latest data
                const alertStillExists = await prisma.alert.findUnique({
                    where: { id: alert.id }
                });

                if (!alertStillExists) {
                    console.log(`Alert ${alert.id} no longer exists, skipping`);
                    continue;
                }

                // Calculate downtime since alert was created
                const downtime = formatDowntime(alert.createdAt);

                // Send recurring alert email
                await sendRecurringAlert(server, server.user, downtime);

                // Update next alert time (24 hours from now)
                await prisma.alert.update({
                    where: { id: alert.id },
                    data: {
                        lastAlertAt: new Date(),
                        nextAlertAt: new Date(Date.now() + ALERT_RECURRING_INTERVAL)
                    }
                });

                console.log(`Sent recurring alert for server ${server.name}, next alert in 24 hours`);
            } catch (error) {
                console.error(`Error processing recurring alert for alert ${alert.id}:`, error);
            }
        }
    } catch (error) {
        console.error('Error in checkForRecurringAlerts:', error);
    }
}
