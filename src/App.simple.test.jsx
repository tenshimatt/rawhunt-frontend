import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from './App';

// Mock fetch globally
global.fetch = vi.fn();

describe('Rawgle App - Core Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock successful API response
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
              rating_average: 4.5,
              rating_count: 127,
              price_range: 'medium',
              description: 'Professional pet grooming services',
              contact_phone: '+1-555-0123',
              website_url: 'https://petgroomingplus.com',
              is_verified: true,
              location_address: '123 Main St, New York, NY 10001'
            }
          ]
        }
      })
    });
  });

  it('renders the navigation and main content', async () => {
    render(<App />);
    
    // Check navigation
    expect(screen.getByText('Rawgle')).toBeInTheDocument();
    expect(screen.getByText('Raw Feeding Community. For the love of our Pets!')).toBeInTheDocument();
    
    // Check PAWS balance
    expect(screen.getByText('PAWS Balance')).toBeInTheDocument();
    expect(screen.getByText('1,250')).toBeInTheDocument();
    
    // Check hero section
    expect(screen.getByText('Find Premium Raw Dog Food Near You')).toBeInTheDocument();
  });

  it('shows navigation buttons', () => {
    render(<App />);
    
    const signInButtons = screen.getAllByText('Sign In');
    const registerButtons = screen.getAllByText('Register');
    
    expect(signInButtons.length).toBeGreaterThan(0);
    expect(registerButtons.length).toBeGreaterThan(0);
  });

  it('loads and displays suppliers', async () => {
    render(<App />);
    
    // Wait for API call
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });

    // Check supplier is displayed
    await waitFor(() => {
      expect(screen.getByText('1 Suppliers Found')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Pet Grooming Plus')).toBeInTheDocument();
    expect(screen.getByText('Professional pet grooming services')).toBeInTheDocument();
  });

  it('opens login modal when navigation Sign In is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Find the navigation Sign In button (not in a modal)
    const navSignInButton = screen.getAllByText('Sign In')[0];
    await user.click(navSignInButton);
    
    // Check modal opens
    expect(screen.getByText('Sign In to Rawgle')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('opens register modal when Register is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const registerButton = screen.getAllByText('Register')[0];
    await user.click(registerButton);
    
    expect(screen.getByText('Join Rawgle')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('can close modals with Cancel button', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Open login modal
    const signInButton = screen.getAllByText('Sign In')[0];
    await user.click(signInButton);
    
    expect(screen.getByText('Sign In to Rawgle')).toBeInTheDocument();
    
    // Close modal
    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);
    
    expect(screen.queryByText('Sign In to Rawgle')).not.toBeInTheDocument();
  });

  it('performs search when search button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('1 Suppliers Found')).toBeInTheDocument();
    });

    // Clear the mock to track new calls
    fetch.mockClear();
    
    // Perform search
    const searchButton = screen.getByRole('button', { name: 'Search' });
    await user.click(searchButton);
    
    // Verify API call was made
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/suppliers')
    );
  });

  it('shows supplier actions work', async () => {
    const user = userEvent.setup();
    
    // Mock window.alert and window.open
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const openMock = vi.spyOn(window, 'open').mockImplementation(() => {});
    
    render(<App />);
    
    // Wait for supplier to load
    await waitFor(() => {
      expect(screen.getByText('Pet Grooming Plus')).toBeInTheDocument();
    });

    // Test View Details button
    const viewDetailsButton = screen.getByText('View Details');
    await user.click(viewDetailsButton);
    
    expect(alertMock).toHaveBeenCalledWith(
      expect.stringContaining('Pet Grooming Plus')
    );

    // Test Get Directions button
    const directionsButton = screen.getByText('Get Directions');
    await user.click(directionsButton);
    
    expect(openMock).toHaveBeenCalledWith(
      expect.stringContaining('https://maps.google.com'),
      '_blank'
    );
    
    alertMock.mockRestore();
    openMock.mockRestore();
  });

  it('handles API errors gracefully', async () => {
    // Mock API error
    fetch.mockRejectedValueOnce(new Error('Network error'));
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to connect to server. Please try again.')).toBeInTheDocument();
    });
  });

  it('shows loading state', () => {
    // Mock pending promise
    fetch.mockImplementationOnce(() => new Promise(() => {}));
    
    render(<App />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('category filter buttons work', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const beefButton = screen.getByText('Raw Beef');
    await user.click(beefButton);
    
    // Check button state changed
    expect(beefButton).toHaveClass('bg-white', 'text-emerald-700');
  });

  it('PAWS rewards banner works', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const pawsButton = screen.getByText('Start Earning PAWS');
    await user.click(pawsButton);
    
    expect(screen.getByText('Join Rawgle')).toBeInTheDocument();
  });
});