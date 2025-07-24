import { render, screen, act, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { NotificationProvider, useNotification } from './NotificationContext';

// Test component that uses the notification context
const TestComponent = () => {
  const { notifications, addNotification, removeNotification, clearAllNotifications } = useNotification();
  
  return (
    <div>
      <button 
        onClick={() => addNotification({ 
          type: 'success', 
          message: 'Test notification' 
        })}
      >
        Add Notification
      </button>
      <button 
        onClick={() => addNotification({ 
          type: 'error', 
          title: 'Error', 
          message: 'Error notification',
          autoDismiss: false
        })}
      >
        Add Error
      </button>
      <button 
        onClick={() => {
          if (notifications.length > 0) {
            removeNotification(notifications[0].id);
          }
        }}
      >
        Remove First
      </button>
      <button onClick={clearAllNotifications}>
        Clear All
      </button>
      <div data-testid="notification-count">{notifications.length}</div>
      <ul>
        {notifications.map(notification => (
          <li key={notification.id} data-testid={`notification-${notification.type}`}>
            {notification.title && <span>{notification.title}: </span>}
            {notification.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

describe('NotificationContext', () => {
  beforeEach(() => {
    // Mock timers for testing auto-dismiss
    vi.useFakeTimers();
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  it('provides notification context to children', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );
    
    // Initially there should be no notifications
    expect(screen.getByTestId('notification-count').textContent).toBe('0');
  });
  
  it('adds a notification when addNotification is called', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );
    
    // Add a notification
    act(() => {
      screen.getByText('Add Notification').click();
    });
    
    // Check if notification was added
    expect(screen.getByTestId('notification-count').textContent).toBe('1');
    expect(screen.getByTestId('notification-success')).toHaveTextContent('Test notification');
  });
  
  it('removes a notification when removeNotification is called', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );
    
    // Add a notification
    act(() => {
      screen.getByText('Add Notification').click();
    });
    
    // Check if notification was added
    expect(screen.getByTestId('notification-count').textContent).toBe('1');
    
    // Remove the notification
    act(() => {
      screen.getByText('Remove First').click();
    });
    
    // Check if notification was removed
    expect(screen.getByTestId('notification-count').textContent).toBe('0');
  });
  
  it('clears all notifications when clearAllNotifications is called', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );
    
    // Add multiple notifications
    act(() => {
      screen.getByText('Add Notification').click();
      screen.getByText('Add Error').click();
    });
    
    // Check if notifications were added
    expect(screen.getByTestId('notification-count').textContent).toBe('2');
    
    // Clear all notifications
    act(() => {
      screen.getByText('Clear All').click();
    });
    
    // Check if all notifications were removed
    expect(screen.getByTestId('notification-count').textContent).toBe('0');
  });
  
  it('auto-dismisses notifications after the specified timeout', async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );
    
    // Add a notification with default auto-dismiss (true) and timeout (5000ms)
    act(() => {
      screen.getByText('Add Notification').click();
    });
    
    // Check if notification was added
    expect(screen.getByTestId('notification-count').textContent).toBe('1');
    
    // Fast-forward time by 5 seconds
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    
    // Check if notification was auto-dismissed
    await waitFor(() => {
      expect(screen.getByTestId('notification-count').textContent).toBe('0');
    });
  });
  
  it('does not auto-dismiss notifications when autoDismiss is false', async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );
    
    // Add a notification with autoDismiss set to false
    act(() => {
      screen.getByText('Add Error').click();
    });
    
    // Check if notification was added
    expect(screen.getByTestId('notification-count').textContent).toBe('1');
    
    // Fast-forward time by 10 seconds (more than default timeout)
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    
    // Check if notification is still there
    expect(screen.getByTestId('notification-count').textContent).toBe('1');
  });
});