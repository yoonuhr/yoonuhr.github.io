import { useId, useCallback, useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFormValidation, isPurdueEmail } from './useFormValidation';

// Login form data type
interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

// Registration form data type
interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

/**
 * Custom hook for login form with authentication integration
 * @returns Login form utilities and authentication methods
 */
export function useLoginForm() {
  const auth = useAuth();
  const formId = useId();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form validation
  const {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    setFieldValue,
    validateForm,
    resetForm
  } = useFormValidation<LoginFormData>(
    {
      email: '',
      password: '',
      rememberMe: false
    },
    {
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        validate: (value) => isPurdueEmail(value) || 'Please use a valid Purdue email address',
        errorMessage: 'Please enter a valid Purdue email address'
      },
      password: {
        required: true,
        errorMessage: 'Password is required'
      }
    }
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      
      if (!validateForm()) {
        return;
      }
      
      setIsSubmitting(true);
      
      try {
        const success = await auth.login(
          values.email,
          values.password,
          values.rememberMe
        );
        
        if (success) {
          resetForm();
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [auth, values, validateForm, resetForm]
  );

  return {
    formId,
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    authError: auth.error,
    isLoading: auth.isLoading || isSubmitting,
    handleChange,
    handleBlur,
    setFieldValue,
    handleSubmit,
    resetForm,
    clearAuthError: auth.clearError
  };
}

/**
 * Custom hook for registration form with authentication integration
 * @returns Registration form utilities and authentication methods
 */
export function useRegisterForm() {
  const auth = useAuth();
  const formId = useId();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form validation
  const {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    setFieldValue,
    validateForm,
    resetForm
  } = useFormValidation<RegisterFormData>(
    {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phoneNumber: ''
    },
    {
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        validate: (value) => isPurdueEmail(value) || 'Please use a valid Purdue email address',
        errorMessage: 'Please enter a valid Purdue email address'
      },
      password: {
        required: true,
        minLength: 8,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        errorMessage: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character'
      },
      confirmPassword: {
        required: true,
        validate: (value, formData) => value === formData.password || 'Passwords do not match',
        errorMessage: 'Passwords must match'
      },
      firstName: {
        required: true,
        errorMessage: 'First name is required'
      },
      lastName: {
        required: true,
        errorMessage: 'Last name is required'
      },
      phoneNumber: {
        required: true,
        pattern: /^\d{10}$/,
        errorMessage: 'Please enter a valid 10-digit phone number'
      }
    }
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      
      if (!validateForm()) {
        return;
      }
      
      setIsSubmitting(true);
      
      try {
        const success = await auth.register({
          email: values.email,
          password: values.password,
          firstName: values.firstName,
          lastName: values.lastName,
          phoneNumber: values.phoneNumber
        });
        
        if (success) {
          resetForm();
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [auth, values, validateForm, resetForm]
  );

  return {
    formId,
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    authError: auth.error,
    isLoading: auth.isLoading || isSubmitting,
    handleChange,
    handleBlur,
    setFieldValue,
    handleSubmit,
    resetForm,
    clearAuthError: auth.clearError
  };
}

export default { useLoginForm, useRegisterForm };