import { useMemo } from 'react';
import type { Ride } from '../../types';
import { RideStatus } from '../../types';
import Card from '../common/Card';
import Button from '../common/Button';

interface RideCardProps {
  ride: Ride;
  onSelect?: (ride: Ride) => void;
  className?: string;
}

const RideCard = ({ ride, onSelect, className = '' }: RideCardProps) => {
  // Format the scheduled time
  const formattedTime = useMemo(() => {
    const date = new Date(ride.scheduledTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [ride.scheduledTime]);

  // Format the date if it's not today
  const formattedDate = useMemo(() => {
    const date = new Date(ride.scheduledTime);
    const today = new Date();
    
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return 'Today';
    }
    
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  }, [ride.scheduledTime]);

  // Get status badge color based on ride status
  const getStatusBadgeColor = (status: RideStatus) => {
    switch (status) {
      case RideStatus.AVAILABLE:
        return 'bg-green-100 text-green-800';
      case RideStatus.FULL:
        return 'bg-red-100 text-red-800';
      case RideStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800';
      case RideStatus.COMPLETED:
        return 'bg-gray-100 text-gray-800';
      case RideStatus.CANCELLED:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get human-readable status text
  const getStatusText = (status: RideStatus) => {
    switch (status) {
      case RideStatus.AVAILABLE:
        return 'Available';
      case RideStatus.FULL:
        return 'Full';
      case RideStatus.IN_PROGRESS:
        return 'In Progress';
      case RideStatus.COMPLETED:
        return 'Completed';
      case RideStatus.CANCELLED:
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <Card className={`border border-gray-200 ${className}`}>
      <div className="flex flex-col h-full">
        {/* Price Badge - Prominently displayed */}
        <div className="absolute top-4 right-4">
          <div className="bg-purdue-gold text-white font-bold rounded-full px-3 py-1 text-sm">
            $3
          </div>
        </div>

        {/* Ride Details */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 pr-12">{ride.pickupLocation}</h3>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 mb-1">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>To: {ride.destination}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 mb-1">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formattedDate} at {formattedTime}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{ride.availableSeats} of {ride.totalSeats} seats available</span>
          </div>
        </div>

        {/* Status and Action */}
        <div className="mt-auto flex items-center justify-between">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(ride.status)}`}>
            {getStatusText(ride.status)}
          </span>
          
          {ride.status === RideStatus.AVAILABLE && ride.availableSeats > 0 && onSelect && (
            <Button 
              variant="primary" 
              size="sm" 
              onClick={() => onSelect(ride)}
              aria-label={`Select ride from ${ride.pickupLocation} to ${ride.destination}`}
            >
              Select Ride
            </Button>
          )}
          
          {ride.status === RideStatus.FULL && (
            <span className="text-sm text-red-600 font-medium">No seats available</span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default RideCard;