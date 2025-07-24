// Test setup configuration
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';

// Global test setup
beforeAll(async () => {
  // Setup test database connections, etc.
});

afterAll(async () => {
  // Cleanup test resources
});

// Increase timeout for integration tests
jest.setTimeout(30000);