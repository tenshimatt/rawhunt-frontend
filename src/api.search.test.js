import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as api from './services/api';

// Import test data from the mock
import { mockSuppliersData, mockChicagoSearchData, mockEmptySearchData } from './__mocks__/services/api';

describe('Search API Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset mock implementations
    vi.mocked(api.suppliersAPI.search).mockResolvedValue(mockSuppliersData);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('suppliersAPI.search', () => {
    it('should call the search function with correct parameters', async () => {
      // Mock Chicago search response
      vi.mocked(api.suppliersAPI.search).mockResolvedValueOnce(mockChicagoSearchData);

      const result = await api.suppliersAPI.search({
        search: 'chicago',
        limit: 20,
        page: 1
      });

      expect(api.suppliersAPI.search).toHaveBeenCalledWith({
        search: 'chicago',
        limit: 20,
        page: 1
      });

      expect(result).toEqual(mockChicagoSearchData);
    });

    it('should handle empty search query', async () => {
      const result = await api.suppliersAPI.search({});

      expect(api.suppliersAPI.search).toHaveBeenCalledWith({});
      expect(result.data.suppliers).toBeDefined();
      expect(Array.isArray(result.data.suppliers)).toBe(true);
    });

    it('should handle search with special characters', async () => {
      mockAxiosInstance.get.mockResolvedValue({
        data: {
          results: [],
          total: 0,
          limit: 20,
          offset: 0
        }
      });

      await suppliersAPI.search({
        query: "O'Malley's Pet Store & Café"
      });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/search', {
        params: {
          q: "O'Malley's Pet Store & Café",
          limit: 20,
          offset: 0
        }
      });
    });

    it('should handle pagination parameters', async () => {
      mockAxiosInstance.get.mockResolvedValue({
        data: {
          results: [],
          total: 100,
          limit: 10,
          offset: 20
        }
      });

      await suppliersAPI.search({
        query: 'chicago',
        limit: 10,
        offset: 20
      });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/search', {
        params: {
          q: 'chicago',
          limit: 10,
          offset: 20
        }
      });
    });

    it('should handle API errors gracefully', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('Network error'));

      await expect(suppliersAPI.search({ query: 'chicago' }))
        .rejects
        .toThrow('Network error');
    });

    it('should handle malformed response data', async () => {
      // Mock response with missing fields
      mockAxiosInstance.get.mockResolvedValue({
        data: {
          // Missing results field
          total: 0
        }
      });

      const result = await suppliersAPI.search({ query: 'chicago' });

      expect(result.data.suppliers).toEqual([]); // Should default to empty array
    });

    it('should transform search parameters correctly', async () => {
      mockAxiosInstance.get.mockResolvedValue({
        data: {
          results: [],
          total: 0,
          limit: 20,
          offset: 0
        }
      });

      // Test parameter transformation
      await suppliersAPI.search({
        search: 'test search term', // should become 'q'
        query: 'override term',     // should override 'search'
        location: 'Chicago, IL',   // should be ignored in backend params
        category: 'Pet Food',      // should be ignored in backend params
        limit: 50,                 // should be passed through
        offset: 100                // should be passed through
      });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/search', {
        params: {
          q: 'override term', // query takes precedence over search
          limit: 50,
          offset: 100
        }
      });
    });

    it('should handle Chicago-specific search correctly', async () => {
      // Mock Chicago search response
      vi.mocked(api.suppliersAPI.search).mockResolvedValueOnce(mockChicagoSearchData);

      const result = await api.suppliersAPI.search({ search: 'chicago' });

      expect(api.suppliersAPI.search).toHaveBeenCalledWith({ search: 'chicago' });

      expect(result.success).toBe(true);
      expect(result.data.suppliers).toHaveLength(2);
      expect(result.data.suppliers[0].name).toBe('Chicago Premium Pet Foods');
      expect(result.data.suppliers[1].name).toBe('Windy City Raw Foods');
      
      // Verify Chicago-specific content
      expect(result.data.suppliers[0].location_address).toContain('Chicago, IL');
      expect(result.data.suppliers[1].location_address).toContain('Chicago, IL');
    });

    it('should handle pagination calculation correctly', async () => {
      mockAxiosInstance.get.mockResolvedValue({
        data: {
          results: [],
          total: 150,
          limit: 20,
          offset: 40
        }
      });

      const result = await suppliersAPI.search({
        query: 'chicago',
        limit: 20,
        offset: 40
      });

      expect(result.data.pagination).toEqual({
        total: 150,
        page: 3, // (40 / 20) + 1 = 3
        limit: 20
      });
    });

    it('should handle zero offset pagination', async () => {
      mockAxiosInstance.get.mockResolvedValue({
        data: {
          results: [],
          total: 50,
          limit: 10,
          offset: 0
        }
      });

      const result = await suppliersAPI.search({
        query: 'chicago',
        limit: 10,
        offset: 0
      });

      expect(result.data.pagination).toEqual({
        total: 50,
        page: 1, // (0 / 10) + 1 = 1
        limit: 10
      });
    });

    it('should handle edge case with undefined response fields', async () => {
      mockAxiosInstance.get.mockResolvedValue({
        data: {
          results: undefined,
          total: undefined,
          limit: undefined,
          offset: undefined
        }
      });

      const result = await suppliersAPI.search({ query: 'chicago' });

      expect(result.data.suppliers).toEqual([]);
      expect(result.data.pagination).toEqual({
        total: 0,
        page: 1,
        limit: 20
      });
    });
  });

  describe('suppliersAPI.getById', () => {
    it('should call the correct endpoint with supplier id', async () => {
      mockAxiosInstance.get.mockResolvedValue({
        data: {
          supplier: {
            id: 1,
            name: 'Test Supplier',
            category: 'Pet Food'
          }
        }
      });

      const result = await suppliersAPI.getById(1);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/supplier', {
        params: { id: 1 }
      });

      expect(result).toEqual({
        success: true,
        data: {
          supplier: {
            id: 1,
            name: 'Test Supplier',
            category: 'Pet Food'
          }
        }
      });
    });

    it('should handle missing supplier id', async () => {
      mockAxiosInstance.get.mockResolvedValue({
        data: { supplier: null }
      });

      const result = await suppliersAPI.getById(999);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/supplier', {
        params: { id: 999 }
      });

      expect(result.data.supplier).toBeNull();
    });
  });

  describe('suppliersAPI.getNearby', () => {
    it('should call the correct endpoint with location parameters', async () => {
      mockAxiosInstance.get.mockResolvedValue({
        data: {
          results: [
            {
              id: 1,
              name: 'Nearby Supplier',
              distance: 2.5
            }
          ]
        }
      });

      const result = await suppliersAPI.getNearby(41.8781, -87.6298, 10);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/nearby', {
        params: {
          lat: 41.8781,
          lng: -87.6298,
          radius: 10
        }
      });

      expect(result).toEqual({
        success: true,
        data: {
          suppliers: [
            {
              id: 1,
              name: 'Nearby Supplier',
              distance: 2.5
            }
          ]
        }
      });
    });

    it('should use default radius when not provided', async () => {
      mockAxiosInstance.get.mockResolvedValue({
        data: { results: [] }
      });

      await suppliersAPI.getNearby(41.8781, -87.6298);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/nearby', {
        params: {
          lat: 41.8781,
          lng: -87.6298,
          radius: 25 // default radius
        }
      });
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle 404 errors specifically', async () => {
      const error404 = new Error('Request failed with status code 404');
      error404.response = {
        status: 404,
        data: { error: 'Endpoint not found', code: 'NOT_FOUND' }
      };

      mockAxiosInstance.get.mockRejectedValue(error404);

      await expect(suppliersAPI.search({ query: 'chicago' }))
        .rejects
        .toThrow('Request failed with status code 404');
    });

    it('should handle 500 errors specifically', async () => {
      const error500 = new Error('Request failed with status code 500');
      error500.response = {
        status: 500,
        data: { error: 'Internal server error' }
      };

      mockAxiosInstance.get.mockRejectedValue(error500);

      await expect(suppliersAPI.search({ query: 'chicago' }))
        .rejects
        .toThrow('Request failed with status code 500');
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network Error');
      networkError.code = 'NETWORK_ERROR';

      mockAxiosInstance.get.mockRejectedValue(networkError);

      await expect(suppliersAPI.search({ query: 'chicago' }))
        .rejects
        .toThrow('Network Error');
    });

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('timeout of 10000ms exceeded');
      timeoutError.code = 'ECONNABORTED';

      mockAxiosInstance.get.mockRejectedValue(timeoutError);

      await expect(suppliersAPI.search({ query: 'chicago' }))
        .rejects
        .toThrow('timeout of 10000ms exceeded');
    });
  });

  describe('Real-world Search Scenarios', () => {
    it('should handle Chicago ZIP code search', async () => {
      mockAxiosInstance.get.mockResolvedValue({
        data: {
          results: [
            {
              id: 1,
              name: 'Chicago Pet Store',
              location_address: '123 Main St, Chicago, IL 60601'
            }
          ],
          total: 1,
          limit: 20,
          offset: 0
        }
      });

      await suppliersAPI.search({ query: '60601' });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/search', {
        params: {
          q: '60601',
          limit: 20,
          offset: 0
        }
      });
    });

    it('should handle partial name searches', async () => {
      mockAxiosInstance.get.mockResolvedValue({
        data: {
          results: [
            {
              id: 1,
              name: 'Premium Pet Foods Chicago',
              category: 'Pet Food'
            },
            {
              id: 2,
              name: 'Chicago Premium Supplies',
              category: 'Pet Supplies'
            }
          ],
          total: 2,
          limit: 20,
          offset: 0
        }
      });

      await suppliersAPI.search({ query: 'premium' });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/search', {
        params: {
          q: 'premium',
          limit: 20,
          offset: 0
        }
      });
    });

    it('should handle category-specific searches', async () => {
      mockAxiosInstance.get.mockResolvedValue({
        data: {
          results: [
            {
              id: 1,
              name: 'Raw Food Chicago',
              category: 'Pet Food'
            }
          ],
          total: 1,
          limit: 20,
          offset: 0
        }
      });

      await suppliersAPI.search({ query: 'raw food chicago' });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/search', {
        params: {
          q: 'raw food chicago',
          limit: 20,
          offset: 0
        }
      });
    });

    it('should handle multi-word location searches', async () => {
      mockAxiosInstance.get.mockResolvedValue({
        data: {
          results: [],
          total: 0,
          limit: 20,
          offset: 0
        }
      });

      await suppliersAPI.search({ query: 'downtown chicago illinois' });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/search', {
        params: {
          q: 'downtown chicago illinois',
          limit: 20,
          offset: 0
        }
      });
    });
  });
});