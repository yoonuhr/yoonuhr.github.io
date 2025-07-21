// API-specific type definitions

import type { User, Ride, RideRequest, ApiResponse, ApiMeta } from './index';

// API endpoints configuration
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        LOGOUT: '/api/auth/logout',
        REFRESH: '/api/auth/refresh',
        VERIFY: '/api/auth/verify'
    },
    RIDES: {
        AVAILABLE: '/api/rides/available',
        REQUEST: '/api/rides/request',
        HISTORY: '/api/rides/history',
        STATUS: '/api/rides/status',
        CANCEL: '/api/rides/cancel'
    },
    USER: {
        PROFILE: '/api/user/profile',
        UPDATE: '/api/user/update',
        VERIFY: '/api/user/verify'
    }
};

// API request types
export interface LoginRequest {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

export interface RideRequestPayload {
    pickupLocation: string;
    destination: string;
    requestedTime: Date | string;
    passengerCount: number;
    specialInstructions?: string;
}

export interface UpdateProfileRequest {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    profilePicture?: File | string;
}

// API response types
export interface AuthResponseData {
    user: User;
    token: string;
    refreshToken: string;
    expiresAt: number;
}

export type LoginResponse = ApiResponse<AuthResponseData>;
export type RegisterResponse = ApiResponse<AuthResponseData>;
export type LogoutResponse = ApiResponse<{ success: boolean }>;

export interface AvailableRidesResponseData {
    rides: Ride[];
    meta: ApiMeta;
}

export type AvailableRidesResponse = ApiResponse<AvailableRidesResponseData>;

export interface RideHistoryResponseData {
    rides: Ride[];
    requests: RideRequest[];
    meta: ApiMeta;
}

export type RideHistoryResponse = ApiResponse<RideHistoryResponseData>;
export type RideStatusResponse = ApiResponse<Ride>;
export type RideRequestResponse = ApiResponse<RideRequest>;
export type UserProfileResponse = ApiResponse<User>;

// Error response types
export interface ValidationError {
    field: string;
    message: string;
}

export interface ApiValidationErrorDetails {
    validationErrors: ValidationError[];
}

// Mock data types
export interface MockDataOptions {
    delay?: number;
    shouldFail?: boolean;
    errorMessage?: string;
    errorCode?: string;
}