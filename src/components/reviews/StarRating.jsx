import React, { useState } from 'react';
import { Star } from 'lucide-react';

/**
 * Interactive Star Rating Component
 * 
 * Props:
 * - rating: Current rating value (0-5)
 * - onRatingChange: Callback when rating changes (for interactive mode)
 * - readonly: Whether the rating is read-only (default: false)
 * - size: Size of stars ('sm', 'md', 'lg') (default: 'md')
 * - showValue: Whether to show the numeric value (default: false)
 * - className: Additional CSS classes
 */
const StarRating = ({ 
  rating = 0, 
  onRatingChange, 
  readonly = false, 
  size = 'md', 
  showValue = false,
  className = '' 
}) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  
  const displayRating = readonly ? rating : (hoveredRating || rating);
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };
  
  const starSize = sizeClasses[size] || sizeClasses.md;
  
  const handleStarClick = (starRating) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starRating);
    }
  };
  
  const handleStarHover = (starRating) => {
    if (!readonly) {
      setHoveredRating(starRating);
    }
  };
  
  const handleMouseLeave = () => {
    if (!readonly) {
      setHoveredRating(0);
    }
  };
  
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div 
        className="flex items-center gap-0.5" 
        onMouseLeave={handleMouseLeave}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`transition-colors duration-150 ${
              readonly 
                ? 'cursor-default' 
                : 'cursor-pointer hover:scale-110 transition-transform'
            }`}
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleStarHover(star)}
            disabled={readonly}
          >
            <Star 
              className={`${starSize} transition-colors duration-150 ${
                star <= displayRating 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-gray-300 hover:text-yellow-200'
              }`}
            />
          </button>
        ))}
      </div>
      
      {showValue && (
        <span className="text-sm font-medium text-gray-600 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;