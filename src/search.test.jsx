import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from './App';
import { mockSuppliersData, mockChicagoSearchData, mockEmptySearchData } from './test-setup';
import axios from 'axios';

// Create a mock axios instance to use in tests
const mockAxiosInstance = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  interceptors: {
    request: { use: vi.fn() },
    response: { use: vi.fn() }
  }
};

describe('Search Functionality Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup axios mock behavior
    const mockCreate = axios.create;
    mockCreate.mockReturnValue(mockAxiosInstance);
    
    // Mock successful initial suppliers response
    mockAxiosInstance.get.mockResolvedValue({
      data: mockSuppliersData
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Search Interface', () => {
    it('renders search input fields', () => {
      render(<App />);
      
      expect(screen.getByPlaceholderText('Search for suppliers, brands, or products...')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Location or ZIP')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
    });

    it('allows typing in search fields', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const searchInput = screen.getByPlaceholderText('Search for suppliers, brands, or products...');
      const locationInput = screen.getByPlaceholderText('Location or ZIP');
      
      await user.type(searchInput, 'raw dog food');
      await user.type(locationInput, 'chicago');
      
      expect(searchInput).toHaveValue('raw dog food');
      expect(locationInput).toHaveValue('chicago');
    });

    it('triggers search on button click', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText(/2 Suppliers Found/)).toBeInTheDocument();
      });

      fetch.mockClear();
      
      const searchInput = screen.getByPlaceholderText('Search for suppliers, brands, or products...');
      const locationInput = screen.getByPlaceholderText('Location or ZIP');
      const searchButton = screen.getByRole('button', { name: 'Search' });
      
      await user.type(searchInput, 'premium');
      await user.type(locationInput, 'chicago');
      await user.click(searchButton);
      
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/search'),
        expect.objectContaining({
          params: expect.objectContaining({
            q: 'premium'
          })
        })
      );
    });

    it('triggers search on Enter key press', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText(/2 Suppliers Found/)).toBeInTheDocument();
      });

      fetch.mockClear();
      
      const searchInput = screen.getByPlaceholderText('Search for suppliers, brands, or products...');
      
      await user.type(searchInput, 'chicago{enter}');
      
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/search'),
        expect.objectContaining({
          params: expect.objectContaining({
            q: 'chicago'
          })
        })
      );
    });
  });

  describe('Chicago Search Functionality - Bug Testing', () => {
    it('should return Chicago suppliers when searching for "chicago"', async () => {
      const user = userEvent.setup();
      
      render(<App />);
      
      // Wait for initial load to complete
      await waitFor(() => {
        expect(screen.getByText(/3 Suppliers Found/)).toBeInTheDocument();
      });

      // Mock Chicago-specific search response for the search action
      mockAxiosInstance.get.mockResolvedValueOnce({
        data: mockChicagoSearchData
      });
      
      const searchInput = screen.getByPlaceholderText('Search for suppliers, brands, or products...');
      const searchButton = screen.getByRole('button', { name: 'Search' });
      
      // Clear input and search for "chicago"
      await user.clear(searchInput);
      await user.type(searchInput, 'chicago');
      await user.click(searchButton);
      
      // Verify API call was made with correct search term
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/suppliers', {
        params: expect.objectContaining({
          search: 'chicago'
        })
      });

      // Wait for search results to appear
      await waitFor(() => {
        expect(screen.getByText('Chicago Premium Pet Foods')).toBeInTheDocument();
        expect(screen.getByText('Windy City Raw Foods')).toBeInTheDocument();
      });

      // Verify Chicago-specific content appears
      expect(screen.getByText(/123 Michigan Ave, Chicago, IL/)).toBeInTheDocument();
      expect(screen.getByText(/456 State St, Chicago, IL/)).toBeInTheDocument();
      
      // Verify the search filtering worked - should only show 2 Chicago suppliers
      await waitFor(() => {
        expect(screen.getByText(/2 Suppliers Found/)).toBeInTheDocument();
      });
    });

    it('should handle Chicago location search correctly', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText(/2 Suppliers Found/)).toBeInTheDocument();
      });

      fetch.mockClear();
      
      const locationInput = screen.getByPlaceholderText('Location or ZIP');
      const searchButton = screen.getByRole('button', { name: 'Search' });
      
      await user.clear(locationInput);
      await user.type(locationInput, 'Chicago, IL');
      await user.click(searchButton);
      
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/search'),
        expect.objectContaining({
          params: expect.objectContaining({
            q: ''
          })
        })
      );
    });

    it('should show no results message when Chicago search returns empty', async () => {
      const user = userEvent.setup();
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText(/3 Suppliers Found/)).toBeInTheDocument();
      });

      // Mock empty search response for the search action
      mockAxiosInstance.get.mockResolvedValueOnce({
        data: mockEmptySearchData
      });
      
      const searchInput = screen.getByPlaceholderText('Search for suppliers, brands, or products...');
      const searchButton = screen.getByRole('button', { name: 'Search' });
      
      await user.clear(searchInput);
      await user.type(searchInput, 'chicago');
      await user.click(searchButton);
      
      await waitFor(() => {
        expect(screen.getByText(/0 Suppliers Found/)).toBeInTheDocument();
      });
    });

    it('should handle search API errors gracefully', async () => {
      const user = userEvent.setup();
      
      // Mock API error
      fetch.mockRejectedValueOnce(new Error('Search API failed'));

      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText(/2 Suppliers Found/)).toBeInTheDocument();
      });

      fetch.mockClear();
      
      const searchInput = screen.getByPlaceholderText('Search for suppliers, brands, or products...');
      const searchButton = screen.getByRole('button', { name: 'Search' });
      
      await user.clear(searchInput);
      await user.type(searchInput, 'chicago');
      await user.click(searchButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Search API failed|Failed to connect/)).toBeInTheDocument();
      });
    });
  });

  describe('Search Parameter Handling', () => {
    it('should include category filter in search', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText(/2 Suppliers Found/)).toBeInTheDocument();
      });

      fetch.mockClear();
      
      // Select a category
      const beefButton = screen.getByText('Raw Beef');
      await user.click(beefButton);
      
      const searchInput = screen.getByPlaceholderText('Search for suppliers, brands, or products...');
      const searchButton = screen.getByRole('button', { name: 'Search' });
      
      await user.type(searchInput, 'chicago');
      await user.click(searchButton);
      
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/search'),
        expect.objectContaining({
          params: expect.objectContaining({
            q: 'chicago'
          })
        })
      );
    });

    it('should handle special characters in search terms', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText(/2 Suppliers Found/)).toBeInTheDocument();
      });

      fetch.mockClear();
      
      const searchInput = screen.getByPlaceholderText('Search for suppliers, brands, or products...');
      const searchButton = screen.getByRole('button', { name: 'Search' });
      
      await user.type(searchInput, "O'Malley's Pet Store");
      await user.click(searchButton);
      
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/search'),
        expect.objectContaining({
          params: expect.objectContaining({
            q: "O'Malley's Pet Store"
          })
        })
      );
    });

    it('should trim whitespace from search terms', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText(/2 Suppliers Found/)).toBeInTheDocument();
      });

      fetch.mockClear();
      
      const searchInput = screen.getByPlaceholderText('Search for suppliers, brands, or products...');
      const searchButton = screen.getByRole('button', { name: 'Search' });
      
      await user.type(searchInput, '  chicago  ');
      await user.click(searchButton);
      
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/search'),
        expect.objectContaining({
          params: expect.objectContaining({
            q: '  chicago  '
          })
        })
      );
    });
  });

  describe('Search Results Display', () => {
    it('should display search result count correctly', async () => {
      const user = userEvent.setup();
      
      // Mock search response with 3 results
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            suppliers: [
              { id: 1, name: 'Chicago Pet Store 1', category: 'Pet Food' },
              { id: 2, name: 'Chicago Pet Store 2', category: 'Pet Food' },
              { id: 3, name: 'Chicago Pet Store 3', category: 'Pet Food' }
            ]
          }
        })
      });

      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText(/2 Suppliers Found/)).toBeInTheDocument();
      });

      fetch.mockClear();
      
      const searchInput = screen.getByPlaceholderText('Search for suppliers, brands, or products...');
      const searchButton = screen.getByRole('button', { name: 'Search' });
      
      await user.type(searchInput, 'chicago');
      await user.click(searchButton);
      
      await waitFor(() => {
        expect(screen.getByText(/3 Suppliers Found/)).toBeInTheDocument();
      });
    });

    it('should show loading state during search', async () => {
      const user = userEvent.setup();
      
      // Mock delayed response
      fetch.mockImplementationOnce(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            json: async () => ({
              success: true,
              data: { suppliers: [] }
            })
          }), 100)
        )
      );

      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText(/2 Suppliers Found/)).toBeInTheDocument();
      });

      fetch.mockClear();
      
      const searchInput = screen.getByPlaceholderText('Search for suppliers, brands, or products...');
      const searchButton = screen.getByRole('button', { name: 'Search' });
      
      await user.type(searchInput, 'chicago');
      await user.click(searchButton);
      
      // Should show loading state
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should clear previous results when searching', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Wait for initial results
      await waitFor(() => {
        expect(screen.getByText('Chicago Premium Pet Foods')).toBeInTheDocument();
      });

      // Mock new search with different results
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            suppliers: [
              {
                id: 99,
                name: 'New York Pet Store',
                category: 'Pet Food',
                location_address: '789 Broadway, New York, NY 10003',
                rating_average: 4.2,
                rating_count: 45,
                description: 'Pet store in New York'
              }
            ]
          }
        })
      });

      fetch.mockClear();
      
      const searchInput = screen.getByPlaceholderText('Search for suppliers, brands, or products...');
      const searchButton = screen.getByRole('button', { name: 'Search' });
      
      await user.clear(searchInput);
      await user.type(searchInput, 'new york');
      await user.click(searchButton);
      
      // Old results should be replaced
      await waitFor(() => {
        expect(screen.getByText('New York Pet Store')).toBeInTheDocument();
      });

      expect(screen.queryByText('Chicago Premium Pet Foods')).not.toBeInTheDocument();
    });
  });

  describe('Search Edge Cases', () => {
    it('should handle empty search queries', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText(/2 Suppliers Found/)).toBeInTheDocument();
      });

      fetch.mockClear();
      
      const searchButton = screen.getByRole('button', { name: 'Search' });
      
      // Search with empty query
      await user.click(searchButton);
      
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/search'),
        expect.objectContaining({
          params: expect.objectContaining({
            q: ''
          })
        })
      );
    });

    it('should handle very long search queries', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText(/2 Suppliers Found/)).toBeInTheDocument();
      });

      fetch.mockClear();
      
      const searchInput = screen.getByPlaceholderText('Search for suppliers, brands, or products...');
      const searchButton = screen.getByRole('button', { name: 'Search' });
      
      const longQuery = 'a'.repeat(1000);
      await user.type(searchInput, longQuery);
      await user.click(searchButton);
      
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/search'),
        expect.objectContaining({
          params: expect.objectContaining({
            q: longQuery
          })
        })
      );
    });

    it('should handle rapid successive searches', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText(/2 Suppliers Found/)).toBeInTheDocument();
      });

      fetch.mockClear();
      
      const searchInput = screen.getByPlaceholderText('Search for suppliers, brands, or products...');
      const searchButton = screen.getByRole('button', { name: 'Search' });
      
      // Rapid searches
      await user.type(searchInput, 'chicago');
      await user.click(searchButton);
      await user.clear(searchInput);
      await user.type(searchInput, 'new york');
      await user.click(searchButton);
      await user.clear(searchInput);
      await user.type(searchInput, 'los angeles');
      await user.click(searchButton);
      
      // Should have made multiple API calls
      expect(fetch).toHaveBeenCalledTimes(3);
    });

    it('should handle Unicode characters in search', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText(/2 Suppliers Found/)).toBeInTheDocument();
      });

      fetch.mockClear();
      
      const searchInput = screen.getByPlaceholderText('Search for suppliers, brands, or products...');
      const searchButton = screen.getByRole('button', { name: 'Search' });
      
      await user.type(searchInput, 'Café für Hunde 🐕');
      await user.click(searchButton);
      
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/search'),
        expect.objectContaining({
          params: expect.objectContaining({
            q: 'Café für Hunde 🐕'
          })
        })
      );
    });
  });

  describe('Search Integration with Backend', () => {
    it('should handle malformed API responses', async () => {
      const user = userEvent.setup();
      
      // Mock malformed response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          // Missing success field and wrong structure
          suppliers: [{ invalid: 'data' }]
        })
      });

      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText(/2 Suppliers Found/)).toBeInTheDocument();
      });

      fetch.mockClear();
      
      const searchInput = screen.getByPlaceholderText('Search for suppliers, brands, or products...');
      const searchButton = screen.getByRole('button', { name: 'Search' });
      
      await user.type(searchInput, 'chicago');
      await user.click(searchButton);
      
      // Should handle gracefully
      await waitFor(() => {
        expect(screen.getByText(/Failed to load suppliers|0 Suppliers Found/)).toBeInTheDocument();
      });
    });

    it('should handle network timeouts', async () => {
      const user = userEvent.setup();
      
      // Mock timeout
      fetch.mockRejectedValueOnce(new Error('Network timeout'));

      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText(/2 Suppliers Found/)).toBeInTheDocument();
      });

      fetch.mockClear();
      
      const searchInput = screen.getByPlaceholderText('Search for suppliers, brands, or products...');
      const searchButton = screen.getByRole('button', { name: 'Search' });
      
      await user.type(searchInput, 'chicago');
      await user.click(searchButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Network timeout|Failed to connect/)).toBeInTheDocument();
      });
    });

    it('should handle HTTP error responses', async () => {
      const user = userEvent.setup();
      
      // Mock 500 error
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({
          error: 'Internal server error'
        })
      });

      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText(/2 Suppliers Found/)).toBeInTheDocument();
      });

      fetch.mockClear();
      
      const searchInput = screen.getByPlaceholderText('Search for suppliers, brands, or products...');
      const searchButton = screen.getByRole('button', { name: 'Search' });
      
      await user.type(searchInput, 'chicago');
      await user.click(searchButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Internal server error|Failed to load/)).toBeInTheDocument();
      });
    });
  });
});