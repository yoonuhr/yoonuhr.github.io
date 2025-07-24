import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

export interface ModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean;
  
  /**
   * Function to call when the modal should close
   */
  onClose: () => void;
  
  /**
   * The title of the modal
   */
  title?: string;
  
  /**
   * The content of the modal
   */
  children: ReactNode;
  
  /**
   * The size of the modal
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * Whether to close the modal when clicking outside
   */
  closeOnOutsideClick?: boolean;
  
  /**
   * Whether to close the modal when pressing the escape key
   */
  closeOnEscape?: boolean;
  
  /**
   * Custom footer content
   */
  footer?: ReactNode;
  
  /**
   * Whether to show a close button in the header
   */
  showCloseButton?: boolean;
  
  /**
   * Custom class name for the modal
   */
  className?: string;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOutsideClick = true,
  closeOnEscape = true,
  footer,
  showCloseButton = true,
  className = ''
}: ModalProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  
  // Size-specific classes with responsive adjustments
  const sizeClasses = {
    sm: 'max-w-[95%] sm:max-w-sm',
    md: 'max-w-[95%] sm:max-w-md',
    lg: 'max-w-[95%] sm:max-w-lg',
    xl: 'max-w-[95%] sm:max-w-xl'
  };
  
  // Handle mounting (for SSR compatibility)
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  // Handle escape key press
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, closeOnEscape]);
  
  // Handle focus trap
  useEffect(() => {
    if (!isOpen) return;
    
    // Save the currently focused element
    previousActiveElement.current = document.activeElement as HTMLElement;
    
    // Focus the modal or the first focusable element
    if (modalRef.current) {
      // Find all focusable elements
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      // Focus the first element if it exists, otherwise focus the modal itself
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      } else {
        modalRef.current.focus();
      }
    }
    
    // Create focus trap
    const handleFocusTrap = (event: KeyboardEvent) => {
      if (!modalRef.current || event.key !== 'Tab') return;
      
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      
      // Shift + Tab
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        }
      } 
      // Tab
      else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    };
    
    document.addEventListener('keydown', handleFocusTrap);
    
    // Prevent scrolling on body
    document.body.style.overflow = 'hidden';
    // Add ARIA attributes to indicate modal is open
    document.body.setAttribute('aria-hidden', 'true');
    
    return () => {
      document.removeEventListener('keydown', handleFocusTrap);
      document.body.style.overflow = '';
      document.body.removeAttribute('aria-hidden');
      
      // Restore focus
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen]);
  
  // Handle outside click
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!closeOnOutsideClick) return;
    
    if (event.target === event.currentTarget) {
      onClose();
    }
  };
  
  // Don't render anything on the server or if not open
  if (!isMounted || !isOpen) return null;
  
  // Create portal for the modal
  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby="modal-description"
    >
      <div 
        ref={modalRef}
        className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} ${className}`}
        tabIndex={-1}
        role="document"
        aria-label={title || "Dialog content"}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200">
            {title && (
              <h2 id="modal-title" className="text-lg font-semibold text-gray-900 pr-2">
                {title}
              </h2>
            )}
            
            {showCloseButton && (
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purdue-gold rounded-md p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                onClick={onClose}
                aria-label="Close modal"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
        
        {/* Body */}
        <div className="p-3 sm:p-4" id="modal-description">
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div className="p-3 sm:p-4 border-t border-gray-200">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;