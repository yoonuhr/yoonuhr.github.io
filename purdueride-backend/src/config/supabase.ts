import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { logger } from '../utils/logger';
import { config } from './environment';

// Database health check interface
export interface DatabaseHealthCheck {
  supabase: boolean;
  database: boolean;
  auth: boolean;
  storage: boolean;
  realtime: boolean;
}

// Connection pool configuration
const connectionConfig = {
  auth: {
    autoRefreshToken: true,
    persistSession: false, // Server-side, don't persist sessions
    detectSessionInUrl: false,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'X-Client-Info': 'purdueride-backend@1.0.0',
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
};

// Create Supabase client for general use (with RLS)
export const supabase = createClient(
  config.SUPABASE_URL,
  config.SUPABASE_ANON_KEY,
  {
    ...connectionConfig,
    auth: {
      ...connectionConfig.auth,
      autoRefreshToken: true,
    },
  }
);

// Create Supabase admin client (bypasses RLS)
export const supabaseAdmin = createClient(
  config.SUPABASE_URL,
  config.SUPABASE_SERVICE_ROLE_KEY,
  {
    ...connectionConfig,
    auth: {
      ...connectionConfig.auth,
      autoRefreshToken: false,
    },
  }
);

/**
 * Comprehensive health check for all Supabase services
 * @returns Promise<DatabaseHealthCheck> - Status of all services
 */
export const checkSupabaseConnection = async (): Promise<DatabaseHealthCheck> => {
  const healthCheck: DatabaseHealthCheck = {
    supabase: false,
    database: false,
    auth: false,
    storage: false,
    realtime: false,
  };

  try {
    // Test basic Supabase connection
    const { data: supabaseStatus, error: supabaseError } = await supabase
      .from('pg_stat_activity')
      .select('count', { count: 'exact', head: true })
      .limit(1);

    if (!supabaseError) {
      healthCheck.supabase = true;
      healthCheck.database = true;
    }

    // Test Auth service
    try {
      const { data: authData, error: authError } = await supabase.auth.getSession();
      if (!authError) {
        healthCheck.auth = true;
      }
    } catch (authErr) {
      logger.debug('Auth service check failed:', authErr);
    }

    // Test Storage service
    try {
      const { data: buckets, error: storageError } = await supabaseAdmin.storage.listBuckets();
      if (!storageError) {
        healthCheck.storage = true;
      }
    } catch (storageErr) {
      logger.debug('Storage service check failed:', storageErr);
    }

    // Test Realtime service (basic connection test)
    try {
      // Create a temporary channel to test realtime connectivity
      const channel = supabase.channel('health-check');
      healthCheck.realtime = true; // If we can create a channel, realtime is available
      await supabase.removeChannel(channel);
    } catch (realtimeErr) {
      logger.debug('Realtime service check failed:', realtimeErr);
    }

  } catch (error) {
    logger.error('Supabase connection check error:', error);
  }

  return healthCheck;
};

/**
 * Simple boolean health check for backward compatibility
 * @returns Promise<boolean> - True if database is connected
 */
export const isSupabaseHealthy = async (): Promise<boolean> => {
  const healthCheck = await checkSupabaseConnection();
  return healthCheck.supabase && healthCheck.database;
};

/**
 * Initialize database connection and perform startup checks
 * @returns Promise<void>
 */
export const initializeDatabase = async (): Promise<void> => {
  try {
    logger.info('Initializing Supabase connection...');
    
    const healthCheck = await checkSupabaseConnection();
    
    if (!healthCheck.supabase || !healthCheck.database) {
      throw new Error('Failed to establish connection to Supabase database');
    }

    logger.info('Supabase services status:', {
      supabase: healthCheck.supabase ? '✅' : '❌',
      database: healthCheck.database ? '✅' : '❌',
      auth: healthCheck.auth ? '✅' : '❌',
      storage: healthCheck.storage ? '✅' : '❌',
      realtime: healthCheck.realtime ? '✅' : '❌',
    });

    // Test admin client permissions
    try {
      const { data: adminTest, error: adminError } = await supabaseAdmin
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .limit(1);

      if (adminError) {
        logger.warn('Admin client test failed:', adminError.message);
      } else {
        logger.info('Admin client permissions verified');
      }
    } catch (adminErr) {
      logger.warn('Admin client verification failed:', adminErr);
    }

    logger.info('✅ Supabase initialization completed successfully');
    
  } catch (error) {
    logger.error('❌ Supabase initialization failed:', error);
    throw error;
  }
};

/**
 * Graceful shutdown of database connections
 * @returns Promise<void>
 */
export const closeDatabase = async (): Promise<void> => {
  try {
    logger.info('Closing Supabase connections...');
    
    // Remove all channels and subscriptions
    await supabase.removeAllChannels();
    
    logger.info('✅ Supabase connections closed successfully');
  } catch (error) {
    logger.error('❌ Error closing Supabase connections:', error);
  }
};

// Connection event handlers
supabase.auth.onAuthStateChange((event, session) => {
  logger.debug(`Auth state changed: ${event}`, { 
    userId: session?.user?.id,
    email: session?.user?.email 
  });
});

logger.info('Supabase clients initialized successfully');

export default supabase;