import { useState, useCallback } from 'react';
import { reviewsAPI, apiUtils } from '../services/api';

export const useReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    hasMore: false,
  });

  // Fetch reviews for a supplier
  const fetchSupplierReviews = useCallback(async (supplierId, page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);

      const response = await reviewsAPI.getBySupplier(supplierId, page, limit);
      
      if (page === 1) {
        setReviews(response.data.reviews);
      } else {
        setReviews(prev => [...prev, ...response.data.reviews]);
      }

      setPagination({
        currentPage: response.data.pagination.currentPage,
        totalPages: response.data.pagination.totalPages,
        totalResults: response.data.pagination.totalResults,
        hasMore: response.data.pagination.hasMore,
      });

      return response.data;
    } catch (error) {
      const errorMessage = apiUtils.handleError(error);
      setError(errorMessage);
      console.error('Failed to fetch supplier reviews:', error);
      return { reviews: [], pagination: {} };
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch user's own reviews
  const fetchUserReviews = useCallback(async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);

      const response = await reviewsAPI.getUserReviews(page, limit);
      
      if (page === 1) {
        setReviews(response.data.reviews);
      } else {
        setReviews(prev => [...prev, ...response.data.reviews]);
      }

      setPagination({
        currentPage: response.data.pagination.currentPage,
        totalPages: response.data.pagination.totalPages,
        totalResults: response.data.pagination.totalResults,
        hasMore: response.data.pagination.hasMore,
      });

      return response.data;
    } catch (error) {
      const errorMessage = apiUtils.handleError(error);
      setError(errorMessage);
      console.error('Failed to fetch user reviews:', error);
      return { reviews: [], pagination: {} };
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new review
  const createReview = useCallback(async (reviewData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await reviewsAPI.create(reviewData);
      
      // Add the new review to the beginning of the list
      setReviews(prev => [response.data.review, ...prev]);

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = apiUtils.handleError(error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing review
  const updateReview = useCallback(async (reviewId, reviewData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await reviewsAPI.update(reviewId, reviewData);
      
      // Update the review in the list
      setReviews(prev => 
        prev.map(review => 
          review.id === reviewId ? response.data.review : review
        )
      );

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = apiUtils.handleError(error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a review
  const deleteReview = useCallback(async (reviewId) => {
    try {
      setLoading(true);
      setError(null);

      await reviewsAPI.delete(reviewId);
      
      // Remove the review from the list
      setReviews(prev => prev.filter(review => review.id !== reviewId));

      return { success: true };
    } catch (error) {
      const errorMessage = apiUtils.handleError(error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Load more reviews (pagination)
  const loadMoreReviews = useCallback(async (supplierId) => {
    if (!pagination.hasMore || loading) return;
    
    if (supplierId) {
      await fetchSupplierReviews(supplierId, pagination.currentPage + 1);
    } else {
      await fetchUserReviews(pagination.currentPage + 1);
    }
  }, [pagination.currentPage, pagination.hasMore, loading, fetchSupplierReviews, fetchUserReviews]);

  const clearError = () => setError(null);

  const clearReviews = () => {
    setReviews([]);
    setPagination({
      currentPage: 1,
      totalPages: 1,
      totalResults: 0,
      hasMore: false,
    });
  };

  return {
    reviews,
    loading,
    error,
    pagination,
    fetchSupplierReviews,
    fetchUserReviews,
    createReview,
    updateReview,
    deleteReview,
    loadMoreReviews,
    clearError,
    clearReviews,
  };
};

// Hook for review form validation and submission
export const useReviewForm = (onSuccess) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { createReview, updateReview } = useReviews();

  const submitReview = useCallback(async (reviewData, reviewId = null) => {
    try {
      setSubmitting(true);
      setError(null);

      let result;
      if (reviewId) {
        result = await updateReview(reviewId, reviewData);
      } else {
        result = await createReview(reviewData);
      }

      if (result.success) {
        onSuccess?.(result.data);
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (error) {
      const errorMessage = apiUtils.handleError(error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSubmitting(false);
    }
  }, [createReview, updateReview, onSuccess]);

  const clearError = () => setError(null);

  return {
    submitting,
    error,
    submitReview,
    clearError,
  };
};