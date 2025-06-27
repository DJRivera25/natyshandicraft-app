import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '@/features/cart/cartSlice';
import authReducer from '@/features/auth/authSlice';
import productReducer from '@/features/product/productSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer, //This creates a store slice called cart.
    auth: authReducer, // This creates a store slice called auth.
    product: productReducer, // This creates a store slice called product.
  },
});

export type RootState = ReturnType<typeof store.getState>; // TypeScript helper types for useSelector
export type AppDispatch = typeof store.dispatch; //  TypeScript helper types for useDispatch
