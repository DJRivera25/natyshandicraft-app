import { AppDispatch } from '@/store/store';
import axios from 'axios';
import { startLoading, setReviews, setError } from './reviewSlice';

export const fetchReviewsThunk =
  (productId: string) => async (dispatch: AppDispatch) => {
    dispatch(startLoading());
    try {
      const res = await axios.get(`/api/products/${productId}/reviews`);
      const { reviews, averageRating, reviewCount } = res.data;
      dispatch(setReviews({ reviews, averageRating, reviewCount }));
    } catch {
      dispatch(setError('Failed to fetch reviews.'));
    }
  };

export const postReviewThunk =
  (productId: string, rating: number, comment: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(startLoading());
    try {
      await axios.post(`/api/products/${productId}/reviews`, {
        rating,
        comment,
      });
      dispatch(fetchReviewsThunk(productId));
    } catch {
      dispatch(setError('Failed to post review.'));
    }
  };

export const deleteReviewThunk =
  (productId: string, userId: string) => async (dispatch: AppDispatch) => {
    dispatch(startLoading());
    try {
      await axios.delete(`/api/products/${productId}/reviews/${userId}`);
      dispatch(fetchReviewsThunk(productId));
    } catch {
      dispatch(setError('Failed to delete review.'));
    }
  };
