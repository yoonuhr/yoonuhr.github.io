import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The visual style of the button
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  
  /**
   * The size of the button
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Whether the button should take up the full width of its container
   */
  fullWidth?: boolean;
  
  /**
   * Whether the button is in a loading state
   */
  isLoading?: boolean;
  
  /**
   * Icon to display before the button text
   */
  leftIcon?: ReactNode;
  
  /**
   * Icon to display after the button text
   */
  rightIcon?: ReactNode;
  
  /**
   * The content of the button
   */
  children: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  type = 'button',
  ...props
}, ref) => {
  // Base classes that apply to all buttons
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purdue-gold';
  
  // Variant-specific classes
  const variantClasses = {
    primary: 'bg-purdue-gold hover:bg-yellow-600 text-white shadow-sm',
    secondary: 'bg-gray-800 hover:bg-gray-700 text-white shadow-sm',
    outline: 'border border-purdue-gold text-purdue-gold hover:bg-purdue-gold/10 hover:text-purdue-gold',
    text: 'text-purdue-gold hover:text-yellow-600 hover:underline'
  };
  
  // Size-specific classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5'
  };
  
  // Width class
  const widthClass = fullWidth ? 'w-full' : '';
  
  // Disabled state classes
  const disabledClasses = disabled || isLoading ? 
    'opacity-60 cursor-not-allowed pointer-events-none' : '';
  
  // Progressive enhancement for focus-visible
  const focusVisibleClasses = 'supports-[selector(:focus-visible)]:focus:ring-0';
  
  // Combine all classes
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClasses} ${focusVisibleClasses} ${className}`;
  
  return (
    <button
      ref={ref}
      type={type}
      className={combinedClasses}
      disabled={disabled || isLoading}
      aria-disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="inline-block animate-spin mr-2">
          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
      )}
      
      {!isLoading && leftIcon && <span className="inline-flex">{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="inline-flex">{rightIcon}</span>}
    </button>
  );
});

// Display name for better debugging
Button.displayName = 'Button';

export default Button;