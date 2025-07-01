import React, { useEffect, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'; // Added '2xl'
}

const XMarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 10); 
      return () => {
        clearTimeout(timer);
        // setShowContent(false); // Keep true during closing animation if desired
      };
    } else {
      setShowContent(false); 
    }
  }, [isOpen]);

  // CSS will handle the exit animation based on isOpen and showContent (or just isOpen)
  // We keep rendering the modal structure while isOpen is true, or during the very brief moment
  // showContent might still be true after isOpen turned false (if exit animation depends on showContent).
  // However, simpler is just relying on isOpen for the outermost conditional rendering.
  if (!isOpen && !showContent) return null; // Initial state or fully closed and animation finished.
                                          // Or, simply: if (!isOpen) return null; and manage animation with classes on isOpen.


  let sizeClasses = '';
  switch (size) {
    case 'sm': sizeClasses = 'max-w-sm'; break;
    case 'md': sizeClasses = 'max-w-md'; break;
    case 'lg': sizeClasses = 'max-w-lg'; break;
    case 'xl': sizeClasses = 'max-w-xl'; break;
    case '2xl': sizeClasses = 'max-w-2xl'; break; // Added 2xl
    case 'full': sizeClasses = 'max-w-3xl md:max-w-4xl lg:max-w-5xl'; break; 
    default: sizeClasses = 'max-w-md';
  }

  return (
    <div 
      className={`
        fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-[100]
        transition-opacity duration-300 ease-in-out
        ${isOpen && showContent ? 'opacity-100' : 'opacity-0 pointer-events-none'} 
      `}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      // aria-hidden={!isOpen} // Managed by opacity and pointer-events
    >
      <div 
        className={`
          bg-white rounded-lg shadow-xl p-6 md:p-8 w-full ${sizeClasses}
          transform transition-all duration-300 ease-in-out max-h-[90vh] flex flex-col
          ${isOpen && showContent ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex justify-between items-center mb-4">
          {title && <h2 id="modal-title" className="text-2xl font-semibold text-neutral-dark">{title}</h2>}
          <button 
            onClick={onClose} 
            className="text-neutral-default hover:text-neutral-dark focus:outline-none"
            aria-label="Cerrar modal"
          >
            <XMarkIcon className="h-7 w-7" />
          </button>
        </div>
        <div className="overflow-y-auto flex-grow">
          {children}
        </div>
      </div>
    </div>
  );
};
