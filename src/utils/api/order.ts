import axiosInstance from '@/utils/axios';
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

/**
 * Cancel an order.
 */
export const apiCancelOrder = async (id: string): Promise<Order> => {
  const response = await axiosInstance.patch(`/order/${id}`, {
    action: 'cancel',
  });
  return response.data.order;
};

/**
 * Fetch all orders for admin with pagination and total count.
 */
export const apiFetchAdminOrders = async (
  params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  } = {}
): Promise<{ orders: Order[]; total: number; page: number; limit: number }> => {
  const response = await axiosInstance.get('/admin/orders', { params });
  return response.data;
};
