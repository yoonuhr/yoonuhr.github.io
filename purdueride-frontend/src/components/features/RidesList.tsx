import { useState, useEffect } from 'react';
import type { Ride } from '../../types';
import { generateMockRides } from '../../utils/mockDataGenerator';
import RideCard from './RideCard';
import LoadingSpinner from '../common/LoadingSpinner';

interface RidesListProps {
  onSelectRide?: (ride: Ride) => void;
  className?: string;
  initialRides?: Ride[];
  isLoading?: boolean;
  error?: string;
}

const RidesList = ({
  onSelectRide,
  className = '',
  initialRides,
  isLoading = false,
  error
}: RidesListProps) => {
  const [rides, setRides] = useState<Ride[]>(initialRides || []);
  const [loading, setLoading] = useState<boolean>(isLoading || !initialRides);

  // If no initial rides are provided, fetch mock rides
  useEffect(() => {
    if (!initialRides && !isLoading) {
      setLoading(true);
      
      // Simulate API call with a delay
      const timer = setTimeout(() => {
        const mockRides = generateMockRides(8);
        setRides(mockRides);
        setLoading(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [initialRides, isLoading]);

  // Update rides when initialRides prop changes
  useEffect(() => {
    if (initialRides) {
      setRides(initialRides);
    }
  }, [initialRides]);

  // Update loading state when isLoading prop changes
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
        <p className="text-red-700">{error}</p>
        <button 
          className="mt-2 text-red-600 hover:text-red-800 underline text-sm"
          onClick={() => setLoading(true)}
        >
          Try again
        </button>
      </div>
    );
  }

  if (rides.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
        <h3 className="text-lg font-medium text-gray-700 mb-2">No rides available</h3>
        <p className="text-gray-500">Check back later for available rides.</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-4 ${className}`}>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Available Rides</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rides.map((ride) => (
          <RideCard
            key={ride.id}
            ride={ride}
            onSelect={onSelectRide}
          />
        ))}
      </div>
    </div>
  );
};

export default RidesList;