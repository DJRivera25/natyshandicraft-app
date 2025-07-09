// features/product/productThunks.ts
import { AppDispatch } from '@/store/store';
import {
  apiFetchProducts,
  apiFetchProductById,
  apiCreateProduct,
  apiDeleteProduct,
  apiUpdateProduct,
  apiToggleProductActive,
  apiSearchProducts,
} from '@/utils/api/products';
import {
  startLoading,
  setProducts,
  setSelectedProduct,
  setError,
  addProduct,
  removeProduct,
  updateProduct,
  toggleProductActive,
  setQuery,
} from './productSlice';
import type { CreateProductInput, UpdateProductInput } from '@/types/product';
import type { SearchProductsParams } from '@/utils/api/products';

export const fetchProductsThunk =
  (page: number = 1, limit: number = 10) =>
  async (dispatch: AppDispatch) => {
    dispatch(startLoading());
    try {
      const {
        products,
        total,
        page: currentPage,
        totalPages,
      } = await apiFetchProducts(page, limit);
      dispatch(setProducts({ products, total, page: currentPage, totalPages }));
    } catch {
      dispatch(setError('Failed to fetch products.'));
    }
  };

export const fetchProductByIdThunk =
  (id: string) => async (dispatch: AppDispatch) => {
    dispatch(startLoading());
    try {
      const product = await apiFetchProductById(id);
      dispatch(setSelectedProduct(product));
    } catch {
      dispatch(setError('Failed to load product details.'));
    }
  };

export const createProductThunk =
  (data: CreateProductInput) => async (dispatch: AppDispatch) => {
    try {
      const product = await apiCreateProduct(data);
      dispatch(addProduct(product));
    } catch {
      dispatch(setError('Failed to create product.'));
    }
  };

export const deleteProductThunk =
  (id: string) => async (dispatch: AppDispatch) => {
    try {
      await apiDeleteProduct(id);
      dispatch(removeProduct(id));
    } catch {
      dispatch(setError('Failed to delete product.'));
    }
  };

export const updateProductThunk =
  (id: string, data: UpdateProductInput) => async (dispatch: AppDispatch) => {
    try {
      const updated = await apiUpdateProduct(id, data);
      dispatch(updateProduct(updated));
    } catch {
      dispatch(setError('Failed to update product.'));
    }
  };

// Toggle product active status (was previously stock)
export const toggleActiveThunk =
  (id: string) => async (dispatch: AppDispatch) => {
    try {
      await apiToggleProductActive(id);
      dispatch(toggleProductActive(id));
    } catch {
      dispatch(setError('Failed to toggle active status.'));
    }
  };

export const searchProductsThunk =
  (params: SearchProductsParams) => async (dispatch: AppDispatch) => {
    dispatch(startLoading());
    try {
      const {
        products,
        total,
        page: currentPage,
        totalPages,
      } = await apiSearchProducts(params);

      dispatch(setProducts({ products, total, page: currentPage, totalPages }));

      if (typeof params.q === 'string') {
        dispatch(setQuery(params.q)); // ✅ store q in Redux if present
      }
    } catch {
      dispatch(setError('Failed to search products.'));
    }
  };
