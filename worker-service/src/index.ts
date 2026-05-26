import * as dotenv from 'dotenv';
import { prisma } from './utils/db';
import { worker } from './utils/worker';

dotenv.config(); 

// Enhanced process termination handling
async function gracefulShutdown(signal: string) {
    try {
        await worker.close();
        await prisma.$disconnect();
        process.exit(0); 
    } catch (error) {
        process.exit(1); 
    }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', async (err) => {
    await gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', async (reason, promise) => {
    await gracefulShutdown('unhandledRejection');
});
