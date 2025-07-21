// Core type definitions for PurdueRide application

// Enum types for consistent status values
export enum UserVerificationStatus {
  UNVERIFIED = 'unverified',
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected'
}

export enum RideStatus {
  AVAILABLE = 'available',
  FULL = 'full',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum RideRequestStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

// Core data interfaces
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isVerified: UserVerificationStatus;
  profilePicture?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Ride {
  id: string;
  pickupLocation: string;
  destination: string;
  scheduledTime: Date;
  estimatedArrival?: Date;
  cost: number; // Fixed at $3
  availableSeats: number;
  totalSeats: number;
  status: RideStatus;
  driverId: string;
  driverName?: string;
  driverRating?: number;
  vehicleInfo?: VehicleInfo;
  createdAt: Date;
  updatedAt?: Date;
}

export interface RideRequest {
  id: string;
  userId: string;
  rideId: string;
  pickupLocation: string;
  requestedTime: Date;
  status: RideRequestStatus;
  passengerCount: number;
  specialInstructions?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface VehicleInfo {
  make: string;
  model: string;
  color: string;
  licensePlate: string;
  year?: number;
}

// Authentication related interfaces
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// API response types for consistent data handling
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  timestamp: number;
}

// Pagination request parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Specific API response types
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: number;
}

export interface RideListResponse {
  rides: Ride[];
  meta: ApiMeta;
}

export interface RideHistoryResponse {
  rides: Ride[];
  requests: RideRequest[];
  meta: ApiMeta;
}

// Notification types for real-time updates
export interface RideStatusUpdate {
  rideId: string;
  status: RideStatus;
  estimatedArrival?: Date;
  driverLocation?: GeoLocation;
  message?: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

// Form state interfaces
export interface FormState<T> {
  data: T;
  errors: Record<keyof T, string>;
  isSubmitting: boolean;
  isValid: boolean;
}