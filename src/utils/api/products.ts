import axios from '@/utils/axios';
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
} from '@/types/product';

export const apiFetchProducts = async (): Promise<Product[]> => {
  const res = await axios.get('/products');
  return res.data; // assuming res.data is already an array of products
};

export const apiFetchProductById = async (id: string): Promise<Product> => {
  const res = await axios.get(`/products/${id}`);
  return res.data; // assuming your API returns just the product object
};

export const apiDeleteProduct = async (
  id: string
): Promise<{ message: string }> => {
  const res = await axios.delete(`/products/${id}`);
  return res.data; // expecting: { message: 'Deleted successfully' }
};

export const apiToggleProductStock = async (
  id: string
): Promise<{ message: string }> => {
  const res = await axios.patch(`/products/${id}/toggle-stock`);
  return res.data; // expecting: { message: 'Stock updated' }
};

export const apiCreateProduct = async (
  productData: CreateProductInput
): Promise<Product> => {
  const res = await axios.post('/products', productData);
  return res.data;
};

export const apiUpdateProduct = async (
  id: string,
  productData: UpdateProductInput
): Promise<Product> => {
  const res = await axios.put(`/products/${id}`, productData);
  return res.data;
};
