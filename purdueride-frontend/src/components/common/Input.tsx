import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = false, className = '', ...props }, ref) => {
    const baseClasses = 'rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purdue-gold focus:border-purdue-gold';
    const errorClasses = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '';
    const widthClass = fullWidth ? 'w-full' : '';
    
    const combinedClasses = `${baseClasses} ${errorClasses} ${widthClass} ${className}`;
    
    return (
      <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
        {label && (
          <label className="block text-gray-700 font-medium mb-1">
            {label}
          </label>
        )}
        <input ref={ref} className={combinedClasses} {...props} />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;