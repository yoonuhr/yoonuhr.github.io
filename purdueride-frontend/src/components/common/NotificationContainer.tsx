import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import NotificationBanner from './NotificationBanner';

interface NotificationContainerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const NotificationContainer: React.FC<NotificationContainerProps> = ({ 
  position = 'top-right' 
}) => {
  const { notifications, removeNotification } = useNotification();
  
  // Get position classes
  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-0 left-0';
      case 'top-center':
        return 'top-0 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
        return 'bottom-0 right-0';
      case 'bottom-left':
        return 'bottom-0 left-0';
      case 'bottom-center':
        return 'bottom-0 left-1/2 transform -translate-x-1/2';
      case 'top-right':
      default:
        return 'top-0 right-0';
    }
  };
  
  if (notifications.length === 0) {
    return null;
  }
  
  return (
    <div 
      className={`fixed z-50 p-4 max-w-sm w-full ${getPositionClasses()}`}
      aria-live="assertive"
    >
      <div className="flex flex-col space-y-4">
        {notifications.map((notification) => (
          <NotificationBanner
            key={notification.id}
            notification={notification}
            onDismiss={removeNotification}
          />
        ))}
      </div>
    </div>
  );
};

export default NotificationContainer;