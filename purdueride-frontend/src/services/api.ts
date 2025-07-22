// API Service layer with mock implementations for development and testing
import type { 
  User, 
  Ride, 
  RideRequest, 
  RegisterData,
  AuthResponse,
  RideListResponse,
  RideHistoryResponse,
  ApiResponse,
  ApiError
} from '../types';
import { RideStatus, RideRequestStatus } from '../types';
import type { 
  RideRequestPayload,
  UpdateProfileRequest
} from '../types/api';
import { 
  mockApiRequest, 
  generateMockUser, 
  generateMockRideRequest,
  mockDataStore
} from '../utils/mockDataGenerator';

/**
 * API Service class that provides mock implementations of all API endpoints
 * This will be replaced with actual API calls when the backend is ready
 */
class ApiService {
  // Store for persisting mock data during the session
  private mockUsers: User[] = mockDataStore.users;
  private mockRides: Ride[] = mockDataStore.rides;
  private mockRideRequests: RideRequest[] = mockDataStore.rideRequests;
  
  // Current authenticated user (if any)
  private currentUser: User | null = null;
  
  // Default error simulation rate (10%)
  private errorRate: number = 0.1;
  
  /**
   * Set the error simulation rate
   * @param rate Number between 0 and 1 (0 = never fail, 1 = always fail)
   */
  setErrorRate(rate: number): void {
    this.errorRate = Math.max(0, Math.min(1, rate));
  }
  
  /**
   * Helper to create API error responses
   */
  private createErrorResponse<T>(
    message: string = 'An unexpected error occurred',
    code: string = 'ERR_UNKNOWN',
    details?: Record<string, any>
  ): ApiResponse<T> {
    const error: ApiError = {
      code,
      message,
      details
    };
    
    return {
      success: false,
      error,
      meta: {
        timestamp: Date.now()
      }
    };
  }
  
  /**
   * Helper to create successful API responses
   */
  private createSuccessResponse<T>(data: T): ApiResponse<T> {
    return {
      success: true,
      data,
      meta: {
        timestamp: Date.now()
      }
    };
  }
  
  /**
   * Find a user by email (case insensitive)
   */
  private findUserByEmail(email: string): User | undefined {
    return this.mockUsers.find(
      user => user.email.toLowerCase() === email.toLowerCase()
    );
  }
  
  /**
   * Find a user by ID
   * @private
   * @param id User ID to find
   * @returns The found user or undefined
   * @note This method is currently unused but kept for future use
   */
  // @ts-ignore - This method is kept for future use
  private findUserById(id: string): User | undefined {
    return this.mockUsers.find(user => user.id === id);
  }
  
  /**
   * Find a ride by ID
   */
  private findRideById(id: string): Ride | undefined {
    return this.mockRides.find(ride => ride.id === id);
  }
  
  /**
   * Find ride requests by user ID
   */
  private findRideRequestsByUserId(userId: string): RideRequest[] {
    return this.mockRideRequests.filter(request => request.userId === userId);
  }

  // Authentication methods
  /**
   * Login with email and password
   * @param email User email
   * @param password User password (not validated in mock implementation, only used for API signature)
   * @returns Promise with user data and auth tokens
   */
  // @ts-ignore - Password is not used in the mock implementation but kept for API signature
  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    return mockApiRequest(
      () => {
        // Find user by email
        const user = this.findUserByEmail(email);
        
        if (!user) {
          return this.createErrorResponse<AuthResponse>(
            'Invalid email or password',
            'AUTH_INVALID_CREDENTIALS'
          );
        }
        
        // Set as current user
        this.currentUser = user;
        
        // Create auth response with tokens
        const authResponse: AuthResponse = {
          user,
          token: `mock-jwt-token-${Date.now()}`,
          refreshToken: `mock-refresh-token-${Date.now()}`,
          expiresAt: Date.now() + 3600000 // 1 hour from now
        };
        
        return this.createSuccessResponse(authResponse);
      },
      { 
        shouldFail: Math.random() < this.errorRate,
        errorMessage: 'Login failed. Please try again.',
        errorCode: 'AUTH_ERROR'
      }
    );
  }

  /**
   * Register a new user
   * @param userData User registration data
   * @returns Promise with created user data and auth tokens
   */
  async register(userData: RegisterData): Promise<ApiResponse<AuthResponse>> {
    return mockApiRequest(
      () => {
        // Check if email already exists
        const existingUser = this.findUserByEmail(userData.email);
        
        if (existingUser) {
          return this.createErrorResponse<AuthResponse>(
            'Email already in use',
            'AUTH_EMAIL_IN_USE'
          );
        }
        
        // Validate Purdue email
        if (!userData.email.toLowerCase().endsWith('@purdue.edu')) {
          return this.createErrorResponse<AuthResponse>(
            'Registration requires a valid Purdue email address',
            'AUTH_INVALID_EMAIL_DOMAIN'
          );
        }
        
        // Create new user
        const newUser: User = {
          ...generateMockUser(),
          id: `user-${Date.now()}`,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phoneNumber: userData.phoneNumber,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Add to mock users
        this.mockUsers.push(newUser);
        
        // Set as current user
        this.currentUser = newUser;
        
        // Create auth response
        const authResponse: AuthResponse = {
          user: newUser,
          token: `mock-jwt-token-${Date.now()}`,
          refreshToken: `mock-refresh-token-${Date.now()}`,
          expiresAt: Date.now() + 3600000 // 1 hour from now
        };
        
        return this.createSuccessResponse(authResponse);
      },
      {
        shouldFail: Math.random() < this.errorRate,
        errorMessage: 'Registration failed. Please try again.',
        errorCode: 'AUTH_ERROR'
      }
    );
  }

  /**
   * Logout the current user
   * @returns Promise with logout success status
   */
  async logout(): Promise<ApiResponse<{ success: boolean }>> {
    return mockApiRequest(
      () => {
        // Clear current user
        this.currentUser = null;
        
        return this.createSuccessResponse({ success: true });
      },
      {
        delay: 500, // Faster response for logout
        shouldFail: Math.random() < this.errorRate / 2, // Lower failure rate for logout
        errorMessage: 'Logout failed. Please try again.',
        errorCode: 'AUTH_ERROR'
      }
    );
  }

  /**
   * Get the current authenticated user
   * @returns Promise with current user data or null
   */
  async getCurrentUser(): Promise<ApiResponse<User | null>> {
    return mockApiRequest(
      () => {
        return this.createSuccessResponse(this.currentUser);
      },
      {
        delay: 300, // Fast response for current user check
        shouldFail: Math.random() < this.errorRate / 2 // Lower failure rate
      }
    );
  }

  /**
   * Update user profile
   * @param userId User ID
   * @param updateData Profile update data
   * @returns Promise with updated user data
   */
  async updateProfile(userId: string, updateData: UpdateProfileRequest): Promise<ApiResponse<User>> {
    return mockApiRequest(
      () => {
        // Find user by ID
        const userIndex = this.mockUsers.findIndex(user => user.id === userId);
        
        if (userIndex === -1) {
          return this.createErrorResponse<User>(
            'User not found',
            'USER_NOT_FOUND'
          );
        }
        
        // Handle profile picture conversion if it's a File object
        let profilePicture = updateData.profilePicture;
        if (profilePicture instanceof File) {
          // In a real implementation, we would upload the file to a server
          // For mock purposes, we'll just use a placeholder URL
          profilePicture = `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`;
        }
        
        // Update user data
        const updatedUser: User = {
          ...this.mockUsers[userIndex],
          ...updateData,
          profilePicture: profilePicture as string | undefined,
          updatedAt: new Date()
        };
        
        // Update in mock users
        this.mockUsers[userIndex] = updatedUser;
        
        // Update current user if it's the same
        if (this.currentUser && this.currentUser.id === userId) {
          this.currentUser = updatedUser;
        }
        
        return this.createSuccessResponse(updatedUser);
      },
      {
        shouldFail: Math.random() < this.errorRate,
        errorMessage: 'Profile update failed. Please try again.',
        errorCode: 'USER_UPDATE_ERROR'
      }
    );
  }

  // Ride management methods
  /**
   * Get available rides
   * @returns Promise with list of available rides
   */
  async getAvailableRides(): Promise<ApiResponse<RideListResponse>> {
    return mockApiRequest(
      () => {
        // Filter available rides
        const availableRides = this.mockRides.filter(
          ride => ride.status === RideStatus.AVAILABLE || ride.status === RideStatus.IN_PROGRESS
        );
        
        // Sort by scheduled time
        availableRides.sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime());
        
        const response: RideListResponse = {
          rides: availableRides,
          meta: {
            total: availableRides.length,
            timestamp: Date.now()
          }
        };
        
        return this.createSuccessResponse(response);
      },
      {
        shouldFail: Math.random() < this.errorRate,
        errorMessage: 'Failed to fetch available rides. Please try again.',
        errorCode: 'RIDES_FETCH_ERROR'
      }
    );
  }

  /**
   * Request a ride
   * @param request Ride request data
   * @returns Promise with created ride request
   */
  async requestRide(request: RideRequestPayload): Promise<ApiResponse<RideRequest>> {
    return mockApiRequest(
      () => {
        if (!this.currentUser) {
          return this.createErrorResponse<RideRequest>(
            'Authentication required',
            'AUTH_REQUIRED'
          );
        }
        
        // Create new ride request
        const newRequest: RideRequest = {
          ...generateMockRideRequest(this.currentUser.id),
          pickupLocation: request.pickupLocation,
          requestedTime: new Date(request.requestedTime),
          passengerCount: request.passengerCount,
          specialInstructions: request.specialInstructions,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Add to mock ride requests
        this.mockRideRequests.push(newRequest);
        
        return this.createSuccessResponse(newRequest);
      },
      {
        shouldFail: Math.random() < this.errorRate,
        errorMessage: 'Failed to request ride. Please try again.',
        errorCode: 'RIDE_REQUEST_ERROR'
      }
    );
  }

  /**
   * Get ride history for a user
   * @param userId User ID
   * @returns Promise with user's ride history
   */
  async getRideHistory(userId: string): Promise<ApiResponse<RideHistoryResponse>> {
    return mockApiRequest(
      () => {
        // Find user's ride requests
        const userRequests = this.findRideRequestsByUserId(userId);
        
        // Get associated rides
        const rideIds = userRequests.map(request => request.rideId);
        const userRides = this.mockRides.filter(ride => rideIds.includes(ride.id));
        
        // Sort by date (newest first)
        userRides.sort((a, b) => b.scheduledTime.getTime() - a.scheduledTime.getTime());
        userRequests.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        
        const response: RideHistoryResponse = {
          rides: userRides,
          requests: userRequests,
          meta: {
            total: userRides.length,
            timestamp: Date.now()
          }
        };
        
        return this.createSuccessResponse(response);
      },
      {
        shouldFail: Math.random() < this.errorRate,
        errorMessage: 'Failed to fetch ride history. Please try again.',
        errorCode: 'RIDE_HISTORY_ERROR'
      }
    );
  }

  /**
   * Get status of a specific ride
   * @param rideId Ride ID
   * @returns Promise with ride status
   */
  async getRideStatus(rideId: string): Promise<ApiResponse<Ride>> {
    return mockApiRequest(
      () => {
        // Find ride by ID
        const ride = this.findRideById(rideId);
        
        if (!ride) {
          return this.createErrorResponse<Ride>(
            'Ride not found',
            'RIDE_NOT_FOUND'
          );
        }
        
        return this.createSuccessResponse(ride);
      },
      {
        shouldFail: Math.random() < this.errorRate,
        errorMessage: 'Failed to fetch ride status. Please try again.',
        errorCode: 'RIDE_STATUS_ERROR'
      }
    );
  }

  /**
   * Cancel a ride request
   * @param requestId Ride request ID
   * @returns Promise with updated ride request
   */
  async cancelRideRequest(requestId: string): Promise<ApiResponse<RideRequest>> {
    return mockApiRequest(
      () => {
        // Find request by ID
        const requestIndex = this.mockRideRequests.findIndex(req => req.id === requestId);
        
        if (requestIndex === -1) {
          return this.createErrorResponse<RideRequest>(
            'Ride request not found',
            'REQUEST_NOT_FOUND'
          );
        }
        
        // Update request status
        const updatedRequest: RideRequest = {
          ...this.mockRideRequests[requestIndex],
          status: RideRequestStatus.CANCELLED,
          updatedAt: new Date()
        };
        
        // Update in mock requests
        this.mockRideRequests[requestIndex] = updatedRequest;
        
        return this.createSuccessResponse(updatedRequest);
      },
      {
        shouldFail: Math.random() < this.errorRate,
        errorMessage: 'Failed to cancel ride request. Please try again.',
        errorCode: 'CANCEL_REQUEST_ERROR'
      }
    );
  }
}

export const apiService = new ApiService();
export default ApiService;