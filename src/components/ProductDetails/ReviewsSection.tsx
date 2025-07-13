'use client';

import React from 'react';
import { MessageCircle, Star } from 'lucide-react';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

interface Review {
  user: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewsSectionProps {
  productId: string;
  averageRating: number;
  reviewCount: number;
  reviews: Review[];
  reviewsLoading: boolean;
  reviewsError: string | null;
  canReview: boolean;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  productId,
  averageRating,
  reviewCount,
  reviews,
  reviewsLoading,
  reviewsError,
  canReview,
}) => {
  return (
    <section className="w-full bg-white border-t border-amber-100 p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
      <div className="space-y-3 sm:space-y-4">
        {/* Reviews Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
          <div className="space-y-1.5 sm:space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
              Customer Reviews
            </h2>

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-2xl sm:text-3xl font-bold text-amber-700">
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="text-amber-600 text-base sm:text-lg">
                    / 5
                  </span>
                </div>
                <div className="flex gap-0.5 ml-1.5 sm:ml-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        star <= Math.round(averageRating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="text-xs sm:text-sm text-gray-600">
                <span className="font-medium">{reviewCount}</span> review
                {reviewCount === 1 ? '' : 's'}
              </div>
            </div>
          </div>

          {/* Review Form */}
          {canReview && <ReviewForm productId={productId} />}
        </div>

        {/* Reviews List */}
        <ReviewList
          reviews={reviews}
          loading={reviewsLoading}
          error={reviewsError}
        />
      </div>
    </section>
  );
};

export default ReviewsSection;
