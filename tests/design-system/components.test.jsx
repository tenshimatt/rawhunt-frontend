/**
 * Design System Components Tests
 * Rawgul v0.2 TDD Implementation
 * 
 * Tests for consistent component behavior and styling
 */

import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Import components (these will be created after tests)
import { Button } from '../../src/components/design-system/Button';
import { Card } from '../../src/components/design-system/Card';
import { Input } from '../../src/components/design-system/Input';
import { Badge } from '../../src/components/design-system/Badge';

describe('Design System Components', () => {
  describe('Button Component', () => {
    test('should render with default variant and size', () => {
      render(<Button>Default Button</Button>);
      
      const button = screen.getByRole('button', { name: /default button/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('bg-primary-600'); // Primary color
      expect(button).toHaveClass('text-white');
      expect(button).toHaveClass('px-4', 'py-2'); // Default padding
    });

    test('should render different variants correctly', () => {
      const { rerender } = render(<Button variant="primary">Primary</Button>);
      let button = screen.getByRole('button');
      expect(button).toHaveClass('bg-primary-600');

      rerender(<Button variant="secondary">Secondary</Button>);
      button = screen.getByRole('button');
      expect(button).toHaveClass('bg-warmBrown-400');

      rerender(<Button variant="outline">Outline</Button>);
      button = screen.getByRole('button');
      expect(button).toHaveClass('border-primary-600', 'text-primary-600');

      rerender(<Button variant="ghost">Ghost</Button>);
      button = screen.getByRole('button');
      expect(button).toHaveClass('hover:bg-gray-100');
    });

    test('should render different sizes correctly', () => {
      const { rerender } = render(<Button size="sm">Small</Button>);
      let button = screen.getByRole('button');
      expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');

      rerender(<Button size="md">Medium</Button>);
      button = screen.getByRole('button');
      expect(button).toHaveClass('px-4', 'py-2', 'text-base');

      rerender(<Button size="lg">Large</Button>);
      button = screen.getByRole('button');
      expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
    });

    test('should handle disabled state correctly', () => {
      render(<Button disabled>Disabled Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
    });

    test('should handle loading state correctly', () => {
      render(<Button loading>Loading Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(screen.getByRole('status')).toBeInTheDocument(); // Loading spinner
    });

    test('should handle click events', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(<Button onClick={handleClick}>Click Me</Button>);
      
      await user.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('should support custom className', () => {
      render(<Button className="custom-class">Custom Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });
  });

  describe('Card Component', () => {
    test('should render with default styling', () => {
      render(
        <Card>
          <Card.Header>Card Header</Card.Header>
          <Card.Content>Card Content</Card.Content>
        </Card>
      );

      const card = screen.getByRole('article');
      expect(card).toHaveClass(
        'bg-white',
        'rounded-lg',
        'shadow-md',
        'border',
        'border-gray-200'
      );
      expect(screen.getByText('Card Header')).toBeInTheDocument();
      expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    test('should support hover effects', () => {
      render(<Card hover>Hoverable Card</Card>);
      
      const card = screen.getByRole('article');
      expect(card).toHaveClass(
        'hover:shadow-lg',
        'hover:border-primary-300',
        'transition-all',
        'duration-300'
      );
    });

    test('should support different padding variants', () => {
      const { rerender } = render(<Card padding="sm">Small Padding</Card>);
      let card = screen.getByRole('article');
      expect(card).toHaveClass('p-3');

      rerender(<Card padding="md">Medium Padding</Card>);
      card = screen.getByRole('article');
      expect(card).toHaveClass('p-4');

      rerender(<Card padding="lg">Large Padding</Card>);
      card = screen.getByRole('article');
      expect(card).toHaveClass('p-6');
    });
  });

  describe('Input Component', () => {
    test('should render with default styling', () => {
      render(<Input placeholder="Enter text" />);
      
      const input = screen.getByPlaceholderText('Enter text');
      expect(input).toHaveClass(
        'w-full',
        'px-3',
        'py-2',
        'border',
        'border-gray-300',
        'rounded-lg',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-primary-500'
      );
    });

    test('should handle different states', () => {
      const { rerender } = render(<Input state="default" />);
      let input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-gray-300');

      rerender(<Input state="error" />);
      input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-error-500', 'focus:ring-error-500');

      rerender(<Input state="success" />);
      input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-success-500', 'focus:ring-success-500');
    });

    test('should support different sizes', () => {
      const { rerender } = render(<Input size="sm" />);
      let input = screen.getByRole('textbox');
      expect(input).toHaveClass('px-2', 'py-1', 'text-sm');

      rerender(<Input size="md" />);
      input = screen.getByRole('textbox');
      expect(input).toHaveClass('px-3', 'py-2', 'text-base');

      rerender(<Input size="lg" />);
      input = screen.getByRole('textbox');
      expect(input).toHaveClass('px-4', 'py-3', 'text-lg');
    });

    test('should handle disabled state', () => {
      render(<Input disabled placeholder="Disabled input" />);
      
      const input = screen.getByPlaceholderText('Disabled input');
      expect(input).toBeDisabled();
      expect(input).toHaveClass('bg-gray-50', 'text-gray-500', 'cursor-not-allowed');
    });

    test('should support label and help text', () => {
      render(
        <Input 
          label="Email Address"
          helpText="We'll never share your email"
          placeholder="Enter email"
        />
      );

      expect(screen.getByText('Email Address')).toBeInTheDocument();
      expect(screen.getByText("We'll never share your email")).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
    });

    test('should show error message when in error state', () => {
      render(
        <Input 
          state="error"
          errorMessage="This field is required"
        />
      );

      expect(screen.getByText('This field is required')).toBeInTheDocument();
      expect(screen.getByText('This field is required')).toHaveClass('text-error-600');
    });
  });

  describe('Badge Component', () => {
    test('should render with default variant', () => {
      render(<Badge>Default Badge</Badge>);
      
      const badge = screen.getByText('Default Badge');
      expect(badge).toHaveClass(
        'inline-flex',
        'items-center',
        'px-2.5',
        'py-0.5',
        'rounded-full',
        'text-xs',
        'font-medium',
        'bg-gray-100',
        'text-gray-800'
      );
    });

    test('should support different variants', () => {
      const { rerender } = render(<Badge variant="primary">Primary</Badge>);
      let badge = screen.getByText('Primary');
      expect(badge).toHaveClass('bg-primary-100', 'text-primary-800');

      rerender(<Badge variant="secondary">Secondary</Badge>);
      badge = screen.getByText('Secondary');
      expect(badge).toHaveClass('bg-warmBrown-100', 'text-warmBrown-800');

      rerender(<Badge variant="success">Success</Badge>);
      badge = screen.getByText('Success');
      expect(badge).toHaveClass('bg-success-100', 'text-success-800');

      rerender(<Badge variant="warning">Warning</Badge>);
      badge = screen.getByText('Warning');
      expect(badge).toHaveClass('bg-warning-100', 'text-warning-800');

      rerender(<Badge variant="error">Error</Badge>);
      badge = screen.getByText('Error');
      expect(badge).toHaveClass('bg-error-100', 'text-error-800');
    });

    test('should support different sizes', () => {
      const { rerender } = render(<Badge size="sm">Small</Badge>);
      let badge = screen.getByText('Small');
      expect(badge).toHaveClass('px-2', 'py-0.5', 'text-xs');

      rerender(<Badge size="md">Medium</Badge>);
      badge = screen.getByText('Medium');
      expect(badge).toHaveClass('px-2.5', 'py-0.5', 'text-xs');

      rerender(<Badge size="lg">Large</Badge>);
      badge = screen.getByText('Large');
      expect(badge).toHaveClass('px-3', 'py-1', 'text-sm');
    });

    test('should support dot variant', () => {
      render(<Badge variant="primary" dot>With Dot</Badge>);
      
      const badge = screen.getByText('With Dot');
      expect(badge.querySelector('.dot')).toBeInTheDocument();
    });

    test('should support removable badges', () => {
      const onRemove = vi.fn();
      render(<Badge removable onRemove={onRemove}>Removable</Badge>);
      
      const removeButton = screen.getByRole('button', { name: /remove/i });
      expect(removeButton).toBeInTheDocument();
      
      fireEvent.click(removeButton);
      expect(onRemove).toHaveBeenCalledTimes(1);
    });
  });

  describe('Component Consistency', () => {
    test('should use consistent color scheme across components', () => {
      render(
        <div>
          <Button variant="primary">Button</Button>
          <Badge variant="primary">Badge</Badge>
          <Input state="default" />
        </div>
      );

      // All primary elements should use emerald colors
      const button = screen.getByRole('button');
      const badge = screen.getByText('Badge');
      const input = screen.getByRole('textbox');

      expect(button).toHaveClass('bg-primary-600');
      expect(badge).toHaveClass('bg-primary-100', 'text-primary-800');
      expect(input).toHaveClass('focus:ring-primary-500');
    });

    test('should use consistent border radius', () => {
      render(
        <div>
          <Button>Button</Button>
          <Card>Card</Card>
          <Input />
        </div>
      );

      // All components should use lg border radius (0.5rem / 8px)
      const button = screen.getByRole('button');
      const card = screen.getByRole('article');
      const input = screen.getByRole('textbox');

      expect(button).toHaveClass('rounded-lg');
      expect(card).toHaveClass('rounded-lg');
      expect(input).toHaveClass('rounded-lg');
    });

    test('should use consistent spacing scale', () => {
      render(
        <div>
          <Button size="md">Button</Button>
          <Input size="md" />
        </div>
      );

      // Medium size components should use consistent padding
      const button = screen.getByRole('button');
      const input = screen.getByRole('textbox');

      expect(button).toHaveClass('px-4', 'py-2');
      expect(input).toHaveClass('px-3', 'py-2');
    });

    test('should support consistent focus states', () => {
      render(
        <div>
          <Button>Button</Button>
          <Input />
        </div>
      );

      const button = screen.getByRole('button');
      const input = screen.getByRole('textbox');

      // Both should have focus ring with emerald color
      expect(button).toHaveClass('focus:ring-2', 'focus:ring-primary-500');
      expect(input).toHaveClass('focus:ring-2', 'focus:ring-primary-500');
    });
  });
});