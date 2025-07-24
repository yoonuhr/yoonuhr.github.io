import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import type { UpdateProfileRequest } from '../../types/api';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import useFormValidation from '../../hooks/useFormValidation';

interface UserProfileProps {
  className?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | undefined>(
    user?.profilePicture
  );

  // Initialize form validation with user data
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    validateForm,
    resetForm
  } = useFormValidation<{
    firstName: string;
    lastName: string;
    phoneNumber: string;
  }>(
    {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phoneNumber: user?.phoneNumber || '',
    },
    {
      firstName: {
        required: true,
        minLength: 2,
        errorMessage: 'First name is required'
      },
      lastName: {
        required: true,
        minLength: 2,
        errorMessage: 'Last name is required'
      },
      phoneNumber: {
        required: true,
        pattern: /^\d{10}$/,
        errorMessage: 'Please enter a valid 10-digit phone number'
      }
    }
  );

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      resetForm();
      setFieldValue('firstName', user.firstName);
      setFieldValue('lastName', user.lastName);
      setFieldValue('phoneNumber', user.phoneNumber);
      setProfilePicturePreview(user.profilePicture);
    }
  }, [user, resetForm, setFieldValue]);

  // Handle profile picture change
  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const isValid = validateForm();
    if (!isValid || !user) return;
    
    setIsSubmitting(true);
    setUpdateSuccess(false);
    setUpdateError(null);
    
    try {
      // Prepare update data
      const updateData: UpdateProfileRequest = {
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
      };
      
      // Add profile picture if changed
      if (profilePicture) {
        updateData.profilePicture = profilePicture;
      }
      
      // Call API to update profile
      const response = await apiService.updateProfile(user.id, updateData);
      
      if (response.success && response.data) {
        setUpdateSuccess(true);
        setIsEditing(false);
        // The updated user data will be reflected in the AuthContext
      } else {
        throw new Error(response.error?.message || 'Failed to update profile');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setUpdateError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    resetForm();
    setProfilePicture(null);
    setProfilePicturePreview(user?.profilePicture);
    setUpdateError(null);
  };

  if (!user) {
    return (
      <Card className={`${className} p-6`}>
        <div className="text-center py-8">
          <p className="text-gray-600">Please log in to view your profile</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`${className}`}>
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">User Profile</h3>
      </div>
      
      <div className="p-6">
        {updateSuccess && !isEditing && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            Profile updated successfully!
          </div>
        )}
        
        {updateError && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {updateError}
          </div>
        )}
        
        <div className="flex flex-col md:flex-row">
          {/* Profile Picture */}
          <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4">
              {profilePicturePreview ? (
                <img 
                  src={profilePicturePreview} 
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </div>
              )}
            </div>
            
            {isEditing && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Change Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-purdue-gold file:text-white
                    hover:file:bg-yellow-600"
                />
              </div>
            )}
          </div>
          
          {/* Profile Information */}
          <div className="md:w-2/3 md:pl-6">
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    name="firstName"
                    value={values.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.firstName ? errors.firstName : undefined}
                    required
                    fullWidth
                  />
                  
                  <Input
                    label="Last Name"
                    name="lastName"
                    value={values.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.lastName ? errors.lastName : undefined}
                    required
                    fullWidth
                  />
                </div>
                
                <Input
                  label="Email"
                  value={user.email}
                  disabled
                  helperText="Email cannot be changed"
                  fullWidth
                />
                
                <Input
                  label="Phone Number"
                  name="phoneNumber"
                  value={values.phoneNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.phoneNumber ? errors.phoneNumber : undefined}
                  helperText="Format: 10 digits (e.g., 7651234567)"
                  required
                  fullWidth
                />
                
                <div className="mt-6 flex space-x-4">
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    Save Changes
                  </Button>
                  
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancelEdit}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">First Name</p>
                    <p className="font-medium">{user.firstName}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Last Name</p>
                    <p className="font-medium">{user.lastName}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium">{user.phoneNumber}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Account Status</p>
                  <p className="font-medium">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.isVerified === 'verified' 
                        ? 'bg-green-100 text-green-800' 
                        : user.isVerified === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isVerified}
                    </span>
                  </p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                
                <Button
                  variant="primary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UserProfile;