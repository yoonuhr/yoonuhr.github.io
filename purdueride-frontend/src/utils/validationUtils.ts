/**
 * Validation utility functions for common form validation patterns
 */

// Email validation patterns
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PURDUE_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@purdue\.edu$/i;

// Phone number patterns
export const PHONE_REGEX = /^\d{10}$/;
export const PHONE_WITH_FORMATTING_REGEX = /^\(\d{3}\)\s\d{3}-\d{4}$/;

// Password patterns
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Name patterns
export const NAME_REGEX = /^[a-zA-Z\s'-]{2,50}$/;

/**
 * Validates if a string is a valid email address
 */
export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email.trim());
};

/**
 * Validates if a string is a valid Purdue email address
 */
export const isValidPurdueEmail = (email: string): boolean => {
  return PURDUE_EMAIL_REGEX.test(email.trim());
};

/**
 * Validates if a string is a valid phone number (10 digits)
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '');
  return PHONE_REGEX.test(cleanPhone);
};

/**
 * Validates if a string meets password requirements
 * - At least 8 characters
 * - Contains uppercase letter
 * - Contains lowercase letter
 * - Contains number
 * - Contains special character
 */
export const isValidPassword = (password: string): boolean => {
  return PASSWORD_REGEX.test(password);
};

/**
 * Validates if a string is a valid name (first or last name)
 */
export const isValidName = (name: string): boolean => {
  return NAME_REGEX.test(name.trim());
};

/**
 * Formats a phone number to (XXX) XXX-XXXX format
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length === 10) {
    return `(${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}`;
  }
  return phone;
};

/**
 * Removes formatting from phone number, leaving only digits
 */
export const cleanPhoneNumber = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

/**
 * Validates if two passwords match
 */
export const passwordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

/**
 * Gets password strength score (0-4)
 * 0 = Very weak, 4 = Very strong
 */
export const getPasswordStrength = (password: string): number => {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[@$!%*?&]/.test(password)) score++;
  
  return Math.min(score, 4);
};

/**
 * Gets password strength label
 */
export const getPasswordStrengthLabel = (password: string): string => {
  const strength = getPasswordStrength(password);
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  return labels[strength] || 'Very Weak';
};

/**
 * Gets password strength color class for UI
 */
export const getPasswordStrengthColor = (password: string): string => {
  const strength = getPasswordStrength(password);
  const colors = [
    'text-red-600',
    'text-red-500', 
    'text-yellow-500',
    'text-blue-500',
    'text-green-500'
  ];
  return colors[strength] || 'text-red-600';
};

/**
 * Common validation error messages
 */
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PURDUE_EMAIL: 'Please use a valid Purdue email address (@purdue.edu)',
  INVALID_PHONE: 'Please enter a valid 10-digit phone number',
  INVALID_PASSWORD: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  INVALID_NAME: 'Please enter a valid name (2-50 characters, letters only)',
  MIN_LENGTH: (min: number) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max: number) => `Must be no more than ${max} characters`,
} as const;

/**
 * Validation rule factory functions
 */
export const createValidationRules = {
  required: (message = VALIDATION_MESSAGES.REQUIRED) => ({
    required: true,
    errorMessage: message
  }),
  
  email: (message = VALIDATION_MESSAGES.INVALID_EMAIL) => ({
    pattern: EMAIL_REGEX,
    validate: isValidEmail,
    errorMessage: message
  }),
  
  purdueEmail: (message = VALIDATION_MESSAGES.INVALID_PURDUE_EMAIL) => ({
    pattern: PURDUE_EMAIL_REGEX,
    validate: isValidPurdueEmail,
    errorMessage: message
  }),
  
  phone: (message = VALIDATION_MESSAGES.INVALID_PHONE) => ({
    pattern: PHONE_REGEX,
    validate: (value: string) => isValidPhoneNumber(value),
    errorMessage: message
  }),
  
  password: (message = VALIDATION_MESSAGES.INVALID_PASSWORD) => ({
    minLength: 8,
    pattern: PASSWORD_REGEX,
    validate: isValidPassword,
    errorMessage: message
  }),
  
  name: (message = VALIDATION_MESSAGES.INVALID_NAME) => ({
    minLength: 2,
    maxLength: 50,
    pattern: NAME_REGEX,
    validate: isValidName,
    errorMessage: message
  }),
  
  minLength: (min: number, message?: string) => ({
    minLength: min,
    errorMessage: message || VALIDATION_MESSAGES.MIN_LENGTH(min)
  }),
  
  maxLength: (max: number, message?: string) => ({
    maxLength: max,
    errorMessage: message || VALIDATION_MESSAGES.MAX_LENGTH(max)
  })
};

export default {
  isValidEmail,
  isValidPurdueEmail,
  isValidPhoneNumber,
  isValidPassword,
  isValidName,
  formatPhoneNumber,
  cleanPhoneNumber,
  passwordsMatch,
  getPasswordStrength,
  getPasswordStrengthLabel,
  getPasswordStrengthColor,
  VALIDATION_MESSAGES,
  createValidationRules
};