import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';
import { useLoginForm } from '../../hooks/useAuthForm';
import LoadingSpinner from '../common/LoadingSpinner';

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
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
  } = useLoginForm();

  // Handle successful login
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
        <Input
          id={`${formId}-email`}
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email ? errors.email : undefined}
          fullWidth
        />

        <div>
          <Input
            id={`${formId}-password`}
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password ? errors.password : undefined}
            fullWidth
          />
          <div className="text-right mt-1">
            <Link to="/forgot-password" className="text-sm text-purdue-gold hover:text-yellow-600">
              Forgot your password?
            </Link>
          </div>
        </div>

        <div className="flex items-center">
          <input
            id={`${formId}-remember-me`}
            name="rememberMe"
            type="checkbox"
            className="h-4 w-4 text-purdue-gold focus:ring-purdue-gold border-gray-300 rounded"
            checked={values.rememberMe}
            onChange={handleChange}
          />
          <label htmlFor={`${formId}-remember-me`} className="ml-2 block text-sm text-gray-900">
            Remember me
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
              Signing in...
            </span>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            aria-label="Sign in with GitHub"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.022A9.578 9.578 0 0110 4.836c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <button
            type="button"
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            aria-label="Sign in with LinkedIn"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 0C4.477 0 0 4.477 0 10c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10C20 4.477 15.523 0 10 0zm-1.786 15.267h-2.3v-6.87h2.3v6.87zM5.85 7.267c-.748 0-1.35-.602-1.35-1.35 0-.746.602-1.35 1.35-1.35.747 0 1.35.604 1.35 1.35 0 .748-.603 1.35-1.35 1.35zm11.53 8h-2.297v-3.568c0-.913-.026-2.088-1.272-2.088-1.272 0-1.468.995-1.468 2.023v3.633h-2.296v-6.87h2.207v1.01h.03c.327-.62 1.122-1.272 2.31-1.272 2.47 0 2.93 1.628 2.93 3.745v3.387z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;