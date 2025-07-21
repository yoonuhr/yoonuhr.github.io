// Core type definitions for PurdueRide application

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isVerified: boolean;
  createdAt: Date;
}

export interface Ride {
  id: string;
  pickupLocation: string;
  destination: string;
  scheduledTime: Date;
  cost: number; // Fixed at $3
  availableSeats: number;
  status: 'available' | 'full' | 'in-progress' | 'completed';
  driverId: string;
}

export interface RideRequest {
  id: string;
  userId: string;
  rideId: string;
  pickupLocation: string;
  requestedTime: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
}

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