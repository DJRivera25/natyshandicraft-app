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
    <div className="flex items-center gap-4 mb-2">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-amber-700">
          {averageRating.toFixed(1)}
        </span>
        <span className="text-amber-600 text-lg">/ 5</span>
        <div className="flex gap-0.5 ml-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-5 h-5 ${star <= Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
          ))}
        </div>
      </div>
      <div className="text-gray-600">
        <span className="font-medium">{reviewCount}</span> review
        {reviewCount === 1 ? '' : 's'}
      </div>
    </div>
  );
};

export default ReviewSummary;
