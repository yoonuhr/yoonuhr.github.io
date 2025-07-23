import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';
import { useRegisterForm } from '../../hooks/useAuthForm';
import LoadingSpinner from '../common/LoadingSpinner';

interface RegisterFormProps {
  onSuccess?: () => void;
}

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const navigate = useNavigate();
  const [hasSubmittedSuccessfully, setHasSubmittedSuccessfully] = React.useState(false);
  const {
    formId,
    values,
    errors,
    touched,
    isSubmitting,
    authError,
    handleChange,
    handleBlur,
    handleSubmit,
    clearAuthError
  } = useRegisterForm();

  // Handle successful registration
  React.useEffect(() => {
    if (hasSubmittedSuccessfully && !isSubmitting && !authError && values.email === '') {
      // Form was reset after successful submission
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/');
      }
      setHasSubmittedSuccessfully(false); // Reset the flag
    }
  }, [hasSubmittedSuccessfully, isSubmitting, authError, values.email, onSuccess, navigate]);

  // Track when form submission starts
  const handleFormSubmit = React.useCallback((e: React.FormEvent) => {
    setHasSubmittedSuccessfully(true);
    handleSubmit(e);
  }, [handleSubmit]);

  // Clear auth error when form changes
  React.useEffect(() => {
    if (authError) {
      clearAuthError();
    }
  }, [values, authError, clearAuthError]);

  return (
    <div className="w-full">
      {authError && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {authError}
        </div>
      )}
      
      <form className="space-y-6" onSubmit={handleFormSubmit}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Input
            id={`${formId}-firstName`}
            label="First name"
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            value={values.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.firstName ? errors.firstName : undefined}
            fullWidth
          />

          <Input
            id={`${formId}-lastName`}
            label="Last name"
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
            value={values.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.lastName ? errors.lastName : undefined}
            fullWidth
          />
        </div>

        <Input
          id={`${formId}-email`}
          label="Purdue email address"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email ? errors.email : undefined}
          helperText="Please use your @purdue.edu email address"
          fullWidth
        />

        <Input
          id={`${formId}-phoneNumber`}
          label="Phone number"
          name="phoneNumber"
          type="tel"
          autoComplete="tel"
          required
          value={values.phoneNumber}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.phoneNumber ? errors.phoneNumber : undefined}
          helperText="Format: 10 digits (e.g., 7651234567)"
          fullWidth
        />

        <Input
          id={`${formId}-password`}
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.password ? errors.password : undefined}
          helperText="Must be at least 8 characters with uppercase, lowercase, number, and special character"
          fullWidth
        />

        <Input
          id={`${formId}-confirmPassword`}
          label="Confirm password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          value={values.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.confirmPassword ? errors.confirmPassword : undefined}
          fullWidth
        />

        <div className="flex items-center">
          <input
            id={`${formId}-terms`}
            name="terms"
            type="checkbox"
            required
            className="h-4 w-4 text-purdue-gold focus:ring-purdue-gold border-gray-300 rounded"
          />
          <label htmlFor={`${formId}-terms`} className="ml-2 block text-sm text-gray-900">
            I agree to the{' '}
            <Link to="/terms" className="text-purdue-gold hover:text-yellow-600">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-purdue-gold hover:text-yellow-600">
              Privacy Policy
            </Link>
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <LoadingSpinner size="sm" className="mr-2" />
              Creating account...
            </span>
          ) : (
            'Create account'
          )}
        </Button>
      </form>
    </div>
  );
};

export default RegisterForm;