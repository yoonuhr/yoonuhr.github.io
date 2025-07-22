import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card = ({ title, children, className = '', onClick }: CardProps) => {
  const baseClasses = 'bg-white rounded-lg shadow-md overflow-hidden';
  const clickableClasses = onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : '';
  
  const combinedClasses = `${baseClasses} ${clickableClasses} ${className}`;
  
  return (
    <div className={combinedClasses} onClick={onClick}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;