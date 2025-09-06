import React, { useState, useEffect } from 'react';
import { 
  Filter, 
  ChevronDown, 
  Star,
  MessageSquare,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import ReviewCard from './ReviewCard';
import StarRating from './StarRating';
import { useReviews } from '../../hooks/useReviews';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Review List Component with Filtering and Pagination
 * 
 * Props:
 * - supplierId: ID of the supplier whose reviews to display
 * - onEditReview: Callback when user wants to edit a review
 * - className: Additional CSS classes
 */
const ReviewList = ({ 
  supplierId,
  onEditReview,
  className = '' 
}) => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    sortBy: 'newest',
    ratingFilter: 'all',
    showPhotosOnly: false
  });
  const [showFilters, setShowFilters] = useState(false);
  
  const {
    reviews,
    loading,
    error,
    pagination,
    fetchSupplierReviews,
    loadMoreReviews,
    deleteReview,
    clearError
  } = useReviews();
  
  useEffect(() => {
    if (supplierId) {
      fetchSupplierReviews(supplierId);
    }
  }, [supplierId, fetchSupplierReviews]);
  
  // Calculate rating distribution
  const ratingDistribution = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {});
  
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
    : 0;
  
  // Filter and sort reviews
  const filteredReviews = reviews.filter(review => {
    if (filters.ratingFilter !== 'all' && review.rating !== parseInt(filters.ratingFilter)) {
      return false;
    }
    
    if (filters.showPhotosOnly && (!review.photos || review.photos.length === 0)) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'helpful':
        return (b.likesCount || 0) - (a.likesCount || 0);
      default:
        return 0;
    }
  });
  
  const handleDeleteReview = async (reviewId) => {
    const result = await deleteReview(reviewId);
    if (!result.success) {
      // Error is handled by the hook
      console.error('Failed to delete review');
    }
  };
  
  const handleReportReview = (reviewId) => {
    // TODO: Implement review reporting
    console.log('Report review:', reviewId);
    alert('Thank you for reporting this review. We will review it shortly.');
  };
  
  const handleLikeReview = (reviewId, isLiked) => {
    // TODO: Implement review liking
    console.log('Like review:', reviewId, isLiked);
  };
  
  const handleLoadMore = () => {
    if (pagination.hasMore && !loading) {
      loadMoreReviews(supplierId);
    }
  };
  
  if (loading && reviews.length === 0) {
    return (
      <div className={`bg-white rounded-lg p-8 ${className}`}>
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <span className="ml-3 text-gray-600">Loading reviews...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Review Summary */}
      <div className="bg-white rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {averageRating.toFixed(1)}
            </div>
            <StarRating rating={averageRating} readonly size="lg" className="justify-center mb-2" />
            <p className="text-gray-600">
              Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
            </p>
          </div>
          
          {/* Rating Breakdown */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingDistribution[rating] || 0;
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-8">{rating} ⭐</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Filters and Sorting */}
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              {filteredReviews.length} {filteredReviews.length === 1 ? 'Review' : 'Reviews'}
            </h3>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filter & Sort</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort by
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="highest">Highest rated</option>
                  <option value="lowest">Lowest rated</option>
                  <option value="helpful">Most helpful</option>
                </select>
              </div>
              
              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <select
                  value={filters.ratingFilter}
                  onChange={(e) => setFilters(prev => ({ ...prev, ratingFilter: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">All ratings</option>
                  <option value="5">5 stars</option>
                  <option value="4">4 stars</option>
                  <option value="3">3 stars</option>
                  <option value="2">2 stars</option>
                  <option value="1">1 star</option>
                </select>
              </div>
              
              {/* Photo Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Options
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.showPhotosOnly}
                    onChange={(e) => setFilters(prev => ({ ...prev, showPhotosOnly: e.target.checked }))}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Reviews with photos only
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium">Error loading reviews</p>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={clearError}
            className="text-red-400 hover:text-red-600"
          >
            ×
          </button>
        </div>
      )}
      
      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onEdit={onEditReview}
              onDelete={handleDeleteReview}
              onReport={handleReportReview}
              onLike={handleLikeReview}
            />
          ))
        ) : (
          <div className="bg-white rounded-lg p-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No reviews found
            </h3>
            <p className="text-gray-600 mb-4">
              {totalReviews === 0 
                ? "Be the first to share your experience with this supplier!"
                : "No reviews match your current filters. Try adjusting your criteria."
              }
            </p>
          </div>
        )}
      </div>
      
      {/* Load More Button */}
      {pagination.hasMore && (
        <div className="text-center">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Loading...
              </>
            ) : (
              <>
                Load More Reviews
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}
      
      {/* Pagination Info */}
      {pagination.totalResults > 0 && (
        <div className="text-center text-sm text-gray-500">
          Showing {filteredReviews.length} of {pagination.totalResults} reviews
        </div>
      )}
    </div>
  );
};

export default ReviewList;