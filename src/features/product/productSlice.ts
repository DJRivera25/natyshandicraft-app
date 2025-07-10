import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '@/types/product';

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  query: string; // 🔍 shared search term
}

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  total: 0,
  page: 1,
  totalPages: 1,
  loading: false,
  error: null,
  query: '',
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    startLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setProducts(
      state,
      action: PayloadAction<{
        products: Product[];
        total: number;
        page: number;
        totalPages: number;
      }>
    ) {
      state.products = action.payload.products;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.totalPages = action.payload.totalPages;
      state.loading = false;
      state.error = null;
    },
    setSelectedProduct(state, action: PayloadAction<Product>) {
      state.selectedProduct = action.payload;
      state.loading = false;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    addProduct(state, action: PayloadAction<Product>) {
      state.products.unshift(action.payload);
    },
    removeProduct(state, action: PayloadAction<string>) {
      state.products = state.products.filter((p) => p._id !== action.payload);
    },
    // Toggle product active status (was previously inStock)
    toggleProductActive(state, action: PayloadAction<string>) {
      const product = state.products.find((p) => p._id === action.payload);
      if (product) {
        product.isActive = !product.isActive;
      }
    },
    updateProduct(state, action: PayloadAction<Product>) {
      const index = state.products.findIndex(
        (p) => p._id === action.payload._id
      );
      if (index !== -1) state.products[index] = action.payload;
    },
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
  },
});

export const {
  startLoading,
  setProducts,
  setSelectedProduct,
  setError,
  addProduct,
  removeProduct,
  updateProduct,
  toggleProductActive,
  setQuery,
} = productSlice.actions;

export default productSlice.reducer;
