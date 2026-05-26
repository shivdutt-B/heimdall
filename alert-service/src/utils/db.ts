import { PrismaClient } from '@prisma/client';

/**
 * Prisma client for database operations.
 * Requires MYSQL_PRISMA_URL environment variable with the database URL.
 */
export const prisma = new PrismaClient();
