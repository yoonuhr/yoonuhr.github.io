import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { logger } from './utils/logger';
import { config } from './config/environment';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true
}));

// Request logging
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim())
  }
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const { checkSupabaseConnection } = await import('./config/supabase');
    const { config } = await import('./config/environment');
    
    const healthCheck = await checkSupabaseConnection();
    const isHealthy = healthCheck.supabase && healthCheck.database;
    
    const healthStatus = {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.NODE_ENV,
      version: '1.0.0',
      services: {
        supabase: healthCheck.supabase ? 'connected' : 'disconnected',
        database: healthCheck.database ? 'connected' : 'disconnected',
        auth: healthCheck.auth ? 'available' : 'unavailable',
        storage: healthCheck.storage ? 'available' : 'unavailable',
        realtime: healthCheck.realtime ? 'available' : 'unavailable'
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024)
      }
    };

    const statusCode = isHealthy ? 200 : 503;
    res.status(statusCode).json(healthStatus);
  } catch (error) {
    logger.error('Health check error:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      services: {
        supabase: 'disconnected',
        database: 'disconnected',
        auth: 'unavailable',
        storage: 'unavailable',
        realtime: 'unavailable'
      },
      error: 'Health check failed'
    });
  }
});

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'PurdueRide Backend API',
    version: '1.0.0',
    status: 'running'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: 'The requested route was not found'
    }
  });
});

export default app;