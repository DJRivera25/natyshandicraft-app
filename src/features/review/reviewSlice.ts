import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Review {
  user: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewState {
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  reviews: [],
  averageRating: 0,
  reviewCount: 0,
  loading: false,
  error: null,
};

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    startLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setReviews(
      state,
      action: PayloadAction<{
        reviews: Review[];
        averageRating: number;
        reviewCount: number;
      }>
    ) {
      state.reviews = action.payload.reviews;
      state.averageRating = action.payload.averageRating;
      state.reviewCount = action.payload.reviewCount;
      state.loading = false;
      state.error = null;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    addReview(state, action: PayloadAction<Review>) {
      state.reviews.unshift(action.payload);
      state.reviewCount += 1;
      // Recalculate average rating
      const total = state.reviews.reduce((sum, r) => sum + r.rating, 0);
      state.averageRating = Math.round((total / state.reviewCount) * 100) / 100;
    },
    removeReview(state, action: PayloadAction<string>) {
      // action.payload = userId
      const idx = state.reviews.findIndex((r) => r.user === action.payload);
      if (idx !== -1) {
        state.reviews.splice(idx, 1);
        state.reviewCount -= 1;
        const total = state.reviews.reduce((sum, r) => sum + r.rating, 0);
        state.averageRating =
          state.reviewCount > 0
            ? Math.round((total / state.reviewCount) * 100) / 100
            : 0;
      }
    },
    clearReviews(state) {
      state.reviews = [];
      state.averageRating = 0;
      state.reviewCount = 0;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  startLoading,
  setReviews,
  setError,
  addReview,
  removeReview,
  clearReviews,
} = reviewSlice.actions;
export default reviewSlice.reducer;
