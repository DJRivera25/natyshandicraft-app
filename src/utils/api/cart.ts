import axiosInstance from '@/utils/axios';
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

export const apiRemoveItemFromCart = async (
  productId: string
): Promise<Cart> => {
  const res = await axiosInstance.patch<Cart>('/cart', { productId });
  return res.data;
};
