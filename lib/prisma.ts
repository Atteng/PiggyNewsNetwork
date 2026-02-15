import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL;
const directConnectionString = process.env.DATABASE_URL_DIRECT;

// Try pooler first, fallback to direct connection on DNS errors
let pool: Pool;
try {
    pool = new Pool({
        connectionString,
        connectionTimeoutMillis: 5000,
    });
} catch (error) {
    console.warn('Pooler connection failed, using direct connection:', error);
    pool = new Pool({
        connectionString: directConnectionString,
        connectionTimeoutMillis: 10000,
    });
}

const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        adapter,
        log: ['query'],
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
