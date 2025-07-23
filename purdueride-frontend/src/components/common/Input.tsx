import { forwardRef, useState } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
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
}

const Input = forwardRef<HTMLInputElement, InputProps>(
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
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const uniqueId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
    
    // Base classes that apply to all inputs
    const baseClasses = 'rounded-md border px-4 py-2 transition-colors focus:outline-none focus:ring-2';
    
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
    
    return (
      <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
        {label && (
          <label 
            htmlFor={uniqueId}
            className={`block text-gray-700 font-medium mb-1 ${isFocused ? 'text-purdue-gold' : ''}`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
              {leftIcon}
            </div>
          )}
          
          <input 
            ref={ref} 
            id={uniqueId}
            className={combinedClasses} 
            type={type}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${uniqueId}-error` : helperText ? `${uniqueId}-helper` : undefined}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props} 
          />
          
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