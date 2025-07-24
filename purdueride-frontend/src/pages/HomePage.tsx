import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import RideBookingForm from '../components/features/RideBookingForm';
import type { RideFormData } from '../components/features/RideBookingForm';
import ServiceCard from '../components/features/ServiceCardNew';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

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
      <section className="relative bg-gray-900 text-white" aria-labelledby="hero-heading">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://www.purdue.edu/hr/workremotely/images/Gateway.jpg"
            alt="Purdue University campus background" 
            className="w-full h-full object-cover opacity-40"
            aria-hidden="true"
          />
        </div>
        
        <div className="relative container mx-auto px-4 py-16 sm:py-20 md:py-24 lg:py-32 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <div className="flex items-center mb-4">
              <img 
                src="/src/assets/purdue-logo.svg" 
                alt="Purdue Logo" 
                className="h-10 sm:h-12 mr-2 sm:mr-3"
              />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                PurdueRide
              </h1>
            </div>
            
            <h2 id="hero-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Campus rides made easy
            </h2>
            
            <div className="bg-purdue-gold text-white text-xl sm:text-2xl md:text-3xl font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg inline-block mb-4 sm:mb-6">
              Just $3 per ride
            </div>
            
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-lg">
              PurdueRide connects you with reliable rides around campus and West Lafayette. Request a ride and arrive at your destination in minutes.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                variant="primary" 
                size="lg" 
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto"
              >
                Sign up to ride
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto"
              >
                Become a driver
              </Button>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 md:pl-8">
            <Card className="shadow-lg">
              <div className="p-1 bg-purdue-gold text-white text-center font-bold rounded-t-lg">
                Book Your $3 Ride Now
              </div>
              <div className="p-4 sm:p-6">
                <RideBookingForm onSubmit={handleRideFormSubmit} />
              </div>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Key Benefits Section */}
      <section className="py-12 sm:py-16 bg-white" aria-labelledby="benefits-heading">
        <div className="container mx-auto px-4">
          <h2 id="benefits-heading" className="text-2xl sm:text-3xl font-bold text-center mb-3 sm:mb-4">Why Choose PurdueRide?</h2>
          <p className="text-base sm:text-lg md:text-xl text-center text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto">
            PurdueRide is designed specifically for Purdue students, offering affordable and reliable transportation around campus.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-gray-50 rounded-xl p-6 sm:p-8 shadow-md transform transition-transform hover:scale-105">
              <div className="bg-purdue-gold rounded-full h-16 w-16 flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-center mb-3 sm:mb-4">Affordable Fixed Price</h3>
              <div className="text-center mb-4">
                <span className="text-3xl sm:text-4xl font-bold text-purdue-gold">$3</span>
                <span className="text-gray-600 ml-2">per ride</span>
              </div>
              <p className="text-gray-600 text-center">
                No surge pricing, no hidden fees. Just a simple $3 flat rate for all campus rides.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 sm:p-8 shadow-md transform transition-transform hover:scale-105">
              <div className="bg-purdue-gold rounded-full h-16 w-16 flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-center mb-3 sm:mb-4">Quick & Convenient</h3>
              <p className="text-gray-600 text-center">
                Get picked up in minutes, not hours. Our drivers are always nearby and ready to go.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 sm:p-8 shadow-md transform transition-transform hover:scale-105">
              <div className="bg-purdue-gold rounded-full h-16 w-16 flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-center mb-3 sm:mb-4">Safe & Reliable</h3>
              <p className="text-gray-600 text-center">
                All drivers are verified Purdue students. Track your ride in real-time for peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-12 sm:py-16 bg-gray-50" aria-labelledby="services-heading">
        <div className="container mx-auto px-4">
          <h2 id="services-heading" className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Our Services</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
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
      <section className="py-12 sm:py-16" aria-labelledby="how-it-works-heading">
        <div className="container mx-auto px-4">
          <h2 id="how-it-works-heading" className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">How PurdueRide Works</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
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
      <section className="py-12 sm:py-16 bg-purdue-gold text-white" aria-labelledby="cta-heading">
        <div className="container mx-auto px-4 text-center">
          <h2 id="cta-heading" className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Ready to ride with PurdueRide?</h2>
          <div className="bg-white text-purdue-gold text-2xl sm:text-3xl md:text-4xl font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg inline-block mb-4 sm:mb-6">
            Just $3 per ride
          </div>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join thousands of Purdue students who use PurdueRide for safe and convenient transportation around campus.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto"
            >
              Sign up now
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white hover:text-purdue-gold w-full sm:w-auto"
              onClick={() => navigate('/ride-request')}
            >
              Book a ride
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;