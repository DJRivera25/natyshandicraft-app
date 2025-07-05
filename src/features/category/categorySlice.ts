import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CategoryState {
  categories: string[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    startLoadingCategories(state) {
      state.loading = true;
      state.error = null;
    },
    setCategories(state, action: PayloadAction<string[]>) {
      state.categories = ['All', ...action.payload];
      state.loading = false;
    },
    setCategoryError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { startLoadingCategories, setCategories, setCategoryError } =
  categorySlice.actions;

export default categorySlice.reducer;
