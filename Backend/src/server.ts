// src/server.ts
import createApp from './app.js';
import config from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';

/**
 * Start the server
 */
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Create Express app
    const app = createApp();

    // Start listening
    const server = app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
      console.log(`📍 Environment: ${config.nodeEnv}`);
      console.log(`🔗 Health check: http://localhost:${config.port}/health`);
    });

    // Graceful shutdown
    const gracefulShutdown = async () => {
      console.log('\n⏳ Shutting down gracefully...');

      server.close(async () => {
        await disconnectDatabase();
        console.log('👋 Server closed');
        process.exit(0);
      });

      // Force close after 10 seconds
      setTimeout(() => {
        console.error('⚠️ Forcing shutdown');
        process.exit(1);
      }, 10000);
    };

    // Listen for termination signals
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
