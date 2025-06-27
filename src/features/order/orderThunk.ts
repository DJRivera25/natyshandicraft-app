import { AppDispatch } from '@/store/store';
import {
  apiCreateOrder,
  apiFetchOrders,
  apiFetchOrderById,
} from '@/utils/api/order';
import {
  setOrders,
  setSelectedOrder,
  setLoading,
  setError,
} from './orderSlice';
import type { CreateOrderInput, Order } from '@/types/order';

// Fetch all orders
export const fetchOrdersThunk = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const orders: Order[] = await apiFetchOrders();
    dispatch(setOrders(orders));
    dispatch(setError(null));
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : 'Failed to fetch orders'));
  }
  dispatch(setLoading(false));
};

// Fetch single order by ID
export const fetchOrderByIdThunk = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const order: Order = await apiFetchOrderById(id);
    dispatch(setSelectedOrder(order));
    dispatch(setError(null));
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : 'Failed to fetch order'));
  }
  dispatch(setLoading(false));
};

// Create a new order
export const createOrderThunk = (data: CreateOrderInput) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    await apiCreateOrder(data);
    dispatch(setError(null));
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : 'Failed to create order'));
  }
  dispatch(setLoading(false));
};
