import * as dotenv from 'dotenv';
import { initializeQueue, closeQueue } from './utils/queue';
import { scaleWorkers } from './utils/scaler';
import { listRunningWorkers, isWorkerRunning, stopWorker } from './utils/docker';

// Load environment variables
dotenv.config()
dotenv.config({ path: '.env.worker-service' }); 

const SCALE_CHECK_INTERVAL = process.env.SCALE_CHECK_INTERVAL || '30000';

const startScalingService = async () => {
    await scaleWorkers();
    setInterval(scaleWorkers, parseInt(SCALE_CHECK_INTERVAL));
};

const cleanup = async () => {
    await closeQueue();
    const workers = await listRunningWorkers();
    for (const w of workers.filter(w => isWorkerRunning(w.state))) {
        await stopWorker(w);
    }
};

['SIGTERM', 'SIGINT'].forEach(sig => {
    process.on(sig, async () => {
        await cleanup();
        process.exit(0);
    });
});

process.on('uncaughtException', async err => {
    await cleanup();
    process.exit(1);
});

process.on('unhandledRejection', async (reason, p) => {
    await cleanup();
    process.exit(1);
});

(async () => {
    for (let i = 0; i < 5; i++) {
        if (await initializeQueue()) return startScalingService();
        const delay = Math.min(i * 5000, 30000);
        await new Promise(res => setTimeout(res, delay));
    }
    process.exit(1);
})();
