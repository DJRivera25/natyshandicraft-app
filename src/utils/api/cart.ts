import axiosInstance from '@/lib/axios';
import type { CreateCartInput, UpdateCartInput, Cart } from '@/types/cart';

export const apiFetchCart = async (): Promise<Cart> => {
  const res = await axiosInstance.get('/cart');
  return res.data;
};

export const apiSaveCart = async (
  cart: CreateCartInput | UpdateCartInput
): Promise<Cart> => {
  const res = await axiosInstance.post<Cart>('/cart', cart);
  return res.data;
};
