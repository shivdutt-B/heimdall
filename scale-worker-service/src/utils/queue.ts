import { Queue, QueueEvents } from 'bullmq';
import { REDIS_CONFIG } from './redis';

let queue: Queue | null = null;
let queueEvents: QueueEvents | null = null;

export const getQueue = () => queue;
export const getQueueEvents = () => queueEvents;

export const initializeQueue = async (): Promise<boolean> => {
    try {
        if (queue) await queue.close();
        if (queueEvents) await queueEvents.close();

        queue = new Queue('ping-queue', { connection: REDIS_CONFIG });
        queueEvents = new QueueEvents('ping-queue', { connection: REDIS_CONFIG });

        let hasLogged = false;
        queueEvents.on('error', async (err) => {
            if (queue) await queue.close();
            if (queueEvents) await queueEvents.close();
            queue = null;
            queueEvents = null;
            setTimeout(() => initializeQueue(), 5000);
        });

        queueEvents.on('waiting', () => {
            if (!hasLogged) {
                hasLogged = true;
            }
        });

        return true;
    } catch (err) {
        return false;
    }
};

export const getQueueMetrics = async (): Promise<number> => {
    if (!queue) return 0;
    const counts = await queue.getJobCounts();
    return (counts.waiting || 0) + (counts.delayed || 0);
};

export const closeQueue = async () => {
    if (queue) {
        await queue.close();
        queue = null;
    }
    if (queueEvents) {
        await queueEvents.close();
        queueEvents = null;
    }
};
