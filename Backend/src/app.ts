import express from 'express';
import type { Application } from 'express';
import cors from 'cors';
import config from './config/env.js';
import authRoutes from './routes/authRoute.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

/**
 * Create and configure Express application
 */
const createApp = (): Application => {
  const app = express();

  // ========================
  // Middleware
  // ========================

  // Enable CORS (Cross-Origin Resource Sharing)
  // Allows frontend to communicate with backend
  app.use(
    cors({
      origin: config.cors.origin,
      credentials: true, // Allow cookies
    }),
  );

  // Parse JSON request bodies
  app.use(express.json());

  // Parse URL-encoded request bodies (form data)
  app.use(express.urlencoded({ extended: true }));

  // Log requests in development
  if (config.nodeEnv === 'development') {
    app.use((req, res, next) => {
      console.log(`📨 ${req.method} ${req.path}`);
      next();
    });
  }

  // ========================
  // Routes
  // ========================

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      success: true,
      message: 'Server is running',
      timestamp: new Date().toISOString(),
    });
  });

  // API Routes
  app.use('/api/auth', authRoutes);

  // ========================
  // Error Handling
  // ========================

  // 404 handler (route not found)
  app.use(notFound);

  // Global error handler
  app.use(errorHandler);

  return app;
};

export default createApp;
