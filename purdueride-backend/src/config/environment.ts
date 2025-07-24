import dotenv from 'dotenv';
import { logger } from '../utils/logger';

// Load environment variables
dotenv.config();

// Environment configuration interface
interface EnvironmentConfig {
  // Server Configuration
  NODE_ENV: 'development' | 'staging' | 'production';
  PORT: number;
  HOST: string;
  
  // Supabase Configuration
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  
  // Security Configuration
  CORS_ORIGIN: string;
  
  // External Services
  EMAIL_SERVICE_API_KEY?: string;
  
  // Logging Configuration
  LOG_LEVEL: string;
  LOG_FILE_PATH: string;
}

// Required environment variables
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];

// Optional environment variables with defaults
const defaultValues = {
  NODE_ENV: 'development' as const,
  PORT: 3001,
  HOST: 'localhost',
  CORS_ORIGIN: 'http://localhost:3000',
  LOG_LEVEL: 'info',
  LOG_FILE_PATH: 'logs/app.log'
};

/**
 * Validates that all required environment variables are present
 * @throws Error if required environment variables are missing
 */
export const validateEnvironment = (): void => {
  const missingVars: string[] = [];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  }
  
  if (missingVars.length > 0) {
    const errorMessage = `Missing required environment variables: ${missingVars.join(', ')}`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
  
  // Validate Supabase URL format
  const supabaseUrl = process.env.SUPABASE_URL!;
  if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
    throw new Error('SUPABASE_URL must be a valid Supabase project URL');
  }
  
  // Check for placeholder values
  if (supabaseUrl.includes('placeholder') || supabaseUrl === 'https://placeholder.supabase.co') {
    throw new Error('SUPABASE_URL contains placeholder values. Please configure with actual Supabase project URL');
  }
  
  // Validate keys are not placeholder values
  const anonKey = process.env.SUPABASE_ANON_KEY!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  if (anonKey.includes('placeholder') || anonKey === 'placeholder-anon-key') {
    throw new Error('SUPABASE_ANON_KEY contains placeholder values. Please configure with actual Supabase anonymous key');
  }
  
  if (serviceKey.includes('placeholder') || serviceKey === 'placeholder-service-role-key') {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY contains placeholder values. Please configure with actual Supabase service role key');
  }
  
  // Validate NODE_ENV
  const nodeEnv = process.env.NODE_ENV;
  if (nodeEnv && !['development', 'staging', 'production'].includes(nodeEnv)) {
    logger.warn(`Invalid NODE_ENV value: ${nodeEnv}. Using default: development`);
  }
  
  // Validate PORT
  const port = process.env.PORT;
  if (port && (isNaN(Number(port)) || Number(port) < 1 || Number(port) > 65535)) {
    logger.warn(`Invalid PORT value: ${port}. Using default: ${defaultValues.PORT}`);
  }
  
  logger.info('Environment validation completed successfully');
};

/**
 * Configuration object with validated environment variables
 */
export const config: EnvironmentConfig = {
  NODE_ENV: (process.env.NODE_ENV as 'development' | 'staging' | 'production') || defaultValues.NODE_ENV,
  PORT: process.env.PORT ? Number(process.env.PORT) : defaultValues.PORT,
  HOST: process.env.HOST || defaultValues.HOST,
  SUPABASE_URL: process.env.SUPABASE_URL!,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  CORS_ORIGIN: process.env.CORS_ORIGIN || defaultValues.CORS_ORIGIN,
  EMAIL_SERVICE_API_KEY: process.env.EMAIL_SERVICE_API_KEY,
  LOG_LEVEL: process.env.LOG_LEVEL || defaultValues.LOG_LEVEL,
  LOG_FILE_PATH: process.env.LOG_FILE_PATH || defaultValues.LOG_FILE_PATH
};

// Log configuration (without sensitive data)
logger.info('Configuration loaded:', {
  NODE_ENV: config.NODE_ENV,
  PORT: config.PORT,
  HOST: config.HOST,
  SUPABASE_URL: config.SUPABASE_URL.replace(/\/\/.*\.supabase\.co/, '//[PROJECT_ID].supabase.co'),
  CORS_ORIGIN: config.CORS_ORIGIN,
  LOG_LEVEL: config.LOG_LEVEL,
  LOG_FILE_PATH: config.LOG_FILE_PATH,
  EMAIL_SERVICE_CONFIGURED: !!config.EMAIL_SERVICE_API_KEY
});