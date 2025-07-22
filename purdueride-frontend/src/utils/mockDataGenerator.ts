// Mock data generator utility for development and testing
import type {
    User,
    Ride,
    RideRequest,
    VehicleInfo
} from '../types';
import {
    UserVerificationStatus,
    RideStatus,
    RideRequestStatus
} from '../types';
import type { MockDataOptions } from '../types/api';

// Helper to generate random IDs
const generateId = (): string => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Helper to generate random dates within a range
const randomDate = (start: Date, end: Date): Date => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper to pick a random item from an array
const randomItem = <T>(items: T[]): T => {
    return items[Math.floor(Math.random() * items.length)];
};

// Common Purdue campus locations
const campusLocations = [
    'Purdue Memorial Union',
    'Armstrong Hall',
    'Krannert Building',
    'Lawson Computer Science Building',
    'Purdue Mall',
    'Chauncey Hill',
    'Ross-Ade Stadium',
    'Mackey Arena',
    'Earhart Hall',
    'Wiley Dining Court',
    'Hillenbrand Hall',
    'Cary Quadrangle',
    'Hawkins Hall',
    'Shreve Hall',
    'Windsor Halls',
    'Tarkington Hall',
    'Hicks Undergraduate Library',
    'Purdue University Airport',
    'Córdova Recreational Sports Center',
    'Beering Hall'
];

// Off-campus locations
const offCampusLocations = [
    'Chauncey Square Apartments',
    'The Hub On Campus',
    'Rise on Chauncey',
    'Aspire at Discovery Park',
    'Fuse West Lafayette',
    'Wabash Landing',
    'Village West Apartments',
    'Blackbird Farms',
    'The Cottages on Lindberg',
    'Waldron Street Apartments',
    'Campus Edge on Pierce',
    'Waterford Court Apartments',
    'South Street Station',
    'The Exponent Building',
    'Vons Shops',
    'Tippecanoe Mall',
    'West Lafayette Public Library',
    'Greyhouse Coffee',
    'Vienna Coffee Shop',
    'Fresh Thyme Market'
];

// Vehicle makes and models
const vehicles: { make: string; models: string[] }[] = [
    { make: 'Toyota', models: ['Camry', 'Corolla', 'RAV4', 'Prius'] },
    { make: 'Honda', models: ['Civic', 'Accord', 'CR-V', 'Fit'] },
    { make: 'Ford', models: ['Focus', 'Fusion', 'Escape', 'Explorer'] },
    { make: 'Chevrolet', models: ['Malibu', 'Cruze', 'Equinox', 'Impala'] },
    { make: 'Nissan', models: ['Altima', 'Sentra', 'Rogue', 'Versa'] }
];

// Vehicle colors
const vehicleColors = ['Black', 'White', 'Silver', 'Gray', 'Blue', 'Red', 'Green', 'Gold'];

// First names for mock users
const firstNames = [
    'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
    'William', 'Elizabeth', 'David', 'Susan', 'Richard', 'Jessica', 'Joseph', 'Sarah',
    'Thomas', 'Karen', 'Charles', 'Nancy', 'Emma', 'Olivia', 'Noah', 'Liam', 'Sophia',
    'Ava', 'Isabella', 'Mia', 'Ethan', 'Jacob'
];

// Last names for mock users
const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson',
    'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin',
    'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee',
    'Walker', 'Hall', 'Allen', 'Young', 'Hernandez', 'King'
];

/**
 * Generate a mock user
 * @returns A mock User object
 */
export const generateMockUser = (): User => {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@purdue.edu`;

    return {
        id: generateId(),
        email,
        firstName,
        lastName,
        phoneNumber: `765${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`,
        isVerified: randomItem([
            UserVerificationStatus.UNVERIFIED,
            UserVerificationStatus.PENDING,
            UserVerificationStatus.VERIFIED
        ]),
        profilePicture: Math.random() > 0.7 ? `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg` : undefined,
        createdAt: randomDate(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), new Date()),
        updatedAt: Math.random() > 0.5 ? new Date() : undefined
    };
};

/**
 * Generate a mock vehicle
 * @returns A mock VehicleInfo object
 */
export const generateMockVehicle = (): VehicleInfo => {
    const vehicleType = randomItem(vehicles);
    return {
        make: vehicleType.make,
        model: randomItem(vehicleType.models),
        color: randomItem(vehicleColors),
        licensePlate: `${randomItem(['IN', 'IL', 'OH', 'MI', 'KY'])}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
        year: 2015 + Math.floor(Math.random() * 9) // 2015-2023
    };
};

/**
 * Generate a mock ride
 * @returns A mock Ride object
 */
export const generateMockRide = (): Ride => {
    const now = new Date();
    const scheduledTime = randomDate(
        new Date(now.getTime() + 5 * 60 * 1000), // 5 minutes from now
        new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 hours from now
    );

    const totalSeats = Math.floor(Math.random() * 3) + 2; // 2-4 seats
    const availableSeats = Math.floor(Math.random() * (totalSeats + 1)); // 0 to totalSeats

    const status = availableSeats === 0
        ? RideStatus.FULL
        : randomItem([RideStatus.AVAILABLE, RideStatus.IN_PROGRESS]);

    const driverId = generateId();
    const driverFirstName = randomItem(firstNames);
    const driverLastName = randomItem(lastNames);

    return {
        id: generateId(),
        pickupLocation: randomItem(offCampusLocations),
        destination: randomItem(campusLocations),
        scheduledTime,
        estimatedArrival: new Date(scheduledTime.getTime() + 10 * 60 * 1000), // 10 minutes after scheduled time
        cost: 3, // Fixed at $3
        availableSeats,
        totalSeats,
        status,
        driverId,
        driverName: `${driverFirstName} ${driverLastName.charAt(0)}.`,
        driverRating: 3 + Math.random() * 2, // 3-5 rating
        vehicleInfo: generateMockVehicle(),
        createdAt: new Date(scheduledTime.getTime() - 60 * 60 * 1000), // 1 hour before scheduled time
        updatedAt: Math.random() > 0.5 ? new Date() : undefined
    };
};

/**
 * Generate a mock ride request
 * @param userId Optional user ID to associate with the request
 * @param rideId Optional ride ID to associate with the request
 * @returns A mock RideRequest object
 */
export const generateMockRideRequest = (userId?: string, rideId?: string): RideRequest => {
    const now = new Date();
    const requestedTime = randomDate(
        new Date(now.getTime() + 5 * 60 * 1000), // 5 minutes from now
        new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 hours from now
    );

    return {
        id: generateId(),
        userId: userId || generateId(),
        rideId: rideId || generateId(),
        pickupLocation: randomItem(offCampusLocations),
        requestedTime,
        status: randomItem([
            RideRequestStatus.PENDING,
            RideRequestStatus.CONFIRMED,
            RideRequestStatus.CANCELLED,
            RideRequestStatus.COMPLETED
        ]),
        passengerCount: Math.floor(Math.random() * 3) + 1, // 1-3 passengers
        specialInstructions: Math.random() > 0.7 ? 'Please call when you arrive.' : undefined,
        createdAt: new Date(),
        updatedAt: Math.random() > 0.5 ? new Date() : undefined
    };
};

/**
 * Generate multiple mock users
 * @param count Number of users to generate
 * @returns Array of mock User objects
 */
export const generateMockUsers = (count: number): User[] => {
    return Array.from({ length: count }, () => generateMockUser());
};

/**
 * Generate multiple mock rides
 * @param count Number of rides to generate
 * @returns Array of mock Ride objects
 */
export const generateMockRides = (count: number): Ride[] => {
    return Array.from({ length: count }, () => generateMockRide());
};

/**
 * Generate multiple mock ride requests
 * @param count Number of ride requests to generate
 * @param userId Optional user ID to associate with all requests
 * @returns Array of mock RideRequest objects
 */
export const generateMockRideRequests = (count: number, userId?: string): RideRequest[] => {
    return Array.from({ length: count }, () => generateMockRideRequest(userId));
};

/**
 * Process a mock API request with configurable delay and error simulation
 * @param mockDataFn Function that returns the mock data
 * @param options Configuration options for the mock request
 * @returns Promise that resolves with the mock data or rejects with an error
 */
export const mockApiRequest = async <T>(
    mockDataFn: () => T,
    options: MockDataOptions = {}
): Promise<T> => {
    const {
        delay = Math.floor(Math.random() * 800) + 200, // 200-1000ms delay by default
        shouldFail = Math.random() < 0.1, // 10% chance of failure by default
        errorMessage = 'An unexpected error occurred',
        errorCode = 'ERR_UNKNOWN'
    } = options;

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, delay));

    // Simulate error if shouldFail is true
    if (shouldFail) {
        const error = new Error(errorMessage) as Error & { code?: string };
        error.code = errorCode;
        throw error;
    }

    // Return the mock data
    return mockDataFn();
};

// Pre-generate some mock data for consistent results across calls
export const mockDataStore = {
    users: generateMockUsers(20),
    rides: generateMockRides(15),
    rideRequests: generateMockRideRequests(30)
};