import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import RidesList from './RidesList';
import { generateMockRides } from '../../utils/mockDataGenerator';
import type { Ride } from '../../types';

// Mock the generateMockRides function
vi.mock('../../utils/mockDataGenerator', () => ({
  generateMockRides: vi.fn(() => [
    {
      id: 'mock-ride-1',
      pickupLocation: 'Mock Location 1',
      destination: 'Campus Center',
      scheduledTime: new Date(),
      cost: 3,
      availableSeats: 2,
      totalSeats: 4,
      status: 'available',
      driverId: 'driver-1',
      createdAt: new Date()
    },
    {
      id: 'mock-ride-2',
      pickupLocation: 'Mock Location 2',
      destination: 'Library',
      scheduledTime: new Date(),
      cost: 3,
      availableSeats: 0,
      totalSeats: 4,
      status: 'full',
      driverId: 'driver-2',
      createdAt: new Date()
    }
  ])
}));

describe('RidesList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders loading state initially when no rides are provided', () => {
    render(<RidesList isLoading={true} />);
    // Check for loading spinner content instead of role
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
  
  it('renders rides from initialRides prop', () => {
    const mockRides = generateMockRides(2);
    mockRides[0].pickupLocation = 'Custom Location 1';
    mockRides[1].pickupLocation = 'Custom Location 2';
    
    render(<RidesList initialRides={mockRides} />);
    
    expect(screen.getByText('Custom Location 1')).toBeInTheDocument();
    expect(screen.getByText('Custom Location 2')).toBeInTheDocument();
  });
  
  it('renders error message when error prop is provided', () => {
    const errorMessage = 'Failed to load rides';
    render(<RidesList error={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText('Try again')).toBeInTheDocument();
  });
  
  it('renders empty state when no rides are available', () => {
    const { container } = render(<RidesList initialRides={[]} />);
    
    // Use container query to be more specific about which element we're looking for
    const noRidesElement = container.querySelector('h3.text-lg.font-medium');
    expect(noRidesElement).toHaveTextContent('No rides available');
    
    const checkBackElement = container.querySelector('p.text-gray-500');
    expect(checkBackElement).toHaveTextContent('Check back later for available rides.');
  });
  
  it('calls onSelectRide when a ride is selected', async () => {
    const user = userEvent.setup();
    const mockRides = generateMockRides(1);
    const onSelectRideMock = vi.fn();
    
    render(<RidesList initialRides={mockRides} onSelectRide={onSelectRideMock} />);
    
    const selectButton = screen.getByRole('button', { name: /select ride/i });
    await user.click(selectButton);
    
    expect(onSelectRideMock).toHaveBeenCalledWith(mockRides[0]);
  });
  
  it('fetches mock rides when no initialRides are provided', async () => {
    render(<RidesList />);
    
    // Wait for mock rides to load
    await waitFor(() => {
      expect(screen.getByText('Mock Location 1')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Mock Location 2')).toBeInTheDocument();
    expect(generateMockRides).toHaveBeenCalledWith(8);
  });
});