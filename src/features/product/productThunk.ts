// features/product/productThunks.ts
import { AppDispatch } from '@/store/store';
import {
  apiFetchProducts,
  apiFetchProductById,
  apiCreateProduct,
  apiDeleteProduct,
  apiUpdateProduct,
  apiToggleProductStock,
} from '@/utils/api/products';
import {
  startLoading,
  setProducts,
  setSelectedProduct,
  setError,
  addProduct,
  removeProduct,
  updateProduct,
  toggleProductStock,
} from './productSlice';
import type { CreateProductInput, UpdateProductInput } from '@/types/product';

export const fetchProductsThunk = () => async (dispatch: AppDispatch) => {
  dispatch(startLoading());
  try {
    const products = await apiFetchProducts();
    dispatch(setProducts(products));
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

export const toggleStockThunk =
  (id: string) => async (dispatch: AppDispatch) => {
    try {
      await apiToggleProductStock(id); // response is just a message
      dispatch(toggleProductStock(id)); // just dispatch the id
    } catch {
      dispatch(setError('Failed to toggle stock status.'));
    }
  };
