// Simple test script to verify configuration loading
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log('Testing environment configuration...');

try {
  // Test environment validation
  const { validateEnvironment, config } = require('./dist/config/environment');
  
  console.log('✅ Environment module loaded successfully');
  
  // This should fail with placeholder values
  try {
    validateEnvironment();
    console.log('✅ Environment validation passed');
    console.log('Configuration:', {
      NODE_ENV: config.NODE_ENV,
      PORT: config.PORT,
      HOST: config.HOST,
      SUPABASE_URL: config.SUPABASE_URL.replace(/\/\/.*\.supabase\.co/, '//[PROJECT_ID].supabase.co'),
      CORS_ORIGIN: config.CORS_ORIGIN,
      LOG_LEVEL: config.LOG_LEVEL
    });
  } catch (error) {
    console.log('⚠️ Environment validation failed (expected with placeholder values):', error.message);
  }
  
} catch (error) {
  console.error('❌ Configuration test failed:', error);
  process.exit(1);
}

console.log('✅ Configuration test completed');