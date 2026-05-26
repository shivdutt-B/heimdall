import { Job } from 'bullmq';
import { prisma } from './db';
import { pingQueue, PingJob } from './queue';

export async function findServersToDispatch() {
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

        }
    } catch (error) {
        console.error('Error in dispatcher:', error);
    }
}
