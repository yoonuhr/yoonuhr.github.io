import { logger } from './utils/logger';
import { validateEnvironment, config } from './config/environment';
import { initializeDatabase, closeDatabase } from './config/supabase';

/**
 * Initialize and start the server
 */
async function startServer() {
  try {
    // Validate environment variables first
    logger.info('🔧 Validating environment configuration...');
    validateEnvironment();
    
    // Initialize database connection
    logger.info('🗄️ Initializing database connection...');
    await initializeDatabase();
    
    // Import app after environment validation and database initialization
    const app = (await import('./app')).default;
    
    // Start server
    const server = app.listen(config.PORT, config.HOST, () => {
      logger.info(`🚀 PurdueRide Backend Server running on http://${config.HOST}:${config.PORT}`);
      logger.info(`📝 Environment: ${config.NODE_ENV}`);
      logger.info(`🔗 CORS Origin: ${config.CORS_ORIGIN}`);
      logger.info('✅ Server startup completed successfully');
    });

    // Graceful shutdown handlers
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received, shutting down gracefully...`);
      
      // Close HTTP server
      server.close(async () => {
        logger.info('HTTP server closed');
        
        try {
          // Close database connections
          await closeDatabase();
          logger.info('Database connections closed');
          
          logger.info('✅ Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          logger.error('❌ Error during graceful shutdown:', error);
          process.exit(1);
        }
      });
      
      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('⚠️ Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('❌ Uncaught Exception:', error);
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });

    return server;
    
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer().catch((error) => {
  logger.error('❌ Server startup failed:', error);
  process.exit(1);
});

export default startServer;