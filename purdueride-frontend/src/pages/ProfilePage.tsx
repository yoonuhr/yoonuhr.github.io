import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import UserProfile from '../components/features/UserProfile';
import RideHistory from '../components/features/RideHistory';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const ProfilePage: React.FC = () => {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, isLoading, navigate]);

  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
            <p className="text-gray-600 mb-6">
              You need to be logged in to view your profile.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                variant="primary"
                onClick={() => navigate('/login')}
              >
                Log In
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/register')}
              >
                Sign Up
              </Button>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <Button
            variant="secondary"
            onClick={handleLogout}
            className="mt-4 md:mt-0"
          >
            Log Out
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile */}
          <div className="lg:col-span-1">
            <UserProfile className="mb-8" />
            
            {/* Account Stats */}
            <Card className="mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Account Stats</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Total Rides</p>
                    <p className="text-2xl font-bold text-purdue-gold">12</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Money Saved</p>
                    <p className="text-2xl font-bold text-purdue-gold">$48</p>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Quick Actions */}
            <Card>
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
              </div>
              <div className="p-6 space-y-4">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => navigate('/ride-request')}
                >
                  Book a Ride
                </Button>
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => navigate('/rides')}
                >
                  View Available Rides
                </Button>
              </div>
            </Card>
          </div>

          {/* Ride History */}
          <div className="lg:col-span-2">
            <RideHistory />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;