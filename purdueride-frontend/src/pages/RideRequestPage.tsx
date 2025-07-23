import { useState } from 'react';
import RideRequestForm from '../components/features/RideRequestForm';
import type { RideRequestData } from '../components/features/RideRequestForm';

const RideRequestPage = () => {
  const [lastSubmission, setLastSubmission] = useState<RideRequestData | null>(null);

  const handleSubmit = (formData: RideRequestData) => {
    setLastSubmission(formData);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Request a Ride</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <RideRequestForm onSubmit={handleSubmit} />
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">How It Works</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-purdue-gold rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
                1
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Request a Ride</h3>
                <p className="text-gray-600">Enter your pickup location and other details to request a ride.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-purdue-gold rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
                2
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Get Matched</h3>
                <p className="text-gray-600">We'll match you with a driver heading to campus.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-purdue-gold rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
                3
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Enjoy Your Ride</h3>
                <p className="text-gray-600">Get to campus safely and on time for just $3.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Why PurdueRide?</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Fixed $3 price for all rides
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified Purdue student drivers
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Safe and reliable transportation
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Schedule rides in advance
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {lastSubmission && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Last Submission:</h3>
          <pre className="whitespace-pre-wrap">{JSON.stringify(lastSubmission, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default RideRequestPage;