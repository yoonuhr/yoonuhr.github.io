import React, { useState, useEffect, useDeferredValue, useTransition } from 'react';
import { apiService } from '../../services/api';
import type { Ride, RideStatus as RideStatusType } from '../../types';
import { useNotification } from '../../context/NotificationContext';
import Card from '../common/Card';
import LoadingSpinner from '../common/LoadingSpinner';

interface RideStatusProps {
  rideId: string;
  className?: string;
  onStatusChange?: (status: RideStatusType) => void;
}

/**
 * RideStatus component that displays real-time status updates for a ride
 * Uses React 18 concurrent features for smooth updates
 */
const RideStatus: React.FC<RideStatusProps> = ({ 
  rideId, 
  className = '',
  onStatusChange
}) => {
  // State for ride data
  const [ride, setRide] = useState<Ride | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Access notification context
  const { addNotification } = useNotification();
  
  // Use useDeferredValue for non-urgent status updates
  // This allows React to prioritize more important updates
  const deferredRide = useDeferredValue(ride);
  
  // Use useTransition for status updates
  const [isPending, startTransition] = useTransition();
  
  // Fetch initial ride status
  useEffect(() => {
    const fetchRideStatus = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await apiService.getRideStatus(rideId);
        
        if (response.success && response.data) {
          setRide(response.data);
          
          // Notify parent component of status change if callback provided
          if (onStatusChange) {
            onStatusChange(response.data.status);
          }
        } else {
          throw new Error(response.error?.message || 'Failed to fetch ride status');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRideStatus();
  }, [rideId, onStatusChange]);
  
  // Simulate real-time updates with polling
  useEffect(() => {
    if (!ride) return;
    
    // No need to store previous status as we compare directly with ride.status
    
    // Poll for updates every 5 seconds
    const intervalId = setInterval(() => {
      // Use startTransition to mark this update as non-urgent
      // This allows React to prioritize more important updates like user input
      startTransition(async () => {
        try {
          const response = await apiService.getRideStatus(rideId);
          
          if (response.success && response.data) {
            // Check if status has changed
            if (ride && response.data.status !== ride.status) {
              // Show notification for status change
              const statusMessages = {
                'available': 'Your ride is now available for booking.',
                'in-progress': 'Your ride is now in progress. Driver is on the way!',
                'full': 'This ride is now full. Please check other available rides.',
                'completed': 'Your ride has been completed. Thank you for using PurdueRide!',
                'cancelled': 'Your ride has been cancelled.'
              };
              
              const notificationType = 
                response.data.status === 'completed' ? 'success' :
                response.data.status === 'cancelled' ? 'error' :
                response.data.status === 'in-progress' ? 'info' :
                response.data.status === 'full' ? 'warning' : 'info';
              
              // Add notification
              addNotification({
                type: notificationType,
                title: 'Ride Status Update',
                message: statusMessages[response.data.status] || `Ride status changed to ${response.data.status}`,
                autoDismiss: true,
                dismissTimeout: 6000
              });
              
              // If the ride is approaching (less than 5 minutes away), show a special notification
              if (response.data.status === 'in-progress' && 
                  response.data.estimatedArrival && 
                  (new Date(response.data.estimatedArrival).getTime() - Date.now()) < 5 * 60 * 1000) {
                addNotification({
                  type: 'info',
                  title: 'Driver Approaching',
                  message: `Your driver ${response.data.driverName || 'is'} approaching your location. Please be ready for pickup!`,
                  autoDismiss: true,
                  dismissTimeout: 10000
                });
              }
            }
            
            // Update ride data
            setRide(response.data);
            
            // Notify parent component of status change if callback provided
            if (onStatusChange && response.data.status !== ride.status) {
              onStatusChange(response.data.status);
            }
          }
        } catch (error) {
          // Silently handle errors during polling
          console.error('Error polling for ride status:', error);
        }
      });
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [ride, rideId, onStatusChange, addNotification]);
  
  // Get status badge styling
  const getStatusBadgeClass = (status: RideStatusType) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'full':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get estimated arrival time display
  const getEstimatedArrival = () => {
    if (!deferredRide?.estimatedArrival) return 'Unknown';
    
    const now = new Date();
    const arrival = new Date(deferredRide.estimatedArrival);
    
    // If arrival time is in the past, show "Arriving now"
    if (arrival <= now) {
      return 'Arriving now';
    }
    
    // Calculate minutes until arrival
    const minutesDiff = Math.round((arrival.getTime() - now.getTime()) / (1000 * 60));
    
    if (minutesDiff < 1) {
      return 'Less than a minute';
    } else if (minutesDiff === 1) {
      return '1 minute';
    } else {
      return `${minutesDiff} minutes`;
    }
  };
  
  if (isLoading) {
    return (
      <Card className={`${className} p-6`}>
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner />
        </div>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className={`${className} p-6`}>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </Card>
    );
  }
  
  if (!deferredRide) {
    return (
      <Card className={`${className} p-6`}>
        <div className="text-center py-8">
          <p className="text-gray-600">Ride information not found</p>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className={className}>
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Ride Status</h3>
        {isPending && (
          <span className="ml-2 text-xs text-gray-500">Updating...</span>
        )}
      </div>
      
      <div className="p-6">
        {/* Status Badge */}
        <div className="mb-6 flex justify-center">
          <span className={`px-4 py-2 inline-flex text-lg leading-5 font-semibold rounded-full ${getStatusBadgeClass(deferredRide.status)}`}>
            {deferredRide.status.charAt(0).toUpperCase() + deferredRide.status.slice(1)}
          </span>
        </div>
        
        {/* Ride Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Pickup Location</p>
            <p className="font-medium">{deferredRide.pickupLocation}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Destination</p>
            <p className="font-medium">{deferredRide.destination}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Scheduled Time</p>
            <p className="font-medium">
              {new Date(deferredRide.scheduledTime).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Cost</p>
            <p className="font-medium">${deferredRide.cost.toFixed(2)}</p>
          </div>
        </div>
        
        {/* Estimated Arrival */}
        <div className="mb-6">
          <p className="text-sm text-gray-500">Estimated Arrival</p>
          <p className="text-xl font-semibold text-purdue-gold">
            {getEstimatedArrival()}
          </p>
        </div>
        
        {/* Driver Information (only shown for active rides) */}
        {(deferredRide.status === 'in-progress') && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Driver Information</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Driver</p>
                <p className="font-medium">{deferredRide.driverName || 'Unknown'}</p>
              </div>
              
              {deferredRide.driverRating && (
                <div>
                  <p className="text-sm text-gray-500">Rating</p>
                  <p className="font-medium">
                    {deferredRide.driverRating.toFixed(1)} / 5.0
                  </p>
                </div>
              )}
              
              {deferredRide.vehicleInfo && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Vehicle</p>
                    <p className="font-medium">
                      {deferredRide.vehicleInfo.color} {deferredRide.vehicleInfo.make} {deferredRide.vehicleInfo.model}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">License Plate</p>
                    <p className="font-medium">{deferredRide.vehicleInfo.licensePlate}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RideStatus;