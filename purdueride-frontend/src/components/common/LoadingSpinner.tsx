import type { HTMLAttributes } from 'react';

export interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The size of the spinner
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * The color of the spinner
   */
  color?: 'primary' | 'secondary' | 'white';
  
  /**
   * Whether to center the spinner in its container
   */
  centered?: boolean;
  
  /**
   * Optional text to display below the spinner
   */
  text?: string;
}

const LoadingSpinner = ({
  size = 'md',
  color = 'primary',
  centered = false,
  text,
  className = '',
  ...props
}: LoadingSpinnerProps) => {
  // Size-specific classes
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };
  
  // Color-specific classes
  const colorClasses = {
    primary: 'text-purdue-gold',
    secondary: 'text-gray-800',
    white: 'text-white'
  };
  
  // Centered class
  const centeredClass = centered ? 'flex flex-col items-center justify-center' : '';
  
  // Combine all classes
  const combinedClasses = `${centeredClass} ${className}`;
  
  return (
    <div className={combinedClasses} role="status" aria-live="polite" {...props}>
      <svg 
        className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      
      {text && (
        <span className="mt-2 text-sm font-medium">
          {text}
        </span>
      )}
      
      <span className="sr-only">Loading</span>
    </div>
  );
};

export default LoadingSpinner;