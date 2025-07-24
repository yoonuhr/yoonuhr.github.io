import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import UserProfile from './UserProfile';
import { AuthProvider } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { UserVerificationStatus } from '../../types';

// Mock the API service
vi.mock('../../services/api', () => ({
  apiService: {
    updateProfile: vi.fn()
  }
}));

// Mock the auth context
vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

// Import the mocked hook
import { useAuth } from '../../context/AuthContext';

describe('UserProfile', () => {
  // Setup mock user data
  const mockUser = {
    id: 'user-123',
    email: 'test@purdue.edu',
    firstName: 'Test',
    lastName: 'User',
    phoneNumber: '7651234567',
    isVerified: UserVerificationStatus.VERIFIED,
    profilePicture: 'https://example.com/profile.jpg',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-06-01')
  };

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Default mock implementation
    (useAuth as any).mockReturnValue({
      user: mockUser,
      isAuthenticated: true
    });
  });

  it('renders the user profile when user is logged in', () => {
    render(<UserProfile />);
    
    // Check if user information is displayed
    expect(screen.getByText('User Profile')).toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('test@purdue.edu')).toBeInTheDocument();
    expect(screen.getByText('7651234567')).toBeInTheDocument();
    expect(screen.getByText('verified')).toBeInTheDocument();
  });

  it('shows a message when user is not logged in', () => {
    // Mock user as null (not logged in)
    (useAuth as any).mockReturnValue({
      user: null,
      isAuthenticated: false
    });
    
    render(<UserProfile />);
    
    // Check if login message is displayed
    expect(screen.getByText('Please log in to view your profile')).toBeInTheDocument();
  });

  it('switches to edit mode when Edit Profile button is clicked', () => {
    render(<UserProfile />);
    
    // Click edit button
    fireEvent.click(screen.getByText('Edit Profile'));
    
    // Check if form inputs are displayed
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('cancels editing and reverts changes when Cancel button is clicked', () => {
    render(<UserProfile />);
    
    // Click edit button
    fireEvent.click(screen.getByText('Edit Profile'));
    
    // Change input values
    fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'Changed' } });
    fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Name' } });
    
    // Click cancel button
    fireEvent.click(screen.getByText('Cancel'));
    
    // Check if we're back to view mode with original values
    expect(screen.queryByLabelText('First Name')).not.toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
  });

  it('submits updated profile information when Save Changes is clicked', async () => {
    // Mock successful API response
    (apiService.updateProfile as any).mockResolvedValue({
      success: true,
      data: {
        ...mockUser,
        firstName: 'Updated',
        lastName: 'Profile'
      }
    });
    
    render(<UserProfile />);
    
    // Click edit button
    fireEvent.click(screen.getByText('Edit Profile'));
    
    // Change input values
    fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'Updated' } });
    fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Profile' } });
    
    // Submit form
    fireEvent.click(screen.getByText('Save Changes'));
    
    // Check if API was called with correct data
    await waitFor(() => {
      expect(apiService.updateProfile).toHaveBeenCalledWith('user-123', {
        firstName: 'Updated',
        lastName: 'Profile',
        phoneNumber: '7651234567'
      });
    });
    
    // Check for success message
    await waitFor(() => {
      expect(screen.getByText('Profile updated successfully!')).toBeInTheDocument();
    });
  });

  it('displays error message when profile update fails', async () => {
    // Mock failed API response
    (apiService.updateProfile as any).mockResolvedValue({
      success: false,
      error: {
        message: 'Failed to update profile'
      }
    });
    
    render(<UserProfile />);
    
    // Click edit button
    fireEvent.click(screen.getByText('Edit Profile'));
    
    // Submit form without changes
    fireEvent.click(screen.getByText('Save Changes'));
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByText('Failed to update profile')).toBeInTheDocument();
    });
  });

  it('validates form fields before submission', async () => {
    render(<UserProfile />);
    
    // Click edit button
    fireEvent.click(screen.getByText('Edit Profile'));
    
    // Clear required fields
    fireEvent.change(screen.getByLabelText('First Name'), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '123' } }); // Invalid format
    
    // Trigger validation by blurring fields
    fireEvent.blur(screen.getByLabelText('First Name'));
    fireEvent.blur(screen.getByLabelText('Phone Number'));
    
    // Check for validation errors
    expect(screen.getByText('First name is required')).toBeInTheDocument();
    expect(screen.getByText('Please enter a valid 10-digit phone number')).toBeInTheDocument();
    
    // Submit form
    fireEvent.click(screen.getByText('Save Changes'));
    
    // API should not be called due to validation errors
    expect(apiService.updateProfile).not.toHaveBeenCalled();
  });
});