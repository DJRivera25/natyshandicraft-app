import { AppDispatch, RootState } from '@/store/store';
import { apiFetchCart, apiSaveCart } from '@/utils/api/cart';
import { addToCart, clearCart } from './cartSlice';
import type { CreateCartInput, UpdateCartInput, CartItem } from '@/types/cart';

/**
 * Load cart from backend and populate Redux store.
 */
export const fetchCartThunk = () => async (
  dispatch: AppDispatch,
) => {
  try {
    const cart = await apiFetchCart();
    dispatch(clearCart());
    cart.items.forEach((item) => dispatch(addToCart(item)));
  } catch (error) {
    console.error('❌ Failed to load cart:', error);
  }
};

/**
 * Save current cart state to backend.
 */
export const saveCartThunk =
  (cartInput: CreateCartInput | UpdateCartInput) => async () => {
    try {
      await apiSaveCart(cartInput);
      console.log('✅ Cart synced to backend');
    } catch (error) {
      console.error('❌ Failed to sync cart:', error);
    }
  };

/**
 * Add item to cart and sync to backend.
 */
export const addToCartThunk =
  (item: CartItem) => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch(addToCart(item));

      const updatedCartItems = getState().cart.items;

      await apiSaveCart({ items: updatedCartItems });

      console.log('✅ Item added and synced to backend');
    } catch (error) {
      console.error('❌ Failed to add item to cart:', error);
    }
  };
