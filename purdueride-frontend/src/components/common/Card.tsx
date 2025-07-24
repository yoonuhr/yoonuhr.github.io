import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card = ({ title, children, className = '', onClick }: CardProps) => {
  const baseClasses = 'bg-white rounded-lg shadow-md overflow-hidden';
  const clickableClasses = onClick ? 'cursor-pointer hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-purdue-gold focus:ring-offset-2' : '';
  
  const combinedClasses = `${baseClasses} ${clickableClasses} ${className}`;
  
  // Generate a unique ID for the card title and content for accessibility
  const titleId = title ? `card-title-${Math.random().toString(36).substring(2, 9)}` : undefined;
  const contentId = `card-content-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <div 
      className={combinedClasses} 
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
      aria-labelledby={titleId}
      aria-describedby={contentId}
    >
      {title && (
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <h3 id={titleId} className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      )}
      <div id={contentId} className="p-4 sm:p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;