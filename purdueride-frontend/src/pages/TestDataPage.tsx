import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import TestDataHelper from '../utils/testDataHelper';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import { Link } from 'react-router-dom';

const TestDataPage: React.FC = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  const [email, setEmail] = useState('test@purdue.edu');
  const [password, setPassword] = useState('password123');
  const [errorRate, setErrorRate] = useState(0);
  const [users, setUsers] = useState(TestDataHelper.getAllUsers());
  const [showUsers, setShowUsers] = useState(false);
  const [showRides, setShowRides] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  
  // Refresh users list when needed
  const refreshUsers = () => {
    setUsers(TestDataHelper.getAllUsers());
  };
  
  // Create a test user
  const handleCreateTestUser = () => {
    TestDataHelper.createTestUser(email, password);
    refreshUsers();
  };
  
  // Create multiple test users
  const handleCreateMultipleUsers = () => {
    TestDataHelper.createMultipleTestUsers(5);
    refreshUsers();
  };
  
  // Reset mock data
  const handleResetData = () => {
    TestDataHelper.resetMockData();
    refreshUsers();
  };
  
  // Update error rate
  const handleUpdateErrorRate = () => {
    TestDataHelper.setApiErrorRate(errorRate);
  };
  
  // Handle login
  const handleLogin = async () => {
    await login(email, password);
  };
  
  // Handle logout
  const handleLogout = async () => {
    await logout();
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">PurdueRide Test Data Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Authentication Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Testing</h2>
          
          {isAuthenticated ? (
            <div className="space-y-4">
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                <p className="font-bold">Logged In Successfully!</p>
                <p>User: {user?.firstName} {user?.lastName}</p>
                <p>Email: {user?.email}</p>
              </div>
              <Button onClick={handleLogout} variant="secondary">Logout</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@purdue.edu"
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password123"
                helperText="Any password works in mock mode"
              />
              <Button onClick={handleLogin} variant="primary">Login</Button>
            </div>
          )}
          
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Note: In mock mode, any password will work as long as the email exists in the mock data.
            </p>
          </div>
        </Card>
        
        {/* Test Data Management */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Test Data Management</h2>
          
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Button onClick={handleCreateTestUser} variant="primary">
                Create Test User with Current Credentials
              </Button>
              <Button onClick={handleCreateMultipleUsers} variant="secondary">
                Create 5 Random Test Users
              </Button>
              <Button onClick={handleResetData} variant="secondary">
                Reset All Mock Data
              </Button>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Error Rate (0-1)
              </label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={errorRate}
                  onChange={(e) => setErrorRate(parseFloat(e.target.value))}
                />
                <Button onClick={handleUpdateErrorRate} variant="secondary">
                  Update
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                0 = no errors, 1 = always fail
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Mock Data Display */}
      <div className="mt-8 space-y-6">
        {/* Users */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Mock Users ({users.length})</h2>
            <Button 
              onClick={() => setShowUsers(!showUsers)} 
              variant="secondary"
            >
              {showUsers ? 'Hide' : 'Show'}
            </Button>
          </div>
          
          {showUsers && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.phoneNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isVerified === 'verified' 
                            ? 'bg-green-100 text-green-800' 
                            : user.isVerified === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isVerified}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
        
        {/* Rides */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Mock Rides ({TestDataHelper.getAllRides().length})</h2>
            <Button 
              onClick={() => setShowRides(!showRides)} 
              variant="secondary"
            >
              {showRides ? 'Hide' : 'Show'}
            </Button>
          </div>
          
          {showRides && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seats</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {TestDataHelper.getAllRides().map((ride) => (
                    <tr key={ride.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{ride.pickupLocation}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{ride.destination}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {ride.scheduledTime.toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          ride.status === 'available' 
                            ? 'bg-green-100 text-green-800' 
                            : ride.status === 'in-progress'
                            ? 'bg-blue-100 text-blue-800'
                            : ride.status === 'full'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {ride.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {ride.availableSeats}/{ride.totalSeats}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
        
        {/* Ride Requests */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Mock Ride Requests ({TestDataHelper.getAllRideRequests().length})</h2>
            <Button 
              onClick={() => setShowRequests(!showRequests)} 
              variant="secondary"
            >
              {showRequests ? 'Hide' : 'Show'}
            </Button>
          </div>
          
          {showRequests && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passengers</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {TestDataHelper.getAllRideRequests().map((request) => (
                    <tr key={request.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{request.userId.substring(0, 8)}...</td>
                      <td className="px-6 py-4 whitespace-nowrap">{request.pickupLocation}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {request.requestedTime.toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          request.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : request.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : request.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {request.passengerCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
      
      {/* Navigation Links */}
      <div className="mt-8 flex space-x-4">
        <Link to="/" className="text-blue-600 hover:text-blue-800">
          Back to Home
        </Link>
        <Link to="/login" className="text-blue-600 hover:text-blue-800">
          Go to Login Page
        </Link>
      </div>
    </div>
  );
};

export default TestDataPage;