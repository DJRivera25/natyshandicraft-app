'use client';

import React, { useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useAppDispatch } from '@/store/hooks';
import { deleteReviewThunk } from '@/features/review/reviewThunk';
import { useToast } from '@/components/Toast';
import {
  Star,
  User,
  Clock,
  Trash2,
  MessageCircle,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Review {
  user: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewListProps {
  reviews: Review[];
  loading: boolean;
  error: string | null;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, loading, error }) => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const { showToast } = useToast();

  const user = session?.user;

  const handleReviewDelete = useCallback(
    async (userId: string) => {
      try {
        await dispatch(deleteReviewThunk(userId, userId));
        showToast('success', 'Review deleted successfully!');
      } catch (error) {
        console.error('Failed to delete review:', error);
        showToast('error', 'Failed to delete review. Please try again.');
      }
    },
    [dispatch, showToast]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
        <span className="ml-3 text-gray-600">Loading reviews...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No reviews yet
        </h3>
        <p className="text-gray-600">Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review, index) => (
        <motion.div
          key={`${review.user}-${index}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    User {review.user.slice(-4)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </div>

            {(user?.id === review.user || user?.isAdmin) && (
              <button
                onClick={() => handleReviewDelete(review.user)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete review"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ReviewList;
