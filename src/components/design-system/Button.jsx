/**
 * Button Component - Rawgul v0.2 Design System
 * 
 * Consistent button implementation following design tokens
 */

import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const buttonVariants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
  secondary: 'bg-warmBrown-400 text-white hover:bg-warmBrown-600 focus:ring-warmBrown-500',
  outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
  ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  danger: 'bg-error-500 text-white hover:bg-error-600 focus:ring-error-500',
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button = forwardRef(({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  className,
  onClick,
  ...props
}, ref) => {
  const baseClasses = [
    'inline-flex items-center justify-center',
    'font-medium rounded-lg',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'active:transform active:scale-95'
  ].join(' ');

  const variantClasses = buttonVariants[variant];
  const sizeClasses = buttonSizes[size];

  const isDisabled = disabled || loading;

  const handleClick = (event) => {
    if (isDisabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <button
      ref={ref}
      className={cn(
        baseClasses,
        variantClasses,
        sizeClasses,
        className
      )}
      disabled={isDisabled}
      onClick={handleClick}
      {...props}
    >
      {loading && (
        <div
          role="status"
          className="w-4 h-4 mr-2 animate-spin"
          aria-label="Loading"
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';