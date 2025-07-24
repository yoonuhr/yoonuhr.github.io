import { forwardRef, useState } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'as' | 'rows'> {
  /**
   * Input label text
   */
  label?: string;
  
  /**
   * Error message to display
   */
  error?: string;
  
  /**
   * Success message to display
   */
  successMessage?: string;
  
  /**
   * Whether the input is in a valid state
   */
  isValid?: boolean;
  
  /**
   * Whether the input should take up the full width of its container
   */
  fullWidth?: boolean;
  
  /**
   * Helper text to display below the input
   */
  helperText?: string;
  
  /**
   * Icon to display at the start of the input
   */
  leftIcon?: ReactNode;
  
  /**
   * Icon to display at the end of the input
   */
  rightIcon?: ReactNode;
  
  /**
   * Whether the input is required
   */
  required?: boolean;
  
  /**
   * Render as a different element
   */
  as?: 'input' | 'textarea';
  
  /**
   * Number of rows (for textarea)
   */
  rows?: number;
}

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ 
    label, 
    error, 
    successMessage,
    isValid,
    fullWidth = false, 
    className = '', 
    helperText,
    leftIcon,
    rightIcon,
    required = false,
    type = 'text',
    disabled = false,
    id,
    as = 'input',
    rows = 3,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const uniqueId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
    
    // Base classes that apply to all inputs - ensuring 44px minimum touch target
    const baseClasses = 'rounded-md border px-4 py-3 transition-colors focus:outline-none focus:ring-2 min-h-[44px] text-base w-full';
    
    // State-specific classes
    const stateClasses = error 
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50' 
      : isValid 
        ? 'border-green-500 focus:ring-green-500 focus:border-green-500 bg-green-50'
        : 'border-gray-300 focus:ring-purdue-gold focus:border-purdue-gold';
    
    // Width class
    const widthClass = fullWidth ? 'w-full' : '';
    
    // Disabled state classes
    const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed bg-gray-100' : '';
    
    // Icon padding classes
    const leftIconPadding = leftIcon ? 'pl-10' : '';
    const rightIconPadding = rightIcon ? 'pr-10' : '';
    
    // Progressive enhancement for focus-visible
    const focusVisibleClasses = 'supports-[selector(:focus-visible)]:focus:ring-0 supports-[selector(:focus-visible)]:focus-visible:ring-2';
    
    // Combine all classes
    const combinedClasses = `${baseClasses} ${stateClasses} ${widthClass} ${disabledClasses} ${leftIconPadding} ${rightIconPadding} ${focusVisibleClasses} ${className}`;
    
    // Common props for both input and textarea
    const commonProps = {
      id: uniqueId,
      className: combinedClasses,
      disabled,
      'aria-invalid': error ? true : undefined,
      'aria-required': required ? true : undefined,
      'aria-describedby': error 
        ? `${uniqueId}-error` 
        : successMessage && isValid 
          ? `${uniqueId}-success` 
          : helperText 
            ? `${uniqueId}-helper` 
            : undefined,
      onFocus: () => setIsFocused(true),
      onBlur: () => setIsFocused(false),
      ...props
    };
    
    return (
      <div className={`${fullWidth ? 'w-full' : ''} mb-4 sm:mb-6`}>
        {label && (
          <label 
            htmlFor={uniqueId}
            className={`block text-gray-700 font-medium mb-1 ${isFocused ? 'text-purdue-gold' : ''}`}
          >
            {label}
            {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
            {required && <span className="sr-only">(required)</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
              {leftIcon}
            </div>
          )}
          
          {as === 'textarea' ? (
            <textarea
              ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
              rows={rows}
              id={uniqueId}
              className={combinedClasses}
              disabled={disabled}
              aria-invalid={error ? true : undefined}
              aria-required={required ? true : undefined}
              aria-describedby={error 
                ? `${uniqueId}-error` 
                : helperText 
                  ? `${uniqueId}-helper` 
                  : undefined}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              {...(props as unknown as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input 
              ref={ref as React.ForwardedRef<HTMLInputElement>}
              type={type}
              {...commonProps}
            />
          )}
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p id={`${uniqueId}-error`} className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        
        {!error && successMessage && isValid && (
          <p id={`${uniqueId}-success`} className="mt-1 text-sm text-green-600">
            {successMessage}
          </p>
        )}
        
        {!error && !successMessage && helperText && (
          <p id={`${uniqueId}-helper`} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

// Display name for better debugging
Input.displayName = 'Input';

export default Input;