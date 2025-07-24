// Test data helper utility for development and testing
import { apiService } from '../services/api';
import { mockDataStore } from './mockDataGenerator';
import type { User, Ride, RideRequest } from '../types';
import { UserVerificationStatus } from '../types';

/**
 * TestDataHelper provides utilities for working with mock data during development
 */
export class TestDataHelper {
  /**
   * Create a test user with predefined credentials for easy login testing
   * @param email Email address (defaults to test@purdue.edu)
   * @param password Password (defaults to 'password123')
   * @returns The created test user
   */
  static createTestUser(email: string = 'test@purdue.edu', password: string = 'password123'): User {
    // Create a test user with the specified email
    const testUser: User = {
      id: `test-user-${Date.now()}`,
      email,
      firstName: 'Test',
      lastName: 'User',
      phoneNumber: '7651234567',
      isVerified: UserVerificationStatus.VERIFIED,
      profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Add the user to the mock data store
    mockDataStore.users.push(testUser);
    
    // Log the credentials for easy reference
    console.log('Test user created:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password} (not actually validated in mock implementation)`);
    
    return testUser;
  }
  
  /**
   * Create multiple test users with sequential emails
   * @param count Number of users to create
   * @returns Array of created test users
   */
  static createMultipleTestUsers(count: number): User[] {
    const users: User[] = [];
    
    for (let i = 1; i <= count; i++) {
      const email = `test${i}@purdue.edu`;
      const user = this.createTestUser(email);
      users.push(user);
    }
    
    return users;
  }
  
  /**
   * Get all mock users
   * @returns Array of all mock users
   */
  static getAllUsers(): User[] {
    return mockDataStore.users;
  }
  
  /**
   * Get all mock rides
   * @returns Array of all mock rides
   */
  static getAllRides(): Ride[] {
    return mockDataStore.rides;
  }
  
  /**
   * Get all mock ride requests
   * @returns Array of all mock ride requests
   */
  static getAllRideRequests(): RideRequest[] {
    return mockDataStore.rideRequests;
  }
  
  /**
   * Reset the mock data store to its initial state
   * This is useful for testing scenarios that require a clean slate
   */
  static resetMockData(): void {
    // Clear the arrays
    mockDataStore.users.length = 0;
    mockDataStore.rides.length = 0;
    mockDataStore.rideRequests.length = 0;
    
    // Re-populate with fresh data
    const { generateMockUsers, generateMockRides, generateMockRideRequests } = require('./mockDataGenerator');
    
    mockDataStore.users.push(...generateMockUsers(20));
    mockDataStore.rides.push(...generateMockRides(15));
    mockDataStore.rideRequests.push(...generateMockRideRequests(30));
    
    console.log('Mock data has been reset');
  }
  
  /**
   * Set the error rate for API calls
   * @param rate Number between 0 and 1 (0 = never fail, 1 = always fail)
   */
  static setApiErrorRate(rate: number): void {
    // Access the private method through type assertion
    (apiService as any).setErrorRate(rate);
    console.log(`API error rate set to ${rate * 100}%`);
  }
  
  /**
   * Print all test users to console for debugging
   */
  static logAllUsers(): void {
    console.log('All mock users:');
    mockDataStore.users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName} (${user.email})`);
    });
  }
}

// Create a default test user on module import for convenience
TestDataHelper.createTestUser();

export default TestDataHelper;