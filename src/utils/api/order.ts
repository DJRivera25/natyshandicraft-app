import axiosInstance from '@/lib/axios';
import type { CreateOrderInput, Order } from '@/types/order';

/**
 * Create a new order.
 */
export const apiCreateOrder = async (
  orderData: CreateOrderInput
): Promise<Order> => {
  const response = await axiosInstance.post('/order', orderData);
  return response.data;
};

/**
 * Fetch all orders (admin) or own orders (user).
 */
export const apiFetchOrders = async (): Promise<Order[]> => {
  const response = await axiosInstance.get('/order');
  return response.data;
};

/**
 * Fetch single order by ID.
 */
export const apiFetchOrderById = async (id: string): Promise<Order> => {
  const response = await axiosInstance.get(`/order/${id}`);
  return response.data;
};
