/**
 * Input Component - Rawgul v0.2 Design System
 * 
 * Consistent input field with states, sizes, and validation
 */

import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const inputStateVariants = {
  default: 'border-gray-300 focus:ring-primary-500 focus:border-primary-500',
  error: 'border-error-500 focus:ring-error-500 focus:border-error-500',
  success: 'border-success-500 focus:ring-success-500 focus:border-success-500',
};

const inputSizes = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-3 py-2 text-base',
  lg: 'px-4 py-3 text-lg',
};

export const Input = forwardRef(({
  label,
  helpText,
  errorMessage,
  state = 'default',
  size = 'md',
  disabled = false,
  className,
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const baseClasses = [
    'w-full rounded-lg border',
    'focus:outline-none focus:ring-2',
    'transition-colors duration-200',
    'placeholder:text-gray-400'
  ].join(' ');

  const stateClasses = inputStateVariants[state];
  const sizeClasses = inputSizes[size];

  const disabledClasses = disabled ? [
    'bg-gray-50 text-gray-500 cursor-not-allowed',
    'border-gray-200'
  ].join(' ') : 'bg-white';

  return (
    <div className="space-y-1">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      
      <input
        ref={ref}
        id={inputId}
        disabled={disabled}
        className={cn(
          baseClasses,
          stateClasses,
          sizeClasses,
          disabledClasses,
          className
        )}
        {...props}
      />
      
      {helpText && state !== 'error' && (
        <p className="text-sm text-gray-500">
          {helpText}
        </p>
      )}
      
      {state === 'error' && errorMessage && (
        <p className="text-sm text-error-600">
          {errorMessage}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';