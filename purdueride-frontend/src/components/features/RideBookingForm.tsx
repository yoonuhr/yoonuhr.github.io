import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';

interface RideBookingFormProps {
  onSubmit?: (formData: RideFormData) => void;
  className?: string;
}

export interface RideFormData {
  pickup: string;
  dropoff: string;
  date?: string;
  time?: string;
}

const RideBookingForm = ({ onSubmit, className = '' }: RideBookingFormProps) => {
  const [formData, setFormData] = useState<RideFormData>({
    pickup: '',
    dropoff: '',
    date: '',
    time: ''
  });
  
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };
  
  const toggleDateTimePicker = () => {
    setShowDateTimePicker(!showDateTimePicker);
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-lg p-4 sm:p-6 ${className}`}>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Request a ride</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label="Pickup location"
            name="pickup"
            value={formData.pickup}
            onChange={handleChange}
            placeholder="Enter pickup location"
            fullWidth
            required
          />
          
          <Input
            label="Dropoff location"
            name="dropoff"
            value={formData.dropoff}
            onChange={handleChange}
            placeholder="Enter destination"
            fullWidth
            required
          />
          
          <div className="flex items-center">
            <Button 
              type="button" 
              variant="text" 
              onClick={toggleDateTimePicker}
              className="flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span className="text-sm sm:text-base">
                {showDateTimePicker ? 'Ride now' : 'Schedule for later'}
              </span>
            </Button>
          </div>
          
          {showDateTimePicker && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                fullWidth
              />
              
              <Input
                label="Time"
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                fullWidth
              />
            </div>
          )}
          
          <Button type="submit" variant="primary" fullWidth size="lg">
            See prices
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RideBookingForm;