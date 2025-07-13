'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface ReviewSummaryProps {
  averageRating: number;
  reviewCount: number;
}

const ReviewSummary: React.FC<ReviewSummaryProps> = ({
  averageRating,
  reviewCount,
}) => {
  return (
    <div className="flex items-center gap-3 sm:gap-4 mb-1 sm:mb-2">
      <div className="flex items-center gap-1.5 sm:gap-2">
        <span className="text-xl sm:text-2xl font-bold text-amber-700">
          {averageRating.toFixed(1)}
        </span>
        <span className="text-amber-600 text-base sm:text-lg">/ 5</span>
        <div className="flex gap-0.5 ml-1.5 sm:ml-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 sm:w-5 sm:h-5 ${star <= Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
          ))}
        </div>
      </div>
      <div className="text-xs sm:text-sm text-gray-600">
        <span className="font-medium">{reviewCount}</span> review
        {reviewCount === 1 ? '' : 's'}
      </div>
    </div>
  );
};

export default ReviewSummary;
