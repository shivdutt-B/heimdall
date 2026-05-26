import * as dotenv from 'dotenv';
import { prisma } from './utils/db';
import { checkForNewFailures, checkForRecurringAlerts } from './utils/alerts';

dotenv.config();

/**
 * Constants from environment variables
 */ 
const IMMEDIATE_CHECK_INTERVAL = parseInt(process.env.IMMEDIATE_CHECK_INTERVAL || '60000');  // 1 minute
const RECURRING_CHECK_INTERVAL = parseInt(process.env.RECURRING_CHECK_INTERVAL || '3600000');  // 1 hour

/**
 * Run immediate checks every minute
 */ 
const immediateCheckInterval = setInterval(checkForNewFailures, IMMEDIATE_CHECK_INTERVAL);

/**
 * Runs checks for recurring alerts at the specified interval.
 */
const recurringCheckInterval = setInterval(checkForRecurringAlerts, RECURRING_CHECK_INTERVAL);

/**
 * Performs an initial run of the alert service by checking for new failures and recurring alerts.
 */
checkForNewFailures();
checkForRecurringAlerts();

/**
 * Cleans up the alert service by clearing the intervals and disconnecting from the database.
 */
async function cleanup() {
    clearInterval(immediateCheckInterval);
    clearInterval(recurringCheckInterval);
    await prisma.$disconnect();
}

/**
 * Handles the SIGTERM signal from the operating system.
 */
process.on('SIGTERM', async () => {
    await cleanup();
    process.exit(0);
});

/**
 * Handles the SIGINT signal from the operating system.
 */
process.on('SIGINT', async () => {
    await cleanup();
    process.exit(0);
});

/**
 * Handles uncaught exceptions.
 */
process.on('uncaughtException', async (error) => {
    await cleanup();
    process.exit(1);
});

/**
 * Handles unhandled rejections.
 */
process.on('unhandledRejection', async (reason, promise) => {
    await cleanup();
    process.exit(1);
});
