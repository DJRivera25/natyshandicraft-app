'use client';

import React, { useState, useCallback } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { postReviewThunk } from '@/features/review/reviewThunk';
import { useToast } from '@/components/Toast';
import { Star, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReviewFormProps {
  productId: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId }) => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!rating || !comment.trim()) return;

      setSubmitting(true);
      try {
        await dispatch(postReviewThunk(productId, rating, comment));
        setRating(0);
        setComment('');
        showToast('success', 'Review submitted successfully!');
      } catch (error) {
        console.error('Failed to submit review:', error);
        showToast('error', 'Failed to submit review. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
    [dispatch, productId, rating, comment, showToast]
  );

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-4 p-6 bg-gradient-to-br from-amber-50 to-white rounded-2xl border border-amber-200"
    >
      <h3 className="text-lg font-semibold text-gray-900">Write a Review</h3>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Rating *
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl transition-colors ${
                  star <= rating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300 hover:text-yellow-300'
                }`}
              >
                <Star className="w-6 h-6" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
            rows={4}
            maxLength={500}
            required
          />
          <div className="text-xs text-gray-500 mt-1">
            {comment.length}/500 characters
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || !rating || !comment.trim()}
          className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-semibold shadow-lg hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <ThumbsUp className="w-4 h-4" />
              Submit Review
            </>
          )}
        </button>
      </div>
    </motion.form>
  );
};

export default ReviewForm;
