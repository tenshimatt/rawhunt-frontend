/**
 * Badge Component - Rawgul v0.2 Design System
 * 
 * Small status indicators and labels with various styles
 */

import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const badgeVariants = {
  default: 'bg-gray-100 text-gray-800',
  primary: 'bg-primary-100 text-primary-800',
  secondary: 'bg-warmBrown-100 text-warmBrown-800',
  success: 'bg-success-100 text-success-800',
  warning: 'bg-warning-100 text-warning-800',
  error: 'bg-error-100 text-error-800',
};

const badgeSizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm',
};

export const Badge = forwardRef(({
  variant = 'default',
  size = 'md',
  dot = false,
  removable = false,
  onRemove,
  children,
  className,
  ...props
}, ref) => {
  const baseClasses = [
    'inline-flex items-center',
    'rounded-full font-medium'
  ].join(' ');

  const variantClasses = badgeVariants[variant];
  const sizeClasses = badgeSizes[size];

  return (
    <span
      ref={ref}
      className={cn(
        baseClasses,
        variantClasses,
        sizeClasses,
        className
      )}
      {...props}
    >
      {dot && (
        <span className="dot w-1.5 h-1.5 bg-current rounded-full mr-1.5" />
      )}
      
      {children}
      
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1.5 inline-flex items-center justify-center w-3 h-3 text-current hover:bg-black/10 rounded-full transition-colors"
          aria-label="Remove badge"
        >
          <svg
            className="w-2.5 h-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  );
});

Badge.displayName = 'Badge';