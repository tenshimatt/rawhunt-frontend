import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from './App';
import * as api from './services/api';

// Import test data from the mock
import { mockSuppliersData, mockChicagoSearchData, mockEmptySearchData } from './__mocks__/services/api';

describe('Core App Functionality Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset mock implementations
    vi.mocked(api.suppliersAPI.search).mockResolvedValue(mockSuppliersData);
    vi.mocked(api.pawsAPI.getBalance).mockResolvedValue({ 
      success: true, 
      data: { balance: 1250 } 
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial Render and State', () => {
    it('should render the main navigation and landing page', async () => {
      render(<App />);
      
      // Check navigation elements
      expect(screen.getByText('🐾 Rawgle')).toBeInTheDocument();
      expect(screen.getByText('PAWS Balance')).toBeInTheDocument();
      expect(screen.getByText('1,250')).toBeInTheDocument();
      
      // Check hero section
      expect(screen.getByText('Find Premium Raw Dog Food Near You')).toBeInTheDocument();
      expect(screen.getByText(/Discover trusted suppliers/)).toBeInTheDocument();
      
      // Check search form
      expect(screen.getByPlaceholderText('Search for suppliers, brands, or products...')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Location or ZIP')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
    });

    it('should load and display initial suppliers', async () => {
      render(<App />);
      
      // Wait for suppliers to load
      await waitFor(() => {
        expect(screen.getByText(/3 Suppliers Found/)).toBeInTheDocument();
      });

      // Verify suppliers are displayed
      expect(screen.getByText('Chicago Premium Pet Foods')).toBeInTheDocument();
      expect(screen.getByText('Windy City Raw Foods')).toBeInTheDocument();
      expect(screen.getByText('NYC Pet Supplies')).toBeInTheDocument();
      
      // Verify API was called
      expect(api.suppliersAPI.search).toHaveBeenCalled();
    });

    it('should display auth buttons when not authenticated', async () => {
      vi.mocked(api.apiUtils.isAuthenticated).mockReturnValue(false);
      
      render(<App />);
      
      expect(screen.getByText('Sign In')).toBeInTheDocument();
      expect(screen.getByText('Register')).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('should perform search when search button is clicked', async () => {
      const user = userEvent.setup();
      
      render(<App />);
      
      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText(/3 Suppliers Found/)).toBeInTheDocument();
      });

      // Mock search response
      vi.mocked(api.suppliersAPI.search).mockResolvedValueOnce(mockChicagoSearchData);
      
      const searchInput = screen.getByPlaceholderText('Search for suppliers, brands, or products...');
      const searchButton = screen.getByRole('button', { name: 'Search' });
      
      // Perform search
      await user.type(searchInput, 'chicago');
      await user.click(searchButton);
      
      // Verify search was performed
      expect(api.suppliersAPI.search).toHaveBeenCalledWith(
        expect.objectContaining({
          search: 'chicago'
        })
      );
      
      // Wait for results
      await waitFor(() => {
        expect(screen.getByText(/2 Suppliers Found/)).toBeInTheDocument();
      });
    });

    it('should perform search on Enter key press', async () => {
      const user = userEvent.setup();
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText(/3 Suppliers Found/)).toBeInTheDocument();
      });

      vi.mocked(api.suppliersAPI.search).mockResolvedValueOnce(mockChicagoSearchData);
      
      const searchInput = screen.getByPlaceholderText('Search for suppliers, brands, or products...');
      
      await user.type(searchInput, 'chicago{enter}');
      
      expect(api.suppliersAPI.search).toHaveBeenCalledWith(
        expect.objectContaining({
          search: 'chicago'
        })
      );
    });

    it('should handle empty search results', async () => {
      const user = userEvent.setup();
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText(/3 Suppliers Found/)).toBeInTheDocument();
      });

      vi.mocked(api.suppliersAPI.search).mockResolvedValueOnce(mockEmptySearchData);
      
      const searchInput = screen.getByPlaceholderText('Search for suppliers, brands, or products...');
      const searchButton = screen.getByRole('button', { name: 'Search' });
      
      await user.type(searchInput, 'nonexistent');
      await user.click(searchButton);
      
      await waitFor(() => {
        expect(screen.getByText(/0 Suppliers Found/)).toBeInTheDocument();
      });
    });
  });

  describe('Category Filtering', () => {
    it('should display category filter buttons', async () => {
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText(/3 Suppliers Found/)).toBeInTheDocument();
      });

      // Check for category buttons
      expect(screen.getByText('All Categories')).toBeInTheDocument();
      expect(screen.getByText('Raw Beef')).toBeInTheDocument();
      expect(screen.getByText('Raw Chicken')).toBeInTheDocument();
      expect(screen.getByText('Raw Turkey')).toBeInTheDocument();
    });

    it('should filter by category when category button is clicked', async () => {
      const user = userEvent.setup();
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText(/3 Suppliers Found/)).toBeInTheDocument();
      });

      vi.mocked(api.suppliersAPI.search).mockResolvedValueOnce(mockChicagoSearchData);
      
      const beefButton = screen.getByText('Raw Beef');
      await user.click(beefButton);
      
      // Should trigger search with category
      await waitFor(() => {
        expect(api.suppliersAPI.search).toHaveBeenCalledWith(
          expect.objectContaining({
            category: 'Raw Beef'
          })
        );
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      vi.mocked(api.suppliersAPI.search).mockRejectedValueOnce(new Error('API Error'));
      
      render(<App />);
      
      // Should handle error and not crash
      await waitFor(() => {
        expect(screen.getByText(/Error loading suppliers/)).toBeInTheDocument();
      });
    });

    it('should show loading state during search', async () => {
      const user = userEvent.setup();
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText(/3 Suppliers Found/)).toBeInTheDocument();
      });

      // Mock delayed response
      let resolvePromise;
      const searchPromise = new Promise(resolve => {
        resolvePromise = resolve;
      });
      vi.mocked(api.suppliersAPI.search).mockReturnValueOnce(searchPromise);
      
      const searchInput = screen.getByPlaceholderText('Search for suppliers, brands, or products...');
      const searchButton = screen.getByRole('button', { name: 'Search' });
      
      await user.type(searchInput, 'test');
      await user.click(searchButton);
      
      // Should show loading state
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      
      // Resolve the promise
      resolvePromise(mockChicagoSearchData);
      
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
    });
  });

  describe('Component State Management', () => {
    it('should update search query state when typing', async () => {
      const user = userEvent.setup();
      
      render(<App />);
      
      const searchInput = screen.getByPlaceholderText('Search for suppliers, brands, or products...');
      
      await user.type(searchInput, 'test query');
      
      expect(searchInput).toHaveValue('test query');
    });

    it('should update location state when typing', async () => {
      const user = userEvent.setup();
      
      render(<App />);
      
      const locationInput = screen.getByPlaceholderText('Location or ZIP');
      
      await user.type(locationInput, 'Chicago, IL');
      
      expect(locationInput).toHaveValue('Chicago, IL');
    });

    it('should show supplier details when expanded', async () => {
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText('Chicago Premium Pet Foods')).toBeInTheDocument();
      });

      // Check that supplier details are visible
      expect(screen.getByText(/Premium raw dog food supplier/)).toBeInTheDocument();
      expect(screen.getByText(/4.8/)).toBeInTheDocument(); // Rating
    });
  });

  describe('Responsive Design Elements', () => {
    it('should display mobile-friendly navigation', async () => {
      render(<App />);
      
      // Check for responsive classes and mobile elements
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveClass('sticky', 'top-0', 'z-50');
    });

    it('should display properly structured search form', async () => {
      render(<App />);
      
      const searchForm = screen.getByRole('button', { name: 'Search' }).closest('div');
      expect(searchForm).toBeInTheDocument();
      
      // Check form has proper structure
      expect(screen.getByPlaceholderText('Search for suppliers, brands, or products...')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Location or ZIP')).toBeInTheDocument();
    });
  });

  describe('PAWS Integration', () => {
    it('should display PAWS balance', async () => {
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText('PAWS Balance')).toBeInTheDocument();
        expect(screen.getByText('1,250')).toBeInTheDocument();
      });
      
      expect(api.pawsAPI.getBalance).toHaveBeenCalled();
    });

    it('should handle PAWS balance loading error', async () => {
      vi.mocked(api.pawsAPI.getBalance).mockRejectedValueOnce(new Error('PAWS Error'));
      
      render(<App />);
      
      // Should still render without crashing
      await waitFor(() => {
        expect(screen.getByText('PAWS Balance')).toBeInTheDocument();
      });
    });
  });
});