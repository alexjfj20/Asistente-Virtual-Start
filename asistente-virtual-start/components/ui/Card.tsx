import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', shadow = 'lg', hoverEffect = false }) => {
  const shadowStyles = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    none: 'shadow-none',
  };

  const hoverStyles = hoverEffect ? 'transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1' : '';

  return (
    <div className={`bg-white rounded-xl overflow-hidden ${shadowStyles[shadow]} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
};
