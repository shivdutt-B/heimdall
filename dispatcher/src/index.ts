import { PrismaClient } from '@prisma/client';
import { Queue } from 'bullmq';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const pingQueue = new Queue('ping-queue', {
  connection: {
    host: 'redis-16473.c256.us-east-1-2.ec2.redns.redis-cloud.com',
    port: 16473,
    username: 'default',
    password: 'EpZOWKXnPEzGjRAccbfgn7oqxCoxopAt'
  },
});

async function findServersToDispatch() {
  try {
    const servers = await prisma.server.findMany({
      where: {
        AND: [
          { isActive: true },
          { nextPingAt: { lte: new Date() } }
        ]
      }
    });

    for (const server of servers) {
      // Add job to the queue
      await pingQueue.add('ping-server', {
        serverId: server.id,
        url: server.url,
        userId: server.userId
      });

      // Update next ping time
      await prisma.server.update({
        where: { id: server.id },
        data: {
          lastPingedAt: new Date(),
          nextPingAt: new Date(Date.now() + server.pingInterval * 1000) // Convert seconds to milliseconds
        }
      });
    }

    console.log(`Dispatched ${servers.length} ping jobs at ${new Date().toISOString()}`);
  } catch (error) {
    console.error('Error in dispatcher:', error);
  }
}

// Run the dispatcher every 60 seconds
setInterval(findServersToDispatch, 60000);

// Initial run
findServersToDispatch();

// Handle Redis connection errors
pingQueue.on('error', (error) => {
  console.error('Redis Queue Error:', error);
});

// Handle process termination
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  await pingQueue.close();
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', async (error) => {
  console.error('Uncaught Exception:', error);
  await prisma.$disconnect();
  await pingQueue.close();
  process.exit(1);
});
