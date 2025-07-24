import { useState, useCallback, useId, useTransition } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import { useFormValidation } from '../../hooks/useFormValidation';
import { apiService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import type { RideRequestPayload } from '../../types/api';

interface RideRequestFormProps {
  onSubmit?: (formData: RideRequestData) => void;
  className?: string;
}

export interface RideRequestData {
  pickupLocation: string;
  destination: string;
  requestedTime: Date | string;
  passengerCount: number;
  specialInstructions?: string;
}

const RideRequestForm = ({ onSubmit, className = '' }: RideRequestFormProps) => {
  const formId = useId();
  // We're not using the user object directly to avoid the unused variable warning
  useAuth(); // Just access auth context without destructuring
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showScheduleOptions, setShowScheduleOptions] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Initialize form validation
  const {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    validateForm,
    resetForm
  } = useFormValidation<RideRequestData>(
    {
      pickupLocation: '',
      destination: 'Purdue University',
      requestedTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes from now
      passengerCount: 1,
      specialInstructions: ''
    },
    {
      pickupLocation: {
        required: true,
        errorMessage: 'Please enter your pickup location'
      },
      destination: {
        required: true,
        errorMessage: 'Please enter your destination'
      },
      passengerCount: {
        required: true,
        validate: (value) => 
          (Number(value) >= 1 && Number(value) <= 4) || 
          'Passenger count must be between 1 and 4',
        errorMessage: 'Please enter a valid passenger count (1-4)'
      }
    }
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!validateForm()) {
        return;
      }
      
      setIsSubmitting(true);
      setSubmissionError(null);
      
      try {
        // Prepare request payload
        const requestPayload: RideRequestPayload = {
          pickupLocation: values.pickupLocation,
          destination: values.destination,
          requestedTime: values.requestedTime,
          passengerCount: values.passengerCount,
          specialInstructions: values.specialInstructions
        };
        
        // Call API service
        const response = await apiService.requestRide(requestPayload);
        
        if (response.success && response.data) {
          // Show confirmation with non-urgent UI update
          startTransition(() => {
            setShowConfirmation(true);
          });
          
          // Call onSubmit callback if provided
          if (onSubmit) {
            onSubmit(values);
          }
          
          // Reset form after successful submission
          resetForm();
        } else {
          throw new Error(response.error?.message || 'Failed to request ride');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        setSubmissionError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateForm, resetForm, onSubmit]
  );

  // Toggle schedule options
  const toggleScheduleOptions = useCallback(() => {
    setShowScheduleOptions(prev => !prev);
  }, []);

  // Handle passenger count change
  const handlePassengerCountChange = useCallback((change: number) => {
    const newCount = Math.max(1, Math.min(4, values.passengerCount + change));
    setFieldValue('passengerCount', newCount);
    setFieldTouched('passengerCount', true);
  }, [values.passengerCount, setFieldValue, setFieldTouched]);

  // Reset confirmation state
  const handleRequestAnother = useCallback(() => {
    setShowConfirmation(false);
  }, []);

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {!showConfirmation ? (
        <>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Request a ride</h2>
          
          <form id={`${formId}-form`} onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Pickup location"
              name="pickupLocation"
              value={values.pickupLocation}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your pickup location"
              error={touched.pickupLocation ? errors.pickupLocation : undefined}
              fullWidth
              required
              leftIcon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              }
            />
            
            <Input
              label="Destination"
              name="destination"
              value={values.destination}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your destination"
              error={touched.destination ? errors.destination : undefined}
              fullWidth
              required
              leftIcon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              }
            />
            
            <div className="flex items-center">
              <Button 
                type="button" 
                variant="text" 
                onClick={toggleScheduleOptions}
                className="flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                {showScheduleOptions ? 'Ride now' : 'Schedule for later'}
              </Button>
            </div>
            
            {showScheduleOptions && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Date"
                  type="date"
                  name="requestedTime"
                  value={values.requestedTime instanceof Date 
                    ? values.requestedTime.toISOString().split('T')[0] 
                    : values.requestedTime.split('T')[0]}
                  onChange={(e) => {
                    const date = e.target.value;
                    const time = values.requestedTime instanceof Date 
                      ? values.requestedTime.toISOString().split('T')[1] 
                      : values.requestedTime.split('T')[1];
                    setFieldValue('requestedTime', `${date}T${time}`);
                  }}
                  fullWidth
                />
                
                <Input
                  label="Time"
                  type="time"
                  name="requestedTime"
                  value={values.requestedTime instanceof Date 
                    ? values.requestedTime.toTimeString().slice(0, 5) 
                    : values.requestedTime.split('T')[1].slice(0, 5)}
                  onChange={(e) => {
                    const time = e.target.value;
                    const date = values.requestedTime instanceof Date 
                      ? values.requestedTime.toISOString().split('T')[0] 
                      : values.requestedTime.split('T')[0];
                    setFieldValue('requestedTime', `${date}T${time}:00`);
                  }}
                  fullWidth
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">
                Number of passengers
                {errors.passengerCount && touched.passengerCount && (
                  <span className="text-red-600 ml-1 text-sm">({errors.passengerCount})</span>
                )}
              </label>
              
              <div className="flex items-center space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => handlePassengerCountChange(-1)}
                  disabled={values.passengerCount <= 1}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </Button>
                
                <span className="text-lg font-medium">{values.passengerCount}</span>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => handlePassengerCountChange(1)}
                  disabled={values.passengerCount >= 4}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </Button>
              </div>
            </div>
            
            <Input
              label="Special instructions (optional)"
              name="specialInstructions"
              value={values.specialInstructions || ''}
              onChange={handleChange}
              placeholder="Any special instructions for the driver"
              fullWidth
              as="textarea"
              rows={3}
            />
            
            {submissionError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {submissionError}
              </div>
            )}
            
            <div className="pt-4">
              <Button 
                type="submit" 
                variant="primary" 
                fullWidth 
                size="lg"
                isLoading={isSubmitting || isPending}
                disabled={isSubmitting || isPending || !isValid}
              >
                Request Ride - $3.00
              </Button>
            </div>
          </form>
        </>
      ) : (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Ride Requested!</h2>
          <p className="text-gray-600 mb-6">
            Your ride has been requested. We'll notify you when a driver accepts your request.
          </p>
          
          <Button 
            variant="primary" 
            onClick={handleRequestAnother}
          >
            Request Another Ride
          </Button>
        </div>
      )}
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">Estimated arrival: 5-10 minutes</span>
          </div>
          
          <div className="flex items-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Fixed price: $3.00</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideRequestForm;