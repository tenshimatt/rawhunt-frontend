import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from './App';

// Mock fetch globally
global.fetch = vi.fn();

describe('Rawgle App', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    
    // Mock successful suppliers API response
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          suppliers: [
            {
              id: 1,
              name: 'Pet Grooming Plus',
              category: 'Pet Grooming',
              location_latitude: 40.7128,
              location_longitude: -74.006,
              location_address: '123 Main St, New York, NY 10001',
              rating_average: 4.5,
              rating_count: 127,
              distance: 0.5,
              price_range: 'medium',
              description: 'Professional pet grooming services',
              contact_phone: '+1-555-0123',
              website_url: 'https://petgroomingplus.com',
              is_verified: true
            },
            {
              id: 2,
              name: 'Downtown Veterinary Clinic',
              category: 'Veterinary',
              location_latitude: 40.7589,
              location_longitude: -73.9851,
              location_address: '456 Park Ave, New York, NY 10016',
              rating_average: 4.8,
              rating_count: 203,
              distance: 2.3,
              price_range: 'high',
              description: '24/7 emergency veterinary care',
              contact_phone: '+1-555-0456',
              website_url: 'https://downtownvet.com',
              is_verified: true
            }
          ]
        }
      })
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial Render', () => {
    it('renders the main navigation', async () => {
      render(<App />);
      
      expect(screen.getByText('Rawgle')).toBeInTheDocument();
      expect(screen.getByText('Raw Feeding Community. For the love of our Pets!')).toBeInTheDocument();
      expect(screen.getByText('Sign In')).toBeInTheDocument();
      expect(screen.getByText('Register')).toBeInTheDocument();
    });

    it('shows PAWS balance', () => {
      render(<App />);
      
      expect(screen.getByText('PAWS Balance')).toBeInTheDocument();
      expect(screen.getByText('1,250')).toBeInTheDocument();
    });

    it('displays the hero search section', () => {
      render(<App />);
      
      expect(screen.getByText('Find Premium Raw Dog Food Near You')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search for suppliers, brands, or products...')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Location or ZIP')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
    });

    it('loads suppliers on initial render', async () => {
      render(<App />);
      
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/suppliers?latitude=40.7128&longitude=-74.0060&radius=10')
        );
      });

      await waitFor(() => {
        expect(screen.getByText('2 Suppliers Found')).toBeInTheDocument();
      });
    });
  });

  describe('Navigation Buttons', () => {
    it('opens login modal when Sign In is clicked', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const signInButton = screen.getByText('Sign In');
      await user.click(signInButton);
      
      expect(screen.getByText('Sign In to Rawgle')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('opens register modal when Register is clicked', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const registerButton = screen.getByText('Register');
      await user.click(registerButton);
      
      expect(screen.getByText('Join Rawgle')).toBeInTheDocument();
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Phone')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('closes login modal when Cancel is clicked', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Open login modal
      await user.click(screen.getByText('Sign In'));
      expect(screen.getByText('Sign In to Rawgle')).toBeInTheDocument();
      
      // Close modal
      await user.click(screen.getByText('Cancel'));
      expect(screen.queryByText('Sign In to Rawgle')).not.toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('performs search when Search button is clicked', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Wait for initial load to complete
      await waitFor(() => {
        expect(screen.getByText('2 Suppliers Found')).toBeInTheDocument();
      });

      // Clear the initial fetch call
      fetch.mockClear();
      
      const searchInput = screen.getByPlaceholderText('Search for suppliers, brands, or products...');
      const locationInput = screen.getByPlaceholderText('Location or ZIP');
      const searchButton = screen.getByRole('button', { name: 'Search' });
      
      await user.type(searchInput, 'veterinary');
      await user.type(locationInput, 'New York');
      await user.click(searchButton);
      
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/suppliers?latitude=40.7128&longitude=-74.0060&radius=10')
      );
    });

    it('updates category selection when category button is clicked', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const beefButton = screen.getByText('Raw Beef');
      await user.click(beefButton);
      
      // Check that the button is selected (has different styling)
      expect(beefButton).toHaveClass('bg-white', 'text-emerald-700');
    });
  });

  describe('Supplier Cards', () => {
    it('displays supplier information correctly', async () => {
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText('Pet Grooming Plus')).toBeInTheDocument();
        expect(screen.getByText('Downtown Veterinary Clinic')).toBeInTheDocument();
      });

      // Check supplier details
      expect(screen.getByText('Professional pet grooming services')).toBeInTheDocument();
      expect(screen.getByText('24/7 emergency veterinary care')).toBeInTheDocument();
      expect(screen.getByText('4.5')).toBeInTheDocument();
      expect(screen.getByText('4.8')).toBeInTheDocument();
    });

    it('shows View Details alert when button is clicked', async () => {
      const user = userEvent.setup();
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText('Pet Grooming Plus')).toBeInTheDocument();
      });

      const viewDetailsButtons = screen.getAllByText('View Details');
      await user.click(viewDetailsButtons[0]);
      
      expect(alertSpy).toHaveBeenCalledWith(
        expect.stringContaining('Pet Grooming Plus')
      );
      
      alertSpy.mockRestore();
    });

    it('opens Google Maps when Get Directions is clicked', async () => {
      const user = userEvent.setup();
      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => {});
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText('Pet Grooming Plus')).toBeInTheDocument();
      });

      const directionsButtons = screen.getAllByText('Get Directions');
      await user.click(directionsButtons[0]);
      
      expect(openSpy).toHaveBeenCalledWith(
        expect.stringContaining('https://maps.google.com'),
        '_blank'
      );
      
      openSpy.mockRestore();
    });
  });

  describe('Login Form', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<App />);
      await user.click(screen.getByText('Sign In'));
    });

    it('handles login form submission', async () => {
      const user = userEvent.setup();
      
      // Mock successful login response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          token: 'mock-token',
          user: { id: 1, name: 'Test User', email: 'test@example.com' }
        })
      });

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: 'Sign In' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/login'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123'
          })
        })
      );
    });

    it('shows error message on login failure', async () => {
      const user = userEvent.setup();
      
      // Mock failed login response
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          message: 'Invalid credentials'
        })
      });

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: 'Sign In' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      });
    });

    it('shows loading state during login', async () => {
      const user = userEvent.setup();
      
      // Mock delayed response
      fetch.mockImplementationOnce(() => new Promise(resolve => {
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({ token: 'mock-token', user: {} })
        }), 100);
      }));

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: 'Sign In' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      expect(screen.getByText('Signing in...')).toBeInTheDocument();
    });
  });

  describe('Register Form', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<App />);
      await user.click(screen.getByText('Register'));
    });

    it('handles register form submission', async () => {
      const user = userEvent.setup();
      
      // Mock successful registration response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          token: 'mock-token',
          user: { id: 1, name: 'New User', email: 'new@example.com' }
        })
      });

      const nameInput = screen.getByLabelText('Name');
      const emailInput = screen.getByLabelText('Email');
      const phoneInput = screen.getByLabelText('Phone');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: 'Create Account' });

      await user.type(nameInput, 'New User');
      await user.type(emailInput, 'new@example.com');
      await user.type(phoneInput, '+1-555-0123');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/register'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'New User',
            email: 'new@example.com',
            phone: '+1-555-0123',
            password: 'password123'
          })
        })
      );
    });
  });

  describe('Error Handling', () => {
    it('displays error message when API call fails', async () => {
      // Mock network error
      fetch.mockRejectedValueOnce(new Error('Network error'));
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText('Failed to connect to server. Please try again.')).toBeInTheDocument();
      });
    });

    it('displays error when API returns error response', async () => {
      // Mock API error response
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ success: false, message: 'Server error' })
      });
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText('Failed to load suppliers')).toBeInTheDocument();
      });
    });
  });

  describe('PAWS Rewards', () => {
    it('opens register modal when Start Earning PAWS is clicked', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const pawsButton = screen.getByText('Start Earning PAWS');
      await user.click(pawsButton);
      
      expect(screen.getByText('Join Rawgle')).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('shows loading spinner during initial data fetch', () => {
      // Mock pending promise
      fetch.mockImplementationOnce(() => new Promise(() => {}));
      
      render(<App />);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('shows no results message when no suppliers found', async () => {
      // Mock empty results
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { suppliers: [] }
        })
      });
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText('No suppliers found. Try adjusting your search criteria.')).toBeInTheDocument();
      });
    });
  });
});