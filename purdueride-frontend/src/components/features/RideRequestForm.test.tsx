import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RideRequestForm from './RideRequestForm';
import { apiService } from '../../services/api';
import { AuthProvider } from '../../context/AuthContext';

// Mock the API service
vi.mock('../../services/api', () => ({
  apiService: {
    requestRide: vi.fn()
  }
}));

describe('RideRequestForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful API response
    (apiService.requestRide as any).mockResolvedValue({
      success: true,
      data: {
        id: 'mock-ride-request-id',
        status: 'pending'
      }
    });
  });

  const renderWithAuth = (ui: React.ReactElement) => {
    return render(
      <AuthProvider>
        {ui}
      </AuthProvider>
    );
  };

  it('renders the form correctly', () => {
    renderWithAuth(<RideRequestForm />);
    
    expect(screen.getByText('Request a ride')).toBeInTheDocument();
    expect(screen.getByLabelText(/Pickup location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Destination/i)).toBeInTheDocument();
    expect(screen.getByText('Number of passengers')).toBeInTheDocument();
    expect(screen.getByText('Request Ride - $3.00')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    renderWithAuth(<RideRequestForm />);
    
    // Clear the pickup location field
    const pickupInput = screen.getByLabelText(/Pickup location/i);
    fireEvent.change(pickupInput, { target: { value: '' } });
    fireEvent.blur(pickupInput);
    
    // Submit the form
    fireEvent.click(screen.getByText('Request Ride - $3.00'));
    
    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText('Please enter your pickup location')).toBeInTheDocument();
    });
  });

  it('allows changing passenger count', () => {
    renderWithAuth(<RideRequestForm />);
    
    // Initial count should be 1
    expect(screen.getByText('1')).toBeInTheDocument();
    
    // Increase passenger count
    const increaseButton = screen.getByRole('button', { name: /\+/i });
    fireEvent.click(increaseButton);
    
    // Count should be 2
    expect(screen.getByText('2')).toBeInTheDocument();
    
    // Decrease passenger count
    const decreaseButton = screen.getByRole('button', { name: /-/i });
    fireEvent.click(decreaseButton);
    
    // Count should be back to 1
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('toggles schedule options when clicked', () => {
    renderWithAuth(<RideRequestForm />);
    
    // Schedule options should not be visible initially
    expect(screen.queryByLabelText(/Date/i)).not.toBeInTheDocument();
    
    // Click the schedule button
    fireEvent.click(screen.getByText('Schedule for later'));
    
    // Schedule options should now be visible
    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Time/i)).toBeInTheDocument();
    
    // Click the button again
    fireEvent.click(screen.getByText('Ride now'));
    
    // Schedule options should be hidden again
    expect(screen.queryByLabelText(/Date/i)).not.toBeInTheDocument();
  });

  it('submits the form and shows confirmation', async () => {
    const onSubmitMock = vi.fn();
    renderWithAuth(<RideRequestForm onSubmit={onSubmitMock} />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Pickup location/i), { 
      target: { value: 'Chauncey Hill' } 
    });
    
    // Submit the form
    fireEvent.click(screen.getByText('Request Ride - $3.00'));
    
    // Wait for confirmation message
    await waitFor(() => {
      expect(screen.getByText('Ride Requested!')).toBeInTheDocument();
    });
    
    // Check if API was called with correct data
    expect(apiService.requestRide).toHaveBeenCalledWith(expect.objectContaining({
      pickupLocation: 'Chauncey Hill',
      destination: 'Purdue University',
      passengerCount: 1
    }));
    
    // Check if onSubmit callback was called
    expect(onSubmitMock).toHaveBeenCalled();
  });

  it('handles API errors', async () => {
    // Mock API error
    (apiService.requestRide as any).mockResolvedValue({
      success: false,
      error: {
        message: 'Failed to request ride'
      }
    });
    
    renderWithAuth(<RideRequestForm />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Pickup location/i), { 
      target: { value: 'Chauncey Hill' } 
    });
    
    // Submit the form
    fireEvent.click(screen.getByText('Request Ride - $3.00'));
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Failed to request ride')).toBeInTheDocument();
    });
    
    // Confirmation should not be shown
    expect(screen.queryByText('Ride Requested!')).not.toBeInTheDocument();
  });

  it('allows requesting another ride after confirmation', async () => {
    renderWithAuth(<RideRequestForm />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Pickup location/i), { 
      target: { value: 'Chauncey Hill' } 
    });
    
    // Submit the form
    fireEvent.click(screen.getByText('Request Ride - $3.00'));
    
    // Wait for confirmation message
    await waitFor(() => {
      expect(screen.getByText('Ride Requested!')).toBeInTheDocument();
    });
    
    // Click "Request Another Ride"
    fireEvent.click(screen.getByText('Request Another Ride'));
    
    // Form should be shown again
    expect(screen.getByText('Request a ride')).toBeInTheDocument();
  });
});