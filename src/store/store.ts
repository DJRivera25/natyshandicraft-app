import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import cartReducer from '@/features/cart/cartSlice';
import authReducer from '@/features/auth/authSlice';
import productReducer from '@/features/product/productSlice';
import orderReducer from '@/features/order/orderSlice';
import categoryReducer from '@/features/category/categorySlice'; // ✅ added

const rootReducer = combineReducers({
  cart: cartReducer,
  auth: authReducer,
  product: productReducer,
  order: orderReducer,
  category: categoryReducer, // ✅ added
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart'], // ⬅️ Only persisting cart (you can add more if needed)
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
