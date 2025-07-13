import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '@/types/order';

type OrderState = {
  orders: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
};

const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
    },
    updateOrder: (state, action: PayloadAction<Order>) => {
      const index = state.orders.findIndex(
        (order) => order._id === action.payload._id
      );
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
      if (state.selectedOrder?._id === action.payload._id) {
        state.selectedOrder = action.payload;
      }
    },
    setSelectedOrder: (state, action: PayloadAction<Order | null>) => {
      state.selectedOrder = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearOrders: (state) => {
      state.orders = [];
      state.selectedOrder = null;
      state.error = null;
    },
  },
});

export const {
  setOrders,
  addOrder,
  updateOrder,
  setSelectedOrder,
  setLoading,
  setError,
  clearOrders,
} = orderSlice.actions;

export default orderSlice.reducer;
