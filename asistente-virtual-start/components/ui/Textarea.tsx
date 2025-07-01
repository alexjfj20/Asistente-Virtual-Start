import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  labelClassName?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, id, error, className = '', labelClassName = '', ...props }) => {
  const baseTextareaClasses = "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed";
  const errorTextareaClasses = error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "";

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className={`block text-sm font-medium text-neutral-dark mb-1 ${labelClassName}`}>
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`${baseTextareaClasses} ${errorTextareaClasses} ${className}`}
        rows={4} // Default rows
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};
