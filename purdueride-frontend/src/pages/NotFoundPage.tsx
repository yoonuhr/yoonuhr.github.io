import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';

const NotFoundPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mb-8" role="alert">
          <h1 className="text-9xl font-bold text-purdue-gold">404</h1>
          <h2 className="text-4xl font-bold text-gray-800 mt-4">Page Not Found</h2>
        </div>
        
        <p className="text-xl text-gray-600 max-w-md mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button
            variant="primary"
            size="lg"
            as={Link}
            to="/"
          >
            Go to Homepage
          </Button>
          
          <Button
            variant="secondary"
            size="lg"
            as={Link}
            to="/ride-request"
          >
            Book a Ride
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFoundPage;