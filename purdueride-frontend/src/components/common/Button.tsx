import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode, ElementType } from 'react';

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

  /**
   * Render as a different element (e.g., 'a', Link from react-router-dom)
   */
  as?: ElementType;

  /**
   * Additional props to pass to the component when using 'as'
   */
  [key: string]: any;
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
  as: Component = 'button',
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

  // Size-specific classes - ensuring 44px minimum touch target for all sizes
  const sizeClasses = {
    sm: 'px-4 py-2.5 text-sm gap-1.5 min-h-[44px] min-w-[44px]', // ~44px height and width
    md: 'px-5 py-3 text-base gap-2 min-h-[48px] min-w-[48px]', // ~48px height and width
    lg: 'px-6 py-4 text-lg gap-2.5 min-h-[52px] min-w-[52px]' // ~52px height and width
  };

  // Width class
  const widthClass = fullWidth ? 'w-full' : '';

  // Disabled state classes
  const disabledClasses = disabled || isLoading ?
    'opacity-60 cursor-not-allowed pointer-events-none' : '';

  // Progressive enhancement for focus-visible
  const focusVisibleClasses = 'supports-[selector(:focus-visible)]:focus:ring-0';

  // Combine all classes
  const combinedClasses = `${baseClasses} ${variantClasses[variant as keyof typeof variantClasses]} ${sizeClasses[size as keyof typeof sizeClasses]} ${widthClass} ${disabledClasses} ${focusVisibleClasses} ${className}`;

  // Common props for all button types
  const buttonProps = {
    className: combinedClasses,
    ref,
    'aria-busy': isLoading ? 'true' : undefined,
    'aria-disabled': disabled || isLoading ? 'true' : undefined,
    ...props
  };

  // Button-specific props
  const buttonSpecificProps = Component === 'button' ? {
    type,
    disabled: disabled || isLoading,
  } : {};

  // Content to render inside the button
  const content = (
    <>
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
    </>
  );

  return <Component {...buttonProps} {...buttonSpecificProps}>{content}</Component>;
});

// Display name for better debugging
Button.displayName = 'Button';

export default Button;