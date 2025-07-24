import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import NotificationBanner from './NotificationBanner';
import type { Notification } from '../../context/NotificationContext';

describe('NotificationBanner', () => {
  // Setup mock notification
  const mockSuccessNotification: Notification = {
    id: 'notification-1',
    type: 'success',
    title: 'Success',
    message: 'Operation completed successfully',
    autoDismiss: true,
    dismissTimeout: 5000
  };
  
  const mockErrorNotification: Notification = {
    id: 'notification-2',
    type: 'error',
    message: 'An error occurred',
    autoDismiss: false
  };
  
  it('renders success notification with title and message', () => {
    const onDismiss = vi.fn();
    render(
      <NotificationBanner 
        notification={mockSuccessNotification} 
        onDismiss={onDismiss} 
      />
    );
    
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('Operation completed successfully')).toBeInTheDocument();
  });
  
  it('renders error notification without title', () => {
    const onDismiss = vi.fn();
    render(
      <NotificationBanner 
        notification={mockErrorNotification} 
        onDismiss={onDismiss} 
      />
    );
    
    expect(screen.queryByText('Error')).not.toBeInTheDocument(); // No title
    expect(screen.getByText('An error occurred')).toBeInTheDocument();
  });
  
  it('calls onDismiss when close button is clicked', async () => {
    const onDismiss = vi.fn();
    render(
      <NotificationBanner 
        notification={mockSuccessNotification} 
        onDismiss={onDismiss} 
      />
    );
    
    // Click the dismiss button
    fireEvent.click(screen.getByRole('button'));
    
    // Wait for the animation to complete
    await waitFor(() => {
      expect(onDismiss).toHaveBeenCalledWith('notification-1');
    }, { timeout: 400 }); // Animation takes 300ms
  });
  
  it('applies correct styling based on notification type', () => {
    const onDismiss = vi.fn();
    
    // Render success notification
    const { rerender } = render(
      <NotificationBanner 
        notification={mockSuccessNotification} 
        onDismiss={onDismiss} 
      />
    );
    
    // Check for success styling
    const successBanner = screen.getByRole('alert');
    expect(successBanner).toHaveClass('bg-green-50');
    
    // Rerender with error notification
    rerender(
      <NotificationBanner 
        notification={mockErrorNotification} 
        onDismiss={onDismiss} 
      />
    );
    
    // Check for error styling
    const errorBanner = screen.getByRole('alert');
    expect(errorBanner).toHaveClass('bg-red-50');
  });
});