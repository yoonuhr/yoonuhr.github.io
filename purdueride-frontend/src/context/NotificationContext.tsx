import React, { createContext, useContext, useReducer, useCallback, useTransition } from 'react';
import type { ReactNode } from 'react';

// Define notification types
export type NotificationType = 'success' | 'error' | 'info' | 'warning';

// Define notification interface
export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  autoDismiss?: boolean;
  dismissTimeout?: number;
}

// Define context state
interface NotificationState {
  notifications: Notification[];
}

// Define context actions
type NotificationAction = 
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: { id: string } }
  | { type: 'CLEAR_ALL_NOTIFICATIONS' };

// Define context value
interface NotificationContextValue {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  isPending: boolean;
}

// Create context
const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

// Initial state
const initialState: NotificationState = {
  notifications: []
};

// Reducer function
const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload.id)
      };
    case 'CLEAR_ALL_NOTIFICATIONS':
      return {
        ...state,
        notifications: []
      };
    default:
      return state;
  }
};

// Provider component
interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  
  // Use useTransition for smooth notification animations
  const [isPending, startTransition] = useTransition();
  
  // Generate a unique ID for notifications
  const generateId = () => {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };
  
  // Add a notification
  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = generateId();
    const newNotification: Notification = {
      ...notification,
      id,
      autoDismiss: notification.autoDismiss ?? true,
      dismissTimeout: notification.dismissTimeout ?? 5000 // Default 5 seconds
    };
    
    startTransition(() => {
      dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
    });
    
    // Auto-dismiss notification if enabled
    if (newNotification.autoDismiss) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.dismissTimeout);
    }
  }, []);
  
  // Remove a notification
  const removeNotification = useCallback((id: string) => {
    startTransition(() => {
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: { id } });
    });
  }, []);
  
  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    startTransition(() => {
      dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' });
    });
  }, []);
  
  const value = {
    notifications: state.notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    isPending
  };
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotification = (): NotificationContextValue => {
  const context = useContext(NotificationContext);
  
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  
  return context;
};

export default NotificationContext;