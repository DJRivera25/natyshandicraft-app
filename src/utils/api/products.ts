import axiosInstance from '@/utils/axios';
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
} from '@/types/product';

export const apiFetchProducts = async (
  page: number = 1,
  limit: number = 10
): Promise<{
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  const res = await axiosInstance.get('/products', {
    params: { page, limit },
  });

  return res.data;
};

export const apiFetchProductById = async (id: string): Promise<Product> => {
  const res = await axiosInstance.get(`/products/${id}`);
  return res.data; // assuming your API returns just the product object
};

export const apiDeleteProduct = async (
  id: string
): Promise<{ message: string }> => {
  const res = await axiosInstance.delete(`/products/${id}`);
  return res.data; // expecting: { message: 'Deleted successfully' }
};

export const apiToggleProductStock = async (
  id: string
): Promise<{ message: string }> => {
  const res = await axiosInstance.patch(`/products/${id}/toggle-stock`);
  return res.data; // expecting: { message: 'Stock updated' }
};

export const apiCreateProduct = async (
  productData: CreateProductInput
): Promise<Product> => {
  const res = await axiosInstance.post('/products', productData);
  return res.data;
};

export const apiUpdateProduct = async (
  id: string,
  productData: UpdateProductInput
): Promise<Product> => {
  const res = await axiosInstance.put(`/products/${id}`, productData);
  return res.data;
};

export interface SearchProductsParams {
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
}

export async function apiSearchProducts({
  q = '',
  minPrice = 0,
  maxPrice = 0,
  category = '',
  page = 1,
  limit = 10,
  sortBy = 'newest',
}: SearchProductsParams): Promise<{
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const res = await axiosInstance.get('/products/search', {
    params: {
      q,
      minPrice,
      maxPrice,
      category,
      page,
      limit,
      sortBy,
    },
  });

  return res.data;
}
