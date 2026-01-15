// src/config/env.ts
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Configuration object that holds all environment variables
 * This centralizes all env variables in one place
 */
export const config = {
  // Server configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database configuration
  databaseUrl: process.env.DATABASE_URL,

  // JWT (JSON Web Token) configuration for authentication
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    expiresIn: '7d', // Token expires in 7 days
  },

  // CORS (Cross-Origin Resource Sharing) configuration
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
};

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export default config;
