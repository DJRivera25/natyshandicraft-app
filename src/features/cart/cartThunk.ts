import { AppDispatch, RootState } from '@/store/store';
import {
  apiFetchCart,
  apiSaveCart,
  apiRemoveItemFromCart,
} from '@/utils/api/cart';
import { addToCart, clearCart, removeFromCart } from './cartSlice';
import type { CreateCartInput, UpdateCartInput, CartItem } from '@/types/cart';

/**
 * Load cart from backend and populate Redux store.
 */
export const fetchCartThunk = () => async (dispatch: AppDispatch) => {
  try {
    const cart = await apiFetchCart();
    dispatch(clearCart());
    cart.items.forEach((item) => dispatch(addToCart(item)));
  } catch (error) {
    console.error('❌ Failed to load cart:', error);
  }
};

/**
 * Save current cart state to backend — assumes user is logged in.
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
 * Add item to cart and sync to backend if logged in.
 */
export const addToCartThunk =
  (item: CartItem) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(addToCart(item));

    const state = getState();
    const user = state.auth.user;

    if (!user?.id) {
      console.log('ℹ️ Guest cart updated (local only)');
      return;
    }

    try {
      await apiSaveCart({ user: user.id, items: state.cart.items });
      console.log('✅ Item added and synced to backend');
    } catch (error) {
      console.error('❌ Failed to add item to cart:', error);
    }
  };

/**
 * Remove item from cart and sync to backend if logged in.
 */
export const removeFromCartThunk =
  (productId: string) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(removeFromCart(productId));

    const user = getState().auth.user;
    if (!user?.id) {
      console.log('ℹ️ Guest item removed (local only)');
      return;
    }

    try {
      await apiRemoveItemFromCart(productId);
      console.log('✅ Item removed and synced to backend');
    } catch (error) {
      console.error('❌ Failed to remove item from cart:', error);
    }
  };
