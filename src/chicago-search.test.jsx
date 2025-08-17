import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from './App';
import * as api from './services/api';

// Import test data from the mock
import { mockSuppliersData, mockChicagoSearchData, mockEmptySearchData } from './__mocks__/services/api';

describe('Chicago Search Filtering Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset mock implementations
    vi.mocked(api.suppliersAPI.search).mockResolvedValue(mockSuppliersData);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Chicago Search Functionality', () => {
    it('should filter suppliers to show only Chicago results when searching "chicago"', async () => {
      const user = userEvent.setup();
      
      render(<App />);
      
      // Wait for initial load - should show all 3 suppliers
      await waitFor(() => {
        expect(screen.getByText(/3 Suppliers Found/)).toBeInTheDocument();
        expect(screen.getByText('Chicago Premium Pet Foods')).toBeInTheDocument();
        expect(screen.getByText('Windy City Raw Foods')).toBeInTheDocument();
        expect(screen.getByText('NYC Pet Supplies')).toBeInTheDocument();
      });

      // Mock Chicago-specific search response for the search action
      vi.mocked(api.suppliersAPI.search).mockResolvedValueOnce(mockChicagoSearchData);
      
      const searchInput = screen.getByPlaceholderText('Search for suppliers, brands, or products...');
      const searchButton = screen.getByRole('button', { name: 'Search' });
      
      // Search for "chicago"
      await user.clear(searchInput);
      await user.type(searchInput, 'chicago');
      await user.click(searchButton);
      
      // Verify API call was made with Chicago search term
      expect(api.suppliersAPI.search).toHaveBeenCalledWith(
        expect.objectContaining({
          search: 'chicago'
        })
      );

      // Wait for filtered results - should only show 2 Chicago suppliers
      await waitFor(() => {
        expect(screen.getByText(/2 Suppliers Found/)).toBeInTheDocument();
        expect(screen.getByText('Chicago Premium Pet Foods')).toBeInTheDocument();
        expect(screen.getByText('Windy City Raw Foods')).toBeInTheDocument();
      });

      // Verify NYC supplier is no longer visible
      expect(screen.queryByText('NYC Pet Supplies')).not.toBeInTheDocument();
      
      // Verify Chicago-specific addresses are shown
      expect(screen.getByText(/123 Michigan Ave, Chicago, IL/)).toBeInTheDocument();
      expect(screen.getByText(/456 State St, Chicago, IL/)).toBeInTheDocument();
    });

    it('should handle case-insensitive Chicago search', async () => {
      const user = userEvent.setup();
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText(/3 Suppliers Found/)).toBeInTheDocument();
      });

      // Mock Chicago search response for uppercase search
      mockAxiosInstance.get.mockResolvedValueOnce({
        data: mockChicagoSearchData
      });
      
      const searchInput = screen.getByPlaceholderText('Search for suppliers, brands, or products...');
      const searchButton = screen.getByRole('button', { name: 'Search' });
      
      // Search for "CHICAGO" in uppercase
      await user.clear(searchInput);
      await user.type(searchInput, 'CHICAGO');
      await user.click(searchButton);
      
      // Verify API call was made
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/suppliers', {
        params: expect.objectContaining({
          search: 'CHICAGO'
        })
      });

      // Should still return Chicago results
      await waitFor(() => {
        expect(screen.getByText(/2 Suppliers Found/)).toBeInTheDocument();
        expect(screen.getByText('Chicago Premium Pet Foods')).toBeInTheDocument();
        expect(screen.getByText('Windy City Raw Foods')).toBeInTheDocument();
      });
    });

    it('should handle partial Chicago searches', async () => {
      const user = userEvent.setup();
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText(/3 Suppliers Found/)).toBeInTheDocument();
      });

      // Mock Chicago search response for partial search
      mockAxiosInstance.get.mockResolvedValueOnce({
        data: mockChicagoSearchData
      });
      
      const searchInput = screen.getByPlaceholderText('Search for suppliers, brands, or products...');
      const searchButton = screen.getByRole('button', { name: 'Search' });
      
      // Search for "chic" (partial match)
      await user.clear(searchInput);
      await user.type(searchInput, 'chic');
      await user.click(searchButton);
      
      // Verify API call was made
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/suppliers', {
        params: expect.objectContaining({
          search: 'chic'
        })
      });

      // Should return Chicago results for partial match
      await waitFor(() => {
        expect(screen.getByText(/2 Suppliers Found/)).toBeInTheDocument();
        expect(screen.getByText('Chicago Premium Pet Foods')).toBeInTheDocument();
        expect(screen.getByText('Windy City Raw Foods')).toBeInTheDocument();
      });
    });

    it('should handle Chicago ZIP code searches', async () => {
      const user = userEvent.setup();
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText(/3 Suppliers Found/)).toBeInTheDocument();
      });

      // Mock search response for Chicago ZIP code
      mockAxiosInstance.get.mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            suppliers: [
              {
                id: 1,
                name: 'Chicago Premium Pet Foods',
                category: 'Pet Food',
                location_latitude: 41.8781,
                location_longitude: -87.6298,
                location_address: '123 Michigan Ave, Chicago, IL 60601',
                rating_average: 4.8,
                rating_count: 156,
                distance: 0.5,
                price_range: 'high',
                description: 'Premium raw dog food supplier in downtown Chicago',
                contact_phone: '+1-312-555-0123',
                website_url: 'https://chicagopremiumpets.com',
                is_verified: true
              }
            ],
            pagination: {
              total: 1,
              page: 1,
              limit: 20
            }
          }
        }
      });
      
      const searchInput = screen.getByPlaceholderText('Search for suppliers, brands, or products...');
      const searchButton = screen.getByRole('button', { name: 'Search' });
      
      // Search for Chicago ZIP code
      await user.clear(searchInput);
      await user.type(searchInput, '60601');
      await user.click(searchButton);
      
      // Verify API call was made
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/suppliers', {
        params: expect.objectContaining({
          search: '60601'
        })
      });

      // Should return relevant Chicago supplier for ZIP code
      await waitFor(() => {
        expect(screen.getByText(/1 Suppliers Found/)).toBeInTheDocument();
        expect(screen.getByText('Chicago Premium Pet Foods')).toBeInTheDocument();
        expect(screen.getByText(/60601/)).toBeInTheDocument();
      });
    });

    it('should clear previous results when performing new Chicago search', async () => {
      const user = userEvent.setup();
      
      render(<App />);
      
      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText(/3 Suppliers Found/)).toBeInTheDocument();
        expect(screen.getByText('NYC Pet Supplies')).toBeInTheDocument();
      });

      // First search for Chicago
      mockAxiosInstance.get.mockResolvedValueOnce({
        data: mockChicagoSearchData
      });
      
      const searchInput = screen.getByPlaceholderText('Search for suppliers, brands, or products...');
      const searchButton = screen.getByRole('button', { name: 'Search' });
      
      await user.clear(searchInput);
      await user.type(searchInput, 'chicago');
      await user.click(searchButton);
      
      // Should show only Chicago results
      await waitFor(() => {
        expect(screen.getByText(/2 Suppliers Found/)).toBeInTheDocument();
        expect(screen.getByText('Chicago Premium Pet Foods')).toBeInTheDocument();
        expect(screen.queryByText('NYC Pet Supplies')).not.toBeInTheDocument();
      });

      // Now search for something else (empty search to get all results back)
      mockAxiosInstance.get.mockResolvedValueOnce({
        data: mockSuppliersData
      });
      
      await user.clear(searchInput);
      await user.click(searchButton);
      
      // Should show all suppliers again
      await waitFor(() => {
        expect(screen.getByText(/3 Suppliers Found/)).toBeInTheDocument();
        expect(screen.getByText('NYC Pet Supplies')).toBeInTheDocument();
      });
    });

    it('should handle no results for invalid Chicago searches', async () => {
      const user = userEvent.setup();
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText(/3 Suppliers Found/)).toBeInTheDocument();
      });

      // Mock empty search response
      mockAxiosInstance.get.mockResolvedValueOnce({
        data: mockEmptySearchData
      });
      
      const searchInput = screen.getByPlaceholderText('Search for suppliers, brands, or products...');
      const searchButton = screen.getByRole('button', { name: 'Search' });
      
      // Search for non-existent Chicago business
      await user.clear(searchInput);
      await user.type(searchInput, 'chicago nonexistent business');
      await user.click(searchButton);
      
      // Verify API call was made
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/suppliers', {
        params: expect.objectContaining({
          search: 'chicago nonexistent business'
        })
      });

      // Should show no results
      await waitFor(() => {
        expect(screen.getByText(/0 Suppliers Found/)).toBeInTheDocument();
      });

      // Verify no supplier cards are visible
      expect(screen.queryByText('Chicago Premium Pet Foods')).not.toBeInTheDocument();
      expect(screen.queryByText('Windy City Raw Foods')).not.toBeInTheDocument();
      expect(screen.queryByText('NYC Pet Supplies')).not.toBeInTheDocument();
    });

    it('should handle Chicago search API errors gracefully', async () => {
      const user = userEvent.setup();
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText(/3 Suppliers Found/)).toBeInTheDocument();
      });

      // Mock API error
      mockAxiosInstance.get.mockRejectedValueOnce(new Error('Search API failed'));
      
      const searchInput = screen.getByPlaceholderText('Search for suppliers, brands, or products...');
      const searchButton = screen.getByRole('button', { name: 'Search' });
      
      await user.clear(searchInput);
      await user.type(searchInput, 'chicago');
      await user.click(searchButton);
      
      // Should handle error gracefully
      await waitFor(() => {
        // Look for error message or fallback state
        expect(
          screen.getByText(/Error loading suppliers|Failed to load|Something went wrong/) ||
          screen.getByText(/0 Suppliers Found/)
        ).toBeInTheDocument();
      });
    });
  });

  describe('Search Result Verification', () => {
    it('should verify Chicago suppliers have correct data structure', async () => {
      const user = userEvent.setup();
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText(/3 Suppliers Found/)).toBeInTheDocument();
      });

      mockAxiosInstance.get.mockResolvedValueOnce({
        data: mockChicagoSearchData
      });
      
      const searchInput = screen.getByPlaceholderText('Search for suppliers, brands, or products...');
      const searchButton = screen.getByRole('button', { name: 'Search' });
      
      await user.clear(searchInput);
      await user.type(searchInput, 'chicago');
      await user.click(searchButton);
      
      await waitFor(() => {
        expect(screen.getByText('Chicago Premium Pet Foods')).toBeInTheDocument();
        expect(screen.getByText('Windy City Raw Foods')).toBeInTheDocument();
      });

      // Verify supplier details are displayed correctly
      expect(screen.getByText(/4\.8/)).toBeInTheDocument(); // Rating for first supplier
      expect(screen.getByText(/4\.6/)).toBeInTheDocument(); // Rating for second supplier
      expect(screen.getByText(/Premium raw dog food supplier/)).toBeInTheDocument();
      expect(screen.getByText(/Chicago-based raw food specialists/)).toBeInTheDocument();
    });
  });
});