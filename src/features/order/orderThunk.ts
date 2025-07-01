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
  addOrder,
} from './orderSlice';
import type { CreateOrderInput, Order } from '@/types/order';

// ✅ Fetch all orders
export const fetchOrdersThunk = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const orders: Order[] = await apiFetchOrders();
    dispatch(setOrders(orders));
    dispatch(setError(null));
  } catch (error) {
    dispatch(
      setError(
        error instanceof Error ? error.message : 'Failed to fetch orders'
      )
    );
  } finally {
    dispatch(setLoading(false));
  }
};

// ✅ Fetch a single order by ID
export const fetchOrderByIdThunk =
  (id: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const order: Order = await apiFetchOrderById(id);
      dispatch(setSelectedOrder(order));
      dispatch(setError(null));
    } catch (error) {
      dispatch(
        setError(
          error instanceof Error ? error.message : 'Failed to fetch order'
        )
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

// ✅ Create a new order (with address and add to state)
export const createOrderThunk =
  (data: CreateOrderInput) =>
  async (dispatch: AppDispatch): Promise<Order> => {
    dispatch(setLoading(true));
    try {
      const newOrder: Order = await apiCreateOrder(data);
      dispatch(addOrder(newOrder));
      dispatch(setError(null));
      return newOrder; // ✅ Fix: return the new order
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to create order';
      dispatch(setError(message));
      throw new Error(message); // ✅ Fix: throw for caller
    } finally {
      dispatch(setLoading(false));
    }
  };
