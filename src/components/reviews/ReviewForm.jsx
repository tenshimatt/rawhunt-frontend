import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';
import StarRating from './StarRating';
import PhotoUpload from './PhotoUpload';
import { useReviewForm } from '../../hooks/useReviews';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Review Submission Form Component
 * 
 * Props:
 * - supplierId: ID of the supplier being reviewed (required)
 * - existingReview: Existing review data for editing (optional)
 * - onClose: Callback when form is closed
 * - onSuccess: Callback when review is successfully submitted
 */
const ReviewForm = ({ 
  supplierId, 
  existingReview = null,
  onClose,
  onSuccess 
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    rating: existingReview?.rating || 0,
    title: existingReview?.title || '',
    comment: existingReview?.comment || '',
    photos: existingReview?.photos || [],
    anonymous: existingReview?.anonymous || false,
    wouldRecommend: existingReview?.wouldRecommend ?? true
  });
  
  const [validationErrors, setValidationErrors] = useState({});
  
  const { submitting, error, submitReview, clearError } = useReviewForm((result) => {
    // Handle successful submission
    onSuccess?.(result.review);
    onClose?.();
  });
  
  const validateForm = () => {
    const errors = {};
    
    if (formData.rating === 0) {
      errors.rating = 'Please select a star rating';
    }
    
    if (!formData.title.trim()) {
      errors.title = 'Please provide a review title';
    } else if (formData.title.length < 5) {
      errors.title = 'Title should be at least 5 characters';
    } else if (formData.title.length > 100) {
      errors.title = 'Title should be less than 100 characters';
    }
    
    if (!formData.comment.trim()) {
      errors.comment = 'Please write your review';
    } else if (formData.comment.length < 10) {
      errors.comment = 'Review should be at least 10 characters';
    } else if (formData.comment.length > 1000) {
      errors.comment = 'Review should be less than 1000 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    clearError();
    
    const reviewData = {
      supplierId,
      rating: formData.rating,
      title: formData.title.trim(),
      comment: formData.comment.trim(),
      photos: formData.photos,
      anonymous: formData.anonymous,
      wouldRecommend: formData.wouldRecommend
    };
    
    await submitReview(reviewData, existingReview?.id);
  };
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  const isEditing = !!existingReview;
  
  if (!user) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Sign In Required</h3>
            <p className="text-gray-600 mb-4">
              You need to be signed in to write a review.
            </p>
            <button
              onClick={onClose}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? 'Edit Review' : 'Write a Review'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Error submitting review</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
          
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Overall Rating *
            </label>
            <StarRating
              rating={formData.rating}
              onRatingChange={(rating) => handleInputChange('rating', rating)}
              size="lg"
            />
            {validationErrors.rating && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.rating}</p>
            )}
          </div>
          
          {/* Review Title */}
          <div>
            <label htmlFor="review-title" className="block text-sm font-medium text-gray-700 mb-2">
              Review Title *
            </label>
            <input
              id="review-title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Summarize your experience in a few words"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                validationErrors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              maxLength={100}
            />
            <div className="mt-1 flex justify-between items-center">
              {validationErrors.title && (
                <p className="text-sm text-red-600">{validationErrors.title}</p>
              )}
              <p className="text-xs text-gray-500 ml-auto">
                {formData.title.length}/100
              </p>
            </div>
          </div>
          
          {/* Review Comment */}
          <div>
            <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-2">
              Your Review *
            </label>
            <textarea
              id="review-comment"
              value={formData.comment}
              onChange={(e) => handleInputChange('comment', e.target.value)}
              placeholder="Tell others about your experience with this supplier. Was the food quality good? How was the service? Would you order again?"
              rows={5}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none ${
                validationErrors.comment ? 'border-red-300' : 'border-gray-300'
              }`}
              maxLength={1000}
            />
            <div className="mt-1 flex justify-between items-center">
              {validationErrors.comment && (
                <p className="text-sm text-red-600">{validationErrors.comment}</p>
              )}
              <p className="text-xs text-gray-500 ml-auto">
                {formData.comment.length}/1000
              </p>
            </div>
          </div>
          
          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Photos (Optional)
            </label>
            <PhotoUpload
              photos={formData.photos}
              onPhotosChange={(photos) => handleInputChange('photos', photos)}
              maxPhotos={5}
            />
          </div>
          
          {/* Recommendation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Would you recommend this supplier?
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="recommend"
                  checked={formData.wouldRecommend === true}
                  onChange={() => handleInputChange('wouldRecommend', true)}
                  className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                />
                <span className="ml-2 text-sm text-gray-700">Yes, I recommend</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="recommend"
                  checked={formData.wouldRecommend === false}
                  onChange={() => handleInputChange('wouldRecommend', false)}
                  className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                />
                <span className="ml-2 text-sm text-gray-700">No, I don't recommend</span>
              </label>
            </div>
          </div>
          
          {/* Anonymous Option */}
          <div className="flex items-center">
            <input
              id="anonymous"
              type="checkbox"
              checked={formData.anonymous}
              onChange={(e) => handleInputChange('anonymous', e.target.checked)}
              className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
            <label htmlFor="anonymous" className="ml-2 text-sm text-gray-700">
              Post this review anonymously
            </label>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isEditing ? 'Updating...' : 'Publishing...'}
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  {isEditing ? 'Update Review' : 'Publish Review'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;