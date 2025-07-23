import { useState, useCallback } from 'react';

// Define validation rules type
type ValidationRules<T> = {
  [K in keyof T]?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    validate?: (value: T[K], formData: T) => boolean | string;
    errorMessage?: string;
  };
};

// Define form errors type
type FormErrors<T> = {
  [K in keyof T]?: string;
};

// Define the return type of our hook
interface UseFormValidationReturn<T> {
  values: T;
  errors: FormErrors<T>;
  touched: { [K in keyof T]?: boolean };
  isValid: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  setFieldValue: (name: keyof T, value: any) => void;
  setFieldTouched: (name: keyof T, isTouched?: boolean) => void;
  validateField: (name: keyof T) => boolean;
  validateForm: () => boolean;
  resetForm: () => void;
}

/**
 * Custom hook for form validation
 * @param initialValues Initial form values
 * @param validationRules Validation rules for each field
 * @returns Form validation utilities
 */
export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules<T>
): UseFormValidationReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<{ [K in keyof T]?: boolean }>({});

  // Validate a single field
  const validateField = useCallback(
    (name: keyof T): boolean => {
      const value = values[name];
      const rules = validationRules[name];

      if (!rules) return true;

      let error = '';

      // Required validation
      if (rules.required && (value === undefined || value === null || value === '')) {
        error = rules.errorMessage || 'This field is required';
      }
      // Min length validation
      else if (rules.minLength !== undefined && typeof value === 'string' && value.length < rules.minLength) {
        error = rules.errorMessage || `Minimum length is ${rules.minLength} characters`;
      }
      // Max length validation
      else if (rules.maxLength !== undefined && typeof value === 'string' && value.length > rules.maxLength) {
        error = rules.errorMessage || `Maximum length is ${rules.maxLength} characters`;
      }
      // Pattern validation
      else if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
        error = rules.errorMessage || 'Invalid format';
      }
      // Custom validation
      else if (rules.validate && !rules.validate(value, values)) {
        const validationResult = rules.validate(value, values);
        error = typeof validationResult === 'string' ? validationResult : rules.errorMessage || 'Invalid value';
      }

      // Update errors state
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));

      return error === '';
    },
    [values, validationRules]
  );

  // Validate the entire form
  const validateForm = useCallback((): boolean => {
    let isValid = true;
    const newErrors: FormErrors<T> = {};
    const newTouched: { [K in keyof T]?: boolean } = {};

    // Mark all fields as touched
    Object.keys(validationRules).forEach(key => {
      const fieldName = key as keyof T;
      newTouched[fieldName] = true;
      
      const isFieldValid = validateField(fieldName);
      if (!isFieldValid) {
        isValid = false;
        newErrors[fieldName] = errors[fieldName];
      }
    });

    setTouched(newTouched);
    return isValid;
  }, [validateField, errors, validationRules]);

  // Handle input change
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      const fieldName = name as keyof T;
      
      // Handle different input types
      const fieldValue = type === 'checkbox' ? checked : value;
      
      setValues(prev => ({
        ...prev,
        [fieldName]: fieldValue
      }));

      // Validate field if it's been touched
      if (touched[fieldName]) {
        validateField(fieldName);
      }
    },
    [touched, validateField]
  );

  // Handle input blur
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const { name } = e.target;
      const fieldName = name as keyof T;
      
      setTouched(prev => ({
        ...prev,
        [fieldName]: true
      }));
      
      validateField(fieldName);
    },
    [validateField]
  );

  // Set field value programmatically
  const setFieldValue = useCallback(
    (name: keyof T, value: any) => {
      setValues(prev => ({
        ...prev,
        [name]: value
      }));

      // Validate field if it's been touched
      if (touched[name]) {
        validateField(name);
      }
    },
    [touched, validateField]
  );

  // Set field touched state programmatically
  const setFieldTouched = useCallback(
    (name: keyof T, isTouched: boolean = true) => {
      setTouched(prev => ({
        ...prev,
        [name]: isTouched
      }));
      
      if (isTouched) {
        validateField(name);
      }
    },
    [validateField]
  );

  // Reset form to initial values
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  // Check if the form is valid
  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    validateField,
    validateForm,
    resetForm
  };
}

/**
 * Validates if an email is a valid Purdue email address
 * @param email Email to validate
 * @returns True if valid Purdue email, false otherwise
 */
export const isPurdueEmail = (email: string): boolean => {
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;
  
  // Check for Purdue domain
  return email.toLowerCase().endsWith('@purdue.edu');
};

/**
 * Custom hook for validating Purdue email addresses
 * @param initialEmail Initial email value
 * @returns Email validation utilities
 */
export function usePurdueEmailValidation(initialEmail: string = '') {
  return useFormValidation(
    { email: initialEmail },
    {
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        validate: (value) => isPurdueEmail(value as string) || 'Please use a valid Purdue email address',
        errorMessage: 'Please enter a valid Purdue email address'
      }
    }
  );
}

/**
 * Custom hook for password validation
 * @param initialPassword Initial password value
 * @returns Password validation utilities
 */
export function usePasswordValidation(initialPassword: string = '') {
  return useFormValidation(
    { password: initialPassword },
    {
      password: {
        required: true,
        minLength: 8,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        errorMessage: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character'
      }
    }
  );
}

export default useFormValidation;