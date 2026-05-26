import * as dotenv from 'dotenv';
import { prisma } from './utils/db';
import { pingQueue, queueEvents } from './utils/queue';
import { findServersToDispatch } from './utils/dispatcher';

const express = require('express');
const heimdall = require('heimdall-nodejs-sdk');

dotenv.config();

// Get dispatch interval from env or default to 60 seconds
const DISPATCH_INTERVAL = parseInt(process.env.DISPATCH_INTERVAL || '60000');

// Run the dispatcher every DISPATCH_INTERVAL milliseconds
const dispatchInterval = setInterval(findServersToDispatch, DISPATCH_INTERVAL);

// Initial run
findServersToDispatch();

// Express server setup for Render deployment
const app = express();
heimdall.ping(app);

const PORT = parseInt(process.env.PORT || '3000');

const expressServer = app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
});

// Cleanup function for graceful shutdown
async function cleanup() {
    clearInterval(dispatchInterval);
    try {
        // Close database connection
        await prisma.$disconnect();

        // Close queue and events connections
        await Promise.all([
            pingQueue.close(),
            queueEvents.close()
        ]);

        // Close express server
        expressServer.close();
    } catch (error) {
        console.error('Error during cleanup:', error);
        process.exit(1);
    }
}

// Handle process termination
process.on('SIGTERM', async () => {
    await cleanup();
    process.exit(0);
});

process.on('SIGINT', async () => {
    await cleanup();
    process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', async (error) => {
    await cleanup();
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', async (reason, promise) => {
    await cleanup();
    process.exit(1);
});
