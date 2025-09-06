/**
 * Card Component - Rawgul v0.2 Design System
 * 
 * Flexible card component with header and content sections
 */

import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const cardPaddingVariants = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

const Card = forwardRef(({
  children,
  className,
  hover = false,
  padding = 'md',
  ...props
}, ref) => {
  const baseClasses = [
    'bg-white rounded-lg shadow-md border border-gray-200'
  ].join(' ');

  const hoverClasses = hover ? [
    'hover:shadow-lg hover:border-primary-300',
    'transition-all duration-300 cursor-pointer'
  ].join(' ') : '';

  const paddingClasses = cardPaddingVariants[padding];

  return (
    <article
      ref={ref}
      className={cn(
        baseClasses,
        hoverClasses,
        paddingClasses,
        className
      )}
      {...props}
    >
      {children}
    </article>
  );
});

Card.displayName = 'Card';

const CardHeader = forwardRef(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('mb-4 pb-2 border-b border-gray-100', className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardHeader.displayName = 'Card.Header';

const CardContent = forwardRef(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('text-gray-700', className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardContent.displayName = 'Card.Content';

const CardFooter = forwardRef(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('mt-4 pt-2 border-t border-gray-100', className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardFooter.displayName = 'Card.Footer';

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export { Card };