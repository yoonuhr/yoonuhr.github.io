import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import RideStatus from './RideStatus';
import { apiService } from '../../services/api';
import { RideStatus as RideStatusEnum } from '../../types';

// Mock the API service
vi.mock('../../services/api', () => ({
  apiService: {
    getRideStatus: vi.fn()
  }
}));

describe('RideStatus', () => {
  // Setup mock ride data
  const mockRide = {
    id: 'ride-123',
    pickupLocation: 'Chauncey Hill',
    destination: 'Purdue Memorial Union',
    scheduledTime: new Date('2023-06-15T10:00:00'),
    estimatedArrival: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
    cost: 3,
    availableSeats: 2,
    totalSeats: 4,
    status: RideStatusEnum.IN_PROGRESS,
    driverId: 'driver-1',
    driverName: 'John D.',
    driverRating: 4.8,
    vehicleInfo: {
      make: 'Toyota',
      model: 'Camry',
      color: 'Blue',
      licensePlate: 'IN-123ABC'
    },
    createdAt: new Date('2023-06-15T09:30:00')
  };

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Default mock implementation
    (apiService.getRideStatus as any).mockResolvedValue({
      success: true,
      data: mockRide
    });
    
    // Mock Date.now to return a consistent value for testing
    const now = new Date('2023-06-15T09:55:00').getTime();
    vi.spyOn(Date, 'now').mockImplementation(() => now);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the ride status with driver information for in-progress rides', async () => {
    render(<RideStatus rideId="ride-123" />);
    
    // Check if loading state is shown initially
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(apiService.getRideStatus).toHaveBeenCalledWith('ride-123');
    });
    
    // Check if ride status is displayed
    expect(screen.getByText('In-progress')).toBeInTheDocument();
    
    // Check if ride details are displayed
    expect(screen.getByText('Chauncey Hill')).toBeInTheDocument();
    expect(screen.getByText('Purdue Memorial Union')).toBeInTheDocument();
    expect(screen.getByText('$3.00')).toBeInTheDocument();
    
    // Check if driver information is displayed
    expect(screen.getByText('Driver Information')).toBeInTheDocument();
    expect(screen.getByText('John D.')).toBeInTheDocument();
    expect(screen.getByText('4.8 / 5.0')).toBeInTheDocument();
    expect(screen.getByText('Blue Toyota Camry')).toBeInTheDocument();
    expect(screen.getByText('IN-123ABC')).toBeInTheDocument();
    
    // Check if estimated arrival is displayed
    expect(screen.getByText('10 minutes')).toBeInTheDocument();
  });

  it('does not show driver information for non-active rides', async () => {
    // Mock a completed ride
    (apiService.getRideStatus as any).mockResolvedValue({
      success: true,
      data: {
        ...mockRide,
        status: RideStatusEnum.COMPLETED
      }
    });
    
    render(<RideStatus rideId="ride-123" />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(apiService.getRideStatus).toHaveBeenCalledWith('ride-123');
    });
    
    // Check if ride status is displayed
    expect(screen.getByText('Completed')).toBeInTheDocument();
    
    // Driver information should not be displayed
    expect(screen.queryByText('Driver Information')).not.toBeInTheDocument();
  });

  it('shows an error message when API call fails', async () => {
    // Mock API error
    (apiService.getRideStatus as any).mockResolvedValue({
      success: false,
      error: {
        message: 'Failed to fetch ride status'
      }
    });
    
    render(<RideStatus rideId="ride-123" />);
    
    // Wait for error to be displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch ride status')).toBeInTheDocument();
    });
  });

  it('calls onStatusChange callback when ride status changes', async () => {
    const onStatusChangeMock = vi.fn();
    
    render(<RideStatus rideId="ride-123" onStatusChange={onStatusChangeMock} />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(apiService.getRideStatus).toHaveBeenCalledWith('ride-123');
    });
    
    // Check if callback was called with the initial status
    expect(onStatusChangeMock).toHaveBeenCalledWith(RideStatusEnum.IN_PROGRESS);
  });

  it('displays "Arriving now" when estimated arrival time is in the past', async () => {
    // Mock a ride with arrival time in the past
    (apiService.getRideStatus as any).mockResolvedValue({
      success: true,
      data: {
        ...mockRide,
        estimatedArrival: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
      }
    });
    
    render(<RideStatus rideId="ride-123" />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(apiService.getRideStatus).toHaveBeenCalledWith('ride-123');
    });
    
    // Check if "Arriving now" is displayed
    expect(screen.getByText('Arriving now')).toBeInTheDocument();
  });
});