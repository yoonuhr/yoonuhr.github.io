import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import type { Ride, RideRequest } from '../../types';
import { RideStatus, RideRequestStatus } from '../../types';
import Card from '../common/Card';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

interface RideHistoryProps {
  className?: string;
}

type SortField = 'date' | 'status' | 'location';
type SortDirection = 'asc' | 'desc';
type FilterStatus = 'all' | RideStatus | RideRequestStatus;

const RideHistory: React.FC<RideHistoryProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rides, setRides] = useState<Ride[]>([]);
  const [requests, setRequests] = useState<RideRequest[]>([]);
  
  // Sorting and filtering state
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  
  // Fetch ride history when component mounts or user changes
  useEffect(() => {
    const fetchRideHistory = async () => {
      if (!user) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await apiService.getRideHistory(user.id);
        
        if (response.success && response.data) {
          setRides(response.data.rides);
          setRequests(response.data.requests);
        } else {
          throw new Error(response.error?.message || 'Failed to fetch ride history');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRideHistory();
  }, [user]);
  
  // Combine rides and requests for display
  const combinedRideHistory = useMemo(() => {
    if (!rides.length && !requests.length) return [];
    
    // Create a map of ride IDs to rides for quick lookup
    const rideMap = new Map<string, Ride>();
    rides.forEach(ride => rideMap.set(ride.id, ride));
    
    // Combine ride requests with their associated rides
    return requests.map(request => {
      const associatedRide = rideMap.get(request.rideId);
      return {
        id: request.id,
        date: request.requestedTime,
        pickupLocation: request.pickupLocation,
        destination: associatedRide?.destination || 'Unknown',
        status: request.status,
        cost: associatedRide?.cost || 3, // Default to $3 if not found
        rideId: request.rideId,
        requestId: request.id
      };
    });
  }, [rides, requests]);
  
  // Apply sorting and filtering
  const sortedAndFilteredHistory = useMemo(() => {
    let result = [...combinedRideHistory];
    
    // Apply filtering
    if (filterStatus !== 'all') {
      result = result.filter(item => item.status === filterStatus);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'location':
          comparison = a.pickupLocation.localeCompare(b.pickupLocation);
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [combinedRideHistory, sortField, sortDirection, filterStatus]);
  
  // Toggle sort direction or change sort field
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to descending
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Get status badge styling
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Render sort indicator
  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) return null;
    
    return (
      <span className="ml-1">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };
  
  if (!user) {
    return (
      <Card className={`${className} p-6`}>
        <div className="text-center py-8">
          <p className="text-gray-600">Please log in to view your ride history</p>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className={className}>
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Ride History</h3>
      </div>
      
      <div className="p-6">
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {/* Filtering and sorting controls */}
        <div className="mb-4 flex flex-wrap gap-2">
          <div>
            <label htmlFor="filter-status" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              id="filter-status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purdue-gold"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
            </select>
          </div>
          
          <div className="ml-auto">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSortField('date');
                setSortDirection('desc');
                setFilterStatus('all');
              }}
            >
              Reset Filters
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : sortedAndFilteredHistory.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No ride history found</p>
            {filterStatus !== 'all' && (
              <p className="text-sm text-gray-500 mt-2">
                Try changing your filters or book a ride to get started
              </p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    Date
                    {renderSortIndicator('date')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('location')}
                  >
                    Pickup Location
                    {renderSortIndicator('location')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destination
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    Status
                    {renderSortIndicator('status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedAndFilteredHistory.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(item.date).toLocaleDateString()}{' '}
                      {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.pickupLocation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.destination}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${item.cost.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RideHistory;