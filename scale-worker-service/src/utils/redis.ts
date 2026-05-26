import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();
dotenv.config({ path: '.env.worker-service' });

const {
    REDIS_HOST = 'localhost',
    REDIS_PORT = '6379',
    REDIS_USERNAME,
    REDIS_PASSWORD
} = process.env;

export const REDIS_CONFIG = {
    host: REDIS_HOST,
    port: parseInt(REDIS_PORT),
    username: REDIS_USERNAME,
    password: REDIS_PASSWORD,
    maxRetriesPerRequest: null, // Set to null for BullMQ compatibility
    retryStrategy: (times: number) => Math.min(times * 1000, 5000)
};
