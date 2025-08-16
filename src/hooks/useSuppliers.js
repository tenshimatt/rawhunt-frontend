import { useState, useEffect, useCallback } from 'react';
import { suppliersAPI, apiUtils } from '../services/api';

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    hasMore: false,
  });

  // Fetch suppliers with search parameters
  const searchSuppliers = useCallback(async (params = {}, page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const searchOptions = {
        ...params,
        page,
        limit: 12, // Items per page
      };

      const response = await suppliersAPI.search(searchOptions);
      
      if (page === 1) {
        setSuppliers(response.data.suppliers);
      } else {
        setSuppliers(prev => [...prev, ...response.data.suppliers]);
      }

      setPagination({
        currentPage: response.data.pagination.currentPage,
        totalPages: response.data.pagination.totalPages,
        totalResults: response.data.pagination.totalResults,
        hasMore: response.data.pagination.hasMore,
      });

      setSearchParams(params);
      
      return response.data;
    } catch (error) {
      const errorMessage = apiUtils.handleError(error);
      setError(errorMessage);
      console.error('Failed to search suppliers:', error);
      return { suppliers: [], pagination: {} };
    } finally {
      setLoading(false);
    }
  }, []);

  // Load more suppliers (pagination)
  const loadMore = useCallback(async () => {
    if (!pagination.hasMore || loading) return;
    
    await searchSuppliers(searchParams, pagination.currentPage + 1);
  }, [searchParams, pagination.currentPage, pagination.hasMore, loading, searchSuppliers]);

  // Fetch nearby suppliers using geolocation
  const findNearbySuppliers = useCallback(async (latitude, longitude, radius = 25) => {
    try {
      setLoading(true);
      setError(null);

      const response = await suppliersAPI.getNearby(latitude, longitude, radius);
      setSuppliers(response.data.suppliers);
      
      return response.data;
    } catch (error) {
      const errorMessage = apiUtils.handleError(error);
      setError(errorMessage);
      console.error('Failed to find nearby suppliers:', error);
      return { suppliers: [] };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get current user's location and find nearby suppliers
  const useCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const result = await findNearbySuppliers(latitude, longitude);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          setError('Unable to get your location');
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }, [findNearbySuppliers]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await suppliersAPI.getCategories();
      setCategories(response.data.categories);
      return response.data.categories;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return [];
    }
  }, []);

  // Filter suppliers by category
  const filterByCategory = useCallback((categoryId) => {
    const newParams = categoryId === 'all' 
      ? { ...searchParams, category: undefined }
      : { ...searchParams, category: categoryId };
    
    searchSuppliers(newParams, 1);
  }, [searchParams, searchSuppliers]);

  // Sort suppliers
  const sortSuppliers = useCallback((sortBy) => {
    const newParams = { ...searchParams, sort: sortBy };
    searchSuppliers(newParams, 1);
  }, [searchParams, searchSuppliers]);

  // Clear search and reset
  const clearSearch = useCallback(() => {
    setSuppliers([]);
    setSearchParams({});
    setPagination({
      currentPage: 1,
      totalPages: 1,
      totalResults: 0,
      hasMore: false,
    });
    setError(null);
  }, []);

  const clearError = () => setError(null);

  return {
    suppliers,
    categories,
    loading,
    error,
    searchParams,
    pagination,
    searchSuppliers,
    loadMore,
    findNearbySuppliers,
    useCurrentLocation,
    fetchCategories,
    filterByCategory,
    sortSuppliers,
    clearSearch,
    clearError,
  };
};

export const useSupplierDetails = (supplierId) => {
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSupplier = useCallback(async (id) => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await suppliersAPI.getById(id);
      setSupplier(response.data.supplier);
      
      return response.data.supplier;
    } catch (error) {
      const errorMessage = apiUtils.handleError(error);
      setError(errorMessage);
      console.error('Failed to fetch supplier details:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSupplier(supplierId);
  }, [supplierId, fetchSupplier]);

  const clearError = () => setError(null);

  return {
    supplier,
    loading,
    error,
    fetchSupplier,
    clearError,
  };
};