import { supabase, supabaseAdmin, checkSupabaseConnection, DatabaseHealthCheck } from './supabase';
import { logger } from '../utils/logger';
import { config } from './environment';

// Database connection statistics
interface ConnectionStats {
  totalConnections: number;
  activeConnections: number;
  idleConnections: number;
  maxConnections: number;
}

// Database configuration
export const databaseConfig = {
  // Connection pool settings
  pool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 30000,
    createTimeoutMillis: 30000,
    destroyTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 200,
  },
  
  // Query timeout settings
  query: {
    timeout: 30000, // 30 seconds
    retries: 3,
    retryDelay: 1000, // 1 second
  },
  
  // Health check settings
  healthCheck: {
    interval: 30000, // 30 seconds
    timeout: 5000,   // 5 seconds
    retries: 3,
  }
};

/**
 * Get database connection statistics
 * @returns Promise<ConnectionStats | null>
 */
export const getConnectionStats = async (): Promise<ConnectionStats | null> => {
  try {
    const { data, error } = await supabaseAdmin
      .from('pg_stat_activity')
      .select('state, count(*)')
      .not('state', 'is', null);

    if (error) {
      logger.error('Failed to get connection stats:', error);
      return null;
    }

    // Parse connection statistics
    let totalConnections = 0;
    let activeConnections = 0;
    let idleConnections = 0;

    if (data) {
      data.forEach((row: any) => {
        const count = parseInt(row.count) || 0;
        totalConnections += count;
        
        if (row.state === 'active') {
          activeConnections += count;
        } else if (row.state === 'idle') {
          idleConnections += count;
        }
      });
    }

    return {
      totalConnections,
      activeConnections,
      idleConnections,
      maxConnections: databaseConfig.pool.max
    };
  } catch (error) {
    logger.error('Error getting connection stats:', error);
    return null;
  }
};

/**
 * Test database performance with a simple query
 * @returns Promise<{ responseTime: number, success: boolean }>
 */
export const testDatabasePerformance = async (): Promise<{ responseTime: number, success: boolean }> => {
  const startTime = Date.now();
  
  try {
    const { error } = await supabase
      .from('pg_stat_activity')
      .select('count', { count: 'exact', head: true })
      .limit(1);

    const responseTime = Date.now() - startTime;
    
    if (error) {
      logger.warn('Database performance test failed:', error);
      return { responseTime, success: false };
    }

    return { responseTime, success: true };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    logger.error('Database performance test error:', error);
    return { responseTime, success: false };
  }
};

/**
 * Execute a query with retry logic
 * @param queryFn - Function that executes the query
 * @param retries - Number of retries (default: 3)
 * @returns Promise<any>
 */
export const executeWithRetry = async <T>(
  queryFn: () => Promise<T>,
  retries: number = databaseConfig.query.retries
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await queryFn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === retries) {
        logger.error(`Query failed after ${retries} attempts:`, error);
        throw error;
      }
      
      logger.warn(`Query attempt ${attempt} failed, retrying in ${databaseConfig.query.retryDelay}ms:`, error);
      await new Promise(resolve => setTimeout(resolve, databaseConfig.query.retryDelay));
    }
  }
  
  throw lastError!;
};

/**
 * Comprehensive database health check
 * @returns Promise<object> - Detailed health information
 */
export const getDatabaseHealth = async () => {
  const startTime = Date.now();
  
  try {
    // Get basic health check
    const healthCheck = await checkSupabaseConnection();
    
    // Get connection statistics
    const connectionStats = await getConnectionStats();
    
    // Test performance
    const performanceTest = await testDatabasePerformance();
    
    // Get database version and info
    let databaseInfo = null;
    try {
      const { data: versionData } = await supabaseAdmin
        .from('pg_stat_activity')
        .select('version()')
        .limit(1)
        .single();
      
      databaseInfo = versionData;
    } catch (error) {
      logger.debug('Could not retrieve database version:', error);
    }

    const totalTime = Date.now() - startTime;

    return {
      timestamp: new Date().toISOString(),
      healthy: healthCheck.supabase && healthCheck.database,
      services: healthCheck,
      performance: {
        responseTime: performanceTest.responseTime,
        healthCheckTime: totalTime,
        success: performanceTest.success
      },
      connections: connectionStats,
      database: databaseInfo,
      configuration: {
        environment: config.NODE_ENV,
        poolSize: databaseConfig.pool.max,
        queryTimeout: databaseConfig.query.timeout
      }
    };
  } catch (error) {
    logger.error('Database health check failed:', error);
    return {
      timestamp: new Date().toISOString(),
      healthy: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      performance: {
        responseTime: Date.now() - startTime,
        success: false
      }
    };
  }
};

/**
 * Initialize database monitoring
 */
export const initializeDatabaseMonitoring = () => {
  // Set up periodic health checks
  setInterval(async () => {
    try {
      const health = await getDatabaseHealth();
      if (!health.healthy) {
        logger.warn('Database health check failed:', health);
      } else {
        logger.debug('Database health check passed:', {
          responseTime: health.performance?.responseTime,
          connections: health.connections?.totalConnections
        });
      }
    } catch (error) {
      logger.error('Database monitoring error:', error);
    }
  }, databaseConfig.healthCheck.interval);

  logger.info('Database monitoring initialized');
};

// Export database clients for convenience
export { supabase, supabaseAdmin };
export { checkSupabaseConnection as isHealthy };

logger.info('Database configuration module loaded');