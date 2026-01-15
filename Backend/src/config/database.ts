import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Instance
 * This is a singleton pattern - we create only one instance
 * and reuse it throughout the application
 */

/**
 * Prisma Client Instance
 * This is a singleton pattern - we create only one instance
 * and reuse it throughout the application
 */

// Create Prisma Client instance
export const prisma: PrismaClient =
  (global as any).prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'], // Log database queries in development
  });

// In development, store the instance globally to prevent
// creating multiple instances during hot reloading
if (process.env.NODE_ENV !== 'production') {
  (global as any).prisma = prisma;
}

/**
 * Connect to database
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

/**
 * Disconnect from database
 */
export const disconnectDatabase = async (): Promise<void> => {
  await prisma.$disconnect();
  console.log('🔌 Database disconnected');
};

export default prisma;
