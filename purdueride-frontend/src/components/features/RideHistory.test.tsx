import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import RideHistory from './RideHistory';
import { apiService } from '../../services/api';
import { RideStatus, RideRequestStatus, UserVerificationStatus } from '../../types';

// Mock the API service
vi.mock('../../services/api', () => ({
  apiService: {
    getRideHistory: vi.fn()
  }
}));

// Mock the auth context
vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn()
}));

// Import the mocked hook
import { useAuth } from '../../context/AuthContext';

describe('RideHistory', () => {
  // Setup mock user data
  const mockUser = {
    id: 'user-123',
    email: 'test@purdue.edu',
    firstName: 'Test',
    lastName: 'User',
    phoneNumber: '7651234567',
    isVerified: UserVerificationStatus.VERIFIED,
    createdAt: new Date('2023-01-01')
  };

  // Setup mock ride history data
  const mockRides = [
    {
      id: 'ride-1',
      pickupLocation: 'Chauncey Hill',
      destination: 'Purdue Memorial Union',
      scheduledTime: new Date('2023-06-15T10:00:00'),
      cost: 3,
      availableSeats: 2,
      totalSeats: 4,
      status: RideStatus.COMPLETED,
      driverId: 'driver-1',
      createdAt: new Date('2023-06-15T09:30:00')
    },
    {
      id: 'ride-2',
      pickupLocation: 'Aspire at Discovery Park',
      destination: 'Lawson Computer Science Building',
      scheduledTime: new Date('2023-06-16T14:00:00'),
      cost: 3,
      availableSeats: 1,
      totalSeats: 4,
      status: RideStatus.COMPLETED,
      driverId: 'driver-2',
      createdAt: new Date('2023-06-16T13:30:00')
    }
  ];

  const mockRequests = [
    {
      id: 'request-1',
      userId: 'user-123',
      rideId: 'ride-1',
      pickupLocation: 'Chauncey Hill',
      requestedTime: new Date('2023-06-15T09:45:00'),
      status: RideRequestStatus.COMPLETED,
      passengerCount: 1,
      createdAt: new Date('2023-06-15T09:30:00')
    },
    {
      id: 'request-2',
      userId: 'user-123',
      rideId: 'ride-2',
      pickupLocation: 'Aspire at Discovery Park',
      requestedTime: new Date('2023-06-16T13:45:00'),
      status: RideRequestStatus.COMPLETED,
      passengerCount: 1,
      createdAt: new Date('2023-06-16T13:30:00')
    },
    {
      id: 'request-3',
      userId: 'user-123',
      rideId: 'ride-3', // This ride doesn't exist in our mock data
      pickupLocation: 'The Hub On Campus',
      requestedTime: new Date('2023-06-17T11:00:00'),
      status: RideRequestStatus.PENDING,
      passengerCount: 2,
      createdAt: new Date('2023-06-17T10:30:00')
    }
  ];

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Default mock implementations
    (useAuth as any).mockReturnValue({
      user: mockUser,
      isAuthenticated: true
    });
    
    (apiService.getRideHistory as any).mockResolvedValue({
      success: true,
      data: {
        rides: mockRides,
        requests: mockRequests,
        meta: {
          total: mockRequests.length,
          timestamp: Date.now()
        }
      }
    });
  });

  it('renders the ride history when user is logged in', async () => {
    render(<RideHistory />);
    
    // Check if loading state is shown initially
    expect(screen.getByText('Ride History')).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(apiService.getRideHistory).toHaveBeenCalledWith('user-123');
    });
    
    // Check if ride history items are displayed
    expect(screen.getByText('Chauncey Hill')).toBeInTheDocument();
    expect(screen.getByText('Aspire at Discovery Park')).toBeInTheDocument();
    expect(screen.getByText('Purdue Memorial Union')).toBeInTheDocument();
    expect(screen.getByText('Lawson Computer Science Building')).toBeInTheDocument();
    
    // Check if all 3 rides are displayed (2 completed, 1 pending)
    const statusBadges = screen.getAllByText(/completed|pending/i);
    expect(statusBadges).toHaveLength(3);
  });

  it('shows a message when user is not logged in', () => {
    // Mock user as null (not logged in)
    (useAuth as any).mockReturnValue({
      user: null,
      isAuthenticated: false
    });
    
    render(<RideHistory />);
    
    // Check if login message is displayed
    expect(screen.getByText('Please log in to view your ride history')).toBeInTheDocument();
  });

  it('shows an empty state when no ride history exists', async () => {
    // Mock empty ride history
    (apiService.getRideHistory as any).mockResolvedValue({
      success: true,
      data: {
        rides: [],
        requests: [],
        meta: {
          total: 0,
          timestamp: Date.now()
        }
      }
    });
    
    render(<RideHistory />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(apiService.getRideHistory).toHaveBeenCalled();
    });
    
    // Check if empty state message is displayed
    expect(screen.getByText('No ride history found')).toBeInTheDocument();
  });

  it('shows an error message when API call fails', async () => {
    // Mock API error
    (apiService.getRideHistory as any).mockResolvedValue({
      success: false,
      error: {
        message: 'Failed to fetch ride history'
      }
    });
    
    render(<RideHistory />);
    
    // Wait for error to be displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch ride history')).toBeInTheDocument();
    });
  });

  it('filters ride history by status', async () => {
    render(<RideHistory />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(apiService.getRideHistory).toHaveBeenCalled();
    });
    
    // Initially all 3 rides should be visible
    expect(screen.getAllByRole('row')).toHaveLength(4); // 3 rides + header row
    
    // Filter by pending status
    fireEvent.change(screen.getByLabelText('Filter by Status'), { target: { value: 'pending' } });
    
    // Only the pending ride should be visible
    expect(screen.getAllByRole('row')).toHaveLength(2); // 1 ride + header row
    expect(screen.getByText('The Hub On Campus')).toBeInTheDocument();
    expect(screen.queryByText('Chauncey Hill')).not.toBeInTheDocument();
  });

  it('sorts ride history by date', async () => {
    render(<RideHistory />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(apiService.getRideHistory).toHaveBeenCalled();
    });
    
    // Click on Date header to sort
    fireEvent.click(screen.getByText('Date'));
    
    // Check if rides are sorted by date (default is descending)
    const rows = screen.getAllByRole('row');
    
    // First row is header, second row should be the most recent ride
    expect(rows[1]).toHaveTextContent('The Hub On Campus');
    
    // Click again to toggle sort direction
    fireEvent.click(screen.getByText('Date'));
    
    // Now the oldest ride should be first
    const rowsAfterSort = screen.getAllByRole('row');
    expect(rowsAfterSort[1]).toHaveTextContent('Chauncey Hill');
  });

  it('resets filters when Reset Filters button is clicked', async () => {
    render(<RideHistory />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(apiService.getRideHistory).toHaveBeenCalled();
    });
    
    // Filter by pending status
    fireEvent.change(screen.getByLabelText('Filter by Status'), { target: { value: 'pending' } });
    
    // Only the pending ride should be visible
    expect(screen.getAllByRole('row')).toHaveLength(2); // 1 ride + header row
    
    // Click reset filters button
    fireEvent.click(screen.getByText('Reset Filters'));
    
    // All rides should be visible again
    expect(screen.getAllByRole('row')).toHaveLength(4); // 3 rides + header row
  });
});