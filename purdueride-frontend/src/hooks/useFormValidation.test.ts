import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useFormValidation, isPurdueEmail, usePurdueEmailValidation, usePasswordValidation } from './useFormValidation';

describe('useFormValidation', () => {
  interface TestFormData {
    email: string;
    password: string;
    name: string;
  }

  const initialValues: TestFormData = {
    email: '',
    password: '',
    name: ''
  };

  const validationRules = {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      errorMessage: 'Please enter a valid email address'
    },
    password: {
      required: true,
      minLength: 8,
      errorMessage: 'Password must be at least 8 characters'
    },
    name: {
      required: true,
      maxLength: 50,
      errorMessage: 'Name is required and must be less than 50 characters'
    }
  };

  it('initializes with correct default values', () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, validationRules)
    );

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
    expect(result.current.isValid).toBe(true);
  });

  it('handles field changes correctly', () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, validationRules)
    );

    act(() => {
      const mockEvent = {
        target: { name: 'email', value: 'test@example.com', type: 'text' }
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.handleChange(mockEvent);
    });

    expect(result.current.values.email).toBe('test@example.com');
  });

  it('validates required fields on blur', () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, validationRules)
    );

    act(() => {
      const mockEvent = {
        target: { name: 'email' }
      } as React.FocusEvent<HTMLInputElement>;
      result.current.handleBlur(mockEvent);
    });

    expect(result.current.touched.email).toBe(true);
    expect(result.current.errors.email).toBe('Please enter a valid email address');
  });

  it('validates email pattern', () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, validationRules)
    );

    act(() => {
      result.current.setFieldValue('email', 'invalid-email');
      result.current.setFieldTouched('email', true);
    });

    expect(result.current.errors.email).toBe('Please enter a valid email address');
  });

  it('validates minimum length', () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, validationRules)
    );

    act(() => {
      result.current.setFieldValue('password', '123');
      result.current.setFieldTouched('password', true);
    });

    expect(result.current.errors.password).toBe('Password must be at least 8 characters');
  });

  it('validates maximum length', () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, validationRules)
    );

    const longName = 'a'.repeat(51);
    act(() => {
      result.current.setFieldValue('name', longName);
      result.current.setFieldTouched('name', true);
    });

    expect(result.current.errors.name).toBe('Name is required and must be less than 50 characters');
  });

  it('validates entire form', () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, validationRules)
    );

    let isValid: boolean;
    act(() => {
      isValid = result.current.validateForm();
    });

    expect(isValid!).toBe(false);
    expect(result.current.touched.email).toBe(true);
    expect(result.current.touched.password).toBe(true);
    expect(result.current.touched.name).toBe(true);
  });

  it('resets form correctly', () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, validationRules)
    );

    act(() => {
      result.current.setFieldValue('email', 'test@example.com');
      result.current.setFieldTouched('email', true);
    });

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
  });
});

describe('isPurdueEmail', () => {
  it('validates Purdue email addresses correctly', () => {
    expect(isPurdueEmail('student@purdue.edu')).toBe(true);
    expect(isPurdueEmail('faculty@purdue.edu')).toBe(true);
    expect(isPurdueEmail('STUDENT@PURDUE.EDU')).toBe(true);
    expect(isPurdueEmail('test.user@purdue.edu')).toBe(true);
  });

  it('rejects non-Purdue email addresses', () => {
    expect(isPurdueEmail('student@gmail.com')).toBe(false);
    expect(isPurdueEmail('test@example.com')).toBe(false);
    expect(isPurdueEmail('invalid-email')).toBe(false);
    expect(isPurdueEmail('')).toBe(false);
  });
});

describe('usePurdueEmailValidation', () => {
  it('validates Purdue email correctly', () => {
    const { result } = renderHook(() => usePurdueEmailValidation());

    act(() => {
      result.current.setFieldValue('email', 'student@purdue.edu');
    });

    act(() => {
      result.current.validateField('email');
    });

    expect(result.current.errors.email).toBe('');
  });

  it('shows error for non-Purdue email', () => {
    const { result } = renderHook(() => usePurdueEmailValidation());

    act(() => {
      result.current.setFieldValue('email', 'student@gmail.com');
      result.current.setFieldTouched('email', true);
    });

    expect(result.current.errors.email).toBe('Please enter a valid Purdue email address');
  });
});

describe('usePasswordValidation', () => {
  it('validates strong password correctly', () => {
    const { result } = renderHook(() => usePasswordValidation());

    act(() => {
      result.current.setFieldValue('password', 'StrongPass123!');
    });

    act(() => {
      result.current.validateField('password');
    });

    expect(result.current.errors.password).toBe('');
  });

  it('shows error for weak password', () => {
    const { result } = renderHook(() => usePasswordValidation());

    act(() => {
      result.current.setFieldValue('password', 'weak');
      result.current.setFieldTouched('password', true);
    });

    expect(result.current.errors.password).toBe('Password must be at least 8 characters and include uppercase, lowercase, number, and special character');
  });
});