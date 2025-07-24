import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import RidesList from '../components/features/RidesList';
import RideRequestForm from '../components/features/RideRequestForm';
import Card from '../components/common/Card';
import type { Ride } from '../types';
import type { RideRequestData } from '../components/features/RideRequestForm';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const RidesPage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  // Using _ prefix to indicate these variables are intentionally unused for now
  const [_selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [_isLoading] = useState(false);
  const [_error] = useState<string | null>(null);

  // Handle ride selection
  const handleSelectRide = (ride: Ride) => {
    setSelectedRide(ride);
  };

  // Handle ride request form submission
  const handleRideFormSubmit = (data: RideRequestData) => {
    console.log('Ride form submitted:', data);
    // In a real app, this would book the ride and navigate to a confirmation page
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Available Rides</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ride Request Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              {user ? (
                <RideRequestForm onSubmit={handleRideFormSubmit} />
              ) : (
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-4">Book a Ride</h3>
                  <p className="text-gray-600 mb-6">
                    Please log in to request a ride with PurdueRide.
                  </p>
                  <div className="flex flex-col space-y-4">
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={() => navigate('/login')}
                    >
                      Log In
                    </Button>
                    <Button
                      variant="secondary"
                      fullWidth
                      onClick={() => navigate('/register')}
                    >
                      Sign Up
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Rides List */}
          <div className="lg:col-span-2">
            <RidesList
              onSelectRide={handleSelectRide}
              isLoading={_isLoading}
              error={_error || undefined}
              className="mb-8"
            />

            {/* Fixed Price Banner */}
            <Card className="bg-purdue-gold text-white p-6 text-center">
              <h3 className="text-2xl font-bold mb-2">Fixed Price: $3 per ride</h3>
              <p className="text-lg">
                No surge pricing, no hidden fees. Just a simple $3 flat rate for all campus rides.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RidesPage;