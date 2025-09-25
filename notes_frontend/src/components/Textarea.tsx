import React from 'react';

interface TextareaProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  error?: string;
  rows?: number;
}

// PUBLIC_INTERFACE
export default function Textarea({
  placeholder,
  value,
  onChange,
  disabled = false,
  className = '',
  label,
  error,
  rows = 4,
}: TextareaProps) {
  /**
   * Reusable textarea component with Ocean Professional styling
   */
  const baseClasses = 'w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical';
  const errorClasses = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300';
  const disabledClasses = disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white';

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        rows={rows}
        className={`${baseClasses} ${errorClasses} ${disabledClasses} ${className}`}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
