import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import RideBookingForm from '../components/features/RideBookingForm';
import type { RideFormData } from '../components/features/RideBookingForm';
import ServiceCard from '../components/features/ServiceCardNew';
import Button from '../components/common/Button';

const HomePage = () => {
  const navigate = useNavigate();
  // State to store the submitted form data (used for debugging in development)
  const [_formData, setFormData] = useState<RideFormData | null>(null);
  
  const handleRideFormSubmit = (data: RideFormData) => {
    setFormData(data);
    // In a real app, this would navigate to a ride selection page or show ride options
    console.log('Ride form submitted:', data);
  };
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://www.purdue.edu/hr/workremotely/images/Gateway.jpg"
            alt="Purdue Campus" 
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        
        <div className="relative container mx-auto px-4 py-24 md:py-32 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Campus rides made easy
            </h1>
            <p className="text-xl mb-8 max-w-lg">
              PurdueRide connects you with reliable rides around campus and West Lafayette. Request a ride and arrive at your destination in minutes.
            </p>
            <div className="hidden md:block">
              <Button 
                variant="primary" 
                size="lg" 
                onClick={() => navigate('/register')}
              >
                Sign up to ride
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="ml-4"
                onClick={() => navigate('/register')}
              >
                Become a driver
              </Button>
            </div>
          </div>
          
          <div className="md:w-1/2 md:pl-8">
            <RideBookingForm onSubmit={handleRideFormSubmit} />
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ServiceCard
              title="Ride"
              description="Request a ride and get picked up by a nearby driver"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              }
              linkTo="/ride-request"
            />
            
            <ServiceCard
              title="Reserve"
              description="Schedule your ride in advance for peace of mind"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              linkTo="/reserve"
            />
            
            <ServiceCard
              title="Group Rides"
              description="Share your ride with friends and split the cost"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              linkTo="/group"
            />
            
            <ServiceCard
              title="Safety"
              description="Your safety is our priority with trusted drivers"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
              linkTo="/safety"
            />
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How PurdueRide Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-purdue-gold rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Request a ride</h3>
              <p className="text-gray-600">
                Enter your pickup location and destination to request a ride from nearby drivers.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purdue-gold rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Get matched with a driver</h3>
              <p className="text-gray-600">
                We'll match you with a nearby driver who will pick you up at your location.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purdue-gold rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Arrive at your destination</h3>
              <p className="text-gray-600">
                Your driver will take you to your destination safely and efficiently.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-purdue-gold text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to ride with PurdueRide?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of Purdue students who use PurdueRide for safe and convenient transportation around campus.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button variant="secondary" size="lg">
              Download the app
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purdue-gold">
              Learn more
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;