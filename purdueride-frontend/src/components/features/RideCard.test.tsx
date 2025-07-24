import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect } from 'vitest';
import RideCard from './RideCard';
import { generateMockRide } from '../../utils/mockDataGenerator';
import { RideStatus } from '../../types';

describe('RideCard', () => {
  it('renders ride information correctly', () => {
    // Create a mock ride with specific data for testing
    const mockRide = generateMockRide();
    mockRide.pickupLocation = 'Test Pickup Location';
    mockRide.destination = 'Test Destination';
    mockRide.status = RideStatus.AVAILABLE;
    mockRide.availableSeats = 2;
    mockRide.totalSeats = 4;
    
    render(<RideCard ride={mockRide} />);
    
    // Check if the component renders the ride information
    expect(screen.getByText('Test Pickup Location')).toBeInTheDocument();
    expect(screen.getByText('To: Test Destination')).toBeInTheDocument();
    expect(screen.getByText('2 of 4 seats available')).toBeInTheDocument();
    expect(screen.getByText('Available')).toBeInTheDocument();
    expect(screen.getByText('$3')).toBeInTheDocument();
  });
  
  it('displays the correct status badge for different ride statuses', () => {
    // Test AVAILABLE status
    const availableRide = generateMockRide();
    availableRide.status = RideStatus.AVAILABLE;
    const { rerender } = render(<RideCard ride={availableRide} />);
    const availableBadge = screen.getByText('Available');
    expect(availableBadge).toBeInTheDocument();
    expect(availableBadge.className).toContain('bg-green-100');
    
    // Test FULL status
    const fullRide = { ...availableRide, status: RideStatus.FULL };
    rerender(<RideCard ride={fullRide} />);
    const fullBadge = screen.getByText('Full');
    expect(fullBadge).toBeInTheDocument();
    expect(fullBadge.className).toContain('bg-red-100');
    
    // Test IN_PROGRESS status
    const inProgressRide = { ...availableRide, status: RideStatus.IN_PROGRESS };
    rerender(<RideCard ride={inProgressRide} />);
    const inProgressBadge = screen.getByText('In Progress');
    expect(inProgressBadge).toBeInTheDocument();
    expect(inProgressBadge.className).toContain('bg-blue-100');
  });
  
  it('calls onSelect when the Select Ride button is clicked', async () => {
    const user = userEvent.setup();
    const mockRide = generateMockRide();
    mockRide.status = RideStatus.AVAILABLE;
    mockRide.availableSeats = 2;
    
    const onSelectMock = vi.fn();
    render(<RideCard ride={mockRide} onSelect={onSelectMock} />);
    
    const selectButton = screen.getByRole('button', { name: /select ride/i });
    await user.click(selectButton);
    
    expect(onSelectMock).toHaveBeenCalledWith(mockRide);
  });
  
  it('does not show Select Ride button when ride is full', () => {
    const mockRide = generateMockRide();
    mockRide.status = RideStatus.FULL;
    mockRide.availableSeats = 0;
    
    render(<RideCard ride={mockRide} />);
    
    // When status is FULL, the Select Ride button should not be shown
    expect(screen.queryByRole('button', { name: /select ride/i })).not.toBeInTheDocument();
    expect(screen.getByText('No seats available')).toBeInTheDocument();
  });
  
  it('formats the date and time correctly', () => {
    // Create a mock ride with a specific date
    const mockRide = generateMockRide();
    const today = new Date();
    mockRide.scheduledTime = today;
    
    render(<RideCard ride={mockRide} />);
    
    // Check if it shows "Today" for today's date
    expect(screen.getByText(/Today at/)).toBeInTheDocument();
    
    // Test with a future date
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    mockRide.scheduledTime = tomorrow;
    
    const { rerender } = render(<RideCard ride={mockRide} />);
    rerender(<RideCard ride={mockRide} />);
    
    // Should not show "Today" for tomorrow's date
    expect(screen.queryByText(/Today at/)).not.toBeInTheDocument();
  });
});