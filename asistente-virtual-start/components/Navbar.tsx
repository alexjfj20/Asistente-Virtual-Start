
import React, { useState } from 'react';
import { NavLink, User } from '../types'; 

interface NavbarProps {
  appName: string;
  navLinks: NavLink[];
  currentUser: User | null; 
  onAuthClick: () => void; 
  onLogoutClick: () => void; 
  onGoHome: () => void; // New prop for navigating to home view
}

const Bars3Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const XMarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const Navbar: React.FC<NavbarProps> = ({ appName, navLinks, currentUser, onAuthClick, onLogoutClick, onGoHome }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = (link: NavLink) => {
    setIsOpen(false);
    if (link.action) {
      link.action();
    } else if (link.href) {
      // Fallback for simple href, though actions should handle SPA navigation
      const element = document.querySelector(link.href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
         // This might be for external links or if action is not defined correctly
         window.location.hash = link.href; 
      }
    }
  };
  
  const filteredNavLinks = navLinks.filter(link => {
    if (link.requiresAuth && !currentUser) return false;
    if (link.hideWhenAuth && currentUser) return false;
    return true;
  });

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button
            onClick={(e) => { e.preventDefault(); onGoHome(); }}
            className="text-2xl font-bold text-primary hover:text-primary-dark transition-colors"
            aria-label={`Ir a la página de inicio de ${appName}`}
          >
            {appName}
          </button>
          <div className="hidden md:flex space-x-1 items-center">
            {filteredNavLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link)}
                className="text-neutral-default hover:text-primary font-medium transition-colors px-3 py-2 rounded-md text-sm"
              >
                {link.label}
              </button>
            ))}
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-neutral-default hover:text-primary focus:outline-none"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <XMarkIcon className="h-7 w-7" /> : <Bars3Icon className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg absolute w-full">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {filteredNavLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link)}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-neutral-default hover:text-primary hover:bg-neutral-light transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
