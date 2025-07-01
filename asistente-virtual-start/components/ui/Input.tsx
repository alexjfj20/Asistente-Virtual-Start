import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  labelClassName?: string;
  leftIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, id, error, className = '', labelClassName = '', leftIcon, ...props }) => {
  const baseInputClasses = "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed";
  const errorInputClasses = error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "";
  const withLeftIconClasses = leftIcon ? "pl-10" : "";

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className={`block text-sm font-medium text-neutral-dark mb-1 ${labelClassName}`}>
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          id={id}
          className={`${baseInputClasses} ${errorInputClasses} ${withLeftIconClasses} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};