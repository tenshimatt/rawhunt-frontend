import React, { useState } from 'react';
import { 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Flag, 
  ThumbsUp, 
  MessageCircle,
  Calendar,
  CheckCircle,
  X
} from 'lucide-react';
import StarRating from './StarRating';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Individual Review Card Component
 * 
 * Props:
 * - review: Review object with all review data
 * - onEdit: Callback when user wants to edit their review
 * - onDelete: Callback when user wants to delete their review
 * - onReport: Callback when user reports a review
 * - onLike: Callback when user likes/unlikes a review
 * - className: Additional CSS classes
 */
const ReviewCard = ({ 
  review,
  onEdit,
  onDelete,
  onReport,
  onLike,
  className = '' 
}) => {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPhotos, setShowPhotos] = useState(false);
  
  const isOwnReview = user?.id === review.userId;
  const reviewDate = new Date(review.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const handleEdit = () => {
    onEdit?.(review);
    setShowMenu(false);
  };
  
  const handleDelete = () => {
    onDelete?.(review.id);
    setShowDeleteConfirm(false);
    setShowMenu(false);
  };
  
  const handleReport = () => {
    onReport?.(review.id);
    setShowMenu(false);
  };
  
  const handleLike = () => {
    onLike?.(review.id, !review.userLiked);
  };
  
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          {/* Reviewer Avatar */}
          <div className="flex-shrink-0">
            {review.anonymous ? (
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500 text-lg">👤</span>
              </div>
            ) : (
              <img
                src={review.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userName || 'Anonymous')}&background=10b981&color=fff&size=48`}
                alt={review.userName || 'Anonymous'}
                className="w-12 h-12 rounded-full"
              />
            )}
          </div>
          
          <div className="flex-1">
            {/* Reviewer Name and Date */}
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-gray-900">
                {review.anonymous ? 'Anonymous' : (review.userName || 'Anonymous')}
              </h4>
              {review.isVerifiedPurchase && (
                <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  Verified Purchase
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {reviewDate}
              </div>
              {review.orderDate && (
                <span>• Ordered {new Date(review.orderDate).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        </div>
        
        {/* Action Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[160px]">
              {isOwnReview ? (
                <>
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Review
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Review
                  </button>
                </>
              ) : (
                <button
                  onClick={handleReport}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Flag className="w-4 h-4" />
                  Report Review
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Rating and Title */}
      <div className="mb-3">
        <div className="flex items-center gap-3 mb-2">
          <StarRating rating={review.rating} readonly size="sm" />
          {review.wouldRecommend !== undefined && (
            <span className={`text-sm font-medium ${
              review.wouldRecommend ? 'text-green-600' : 'text-red-600'
            }`}>
              {review.wouldRecommend ? '👍 Recommends' : '👎 Doesn\'t recommend'}
            </span>
          )}
        </div>
        <h5 className="text-lg font-semibold text-gray-900">{review.title}</h5>
      </div>
      
      {/* Review Content */}
      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {review.comment}
        </p>
      </div>
      
      {/* Photos */}
      {review.photos && review.photos.length > 0 && (
        <div className="mb-4">
          <div className="flex gap-2 overflow-x-auto">
            {review.photos.slice(0, 4).map((photo, index) => (
              <button
                key={index}
                onClick={() => setShowPhotos(true)}
                className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
              >
                <img
                  src={photo.url || photo}
                  alt={`Review photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
            {review.photos.length > 4 && (
              <button
                onClick={() => setShowPhotos(true)}
                className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <span className="text-sm font-medium">+{review.photos.length - 4}</span>
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Actions */}
      <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            review.userLiked 
              ? 'text-emerald-600 hover:text-emerald-700' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <ThumbsUp className={`w-4 h-4 ${review.userLiked ? 'fill-current' : ''}`} />
          <span>{review.likesCount || 0} {review.likesCount === 1 ? 'like' : 'likes'}</span>
        </button>
        
        {/* Reply Button */}
        <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
          <MessageCircle className="w-4 h-4" />
          <span>{review.repliesCount || 0} {review.repliesCount === 1 ? 'reply' : 'replies'}</span>
        </button>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Delete Review</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete your review? This will permanently remove it from the supplier's page.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition-colors"
              >
                Delete Review
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Photo Viewer Modal */}
      {showPhotos && review.photos && review.photos.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="max-w-4xl w-full">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowPhotos(false)}
                className="text-white hover:text-gray-300 p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {review.photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo.url || photo}
                  alt={`Review photo ${index + 1}`}
                  className="w-full h-auto rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;