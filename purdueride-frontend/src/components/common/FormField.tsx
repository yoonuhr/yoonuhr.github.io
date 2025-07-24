import React, { forwardRef } from 'react';
import Input from './Input';
import ValidationError from './ValidationError';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  helpText?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
}

/**
 * FormField component that combines label, input, and validation error display
 * Provides a complete form field with proper accessibility attributes
 */
const FormField = forwardRef<HTMLInputElement, FormFieldProps>(({
  label,
  error,
  touched = false,
  required = false,
  helpText,
  containerClassName = '',
  labelClassName = '',
  inputClassName = '',
  id,
  ...inputProps
}, ref) => {
  const fieldId = id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const hasError = error && touched;
  const helpTextId = helpText ? `${fieldId}-help` : undefined;
  const errorId = hasError ? `${fieldId}-error` : undefined;

  return (
    <div className={`space-y-1 ${containerClassName}`}>
      <label
        htmlFor={fieldId}
        className={`block text-sm font-medium text-gray-700 ${labelClassName}`}
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      
      {helpText && (
        <p
          id={helpTextId}
          className="text-sm text-gray-500"
        >
          {helpText}
        </p>
      )}
      
      <Input
        ref={ref}
        id={fieldId}
        className={`${inputClassName} ${hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
        error={hasError ? error : undefined}
        aria-describedby={[helpTextId, errorId].filter(Boolean).join(' ') || undefined}
        required={required}
        {...inputProps}
      />
      
      <ValidationError
        error={error}
        touched={touched}
      />
    </div>
  );
});

FormField.displayName = 'FormField';

export default FormField;