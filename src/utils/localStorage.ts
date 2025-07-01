import { CartItem } from '@/types/cart';

// utils/localStorage.ts
const CART_KEY = 'guestCart';

export const loadCartFromStorage = () => {
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error('🛑 Failed to load cart from localStorage:', err);
    return [];
  }
};

export const saveCartToStorage = (items: CartItem[]) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('🛑 Failed to save cart to localStorage:', err);
  }
};

export const clearCartStorage = () => {
  try {
    localStorage.removeItem(CART_KEY);
  } catch (err) {
    console.error('🛑 Failed to clear cart from localStorage:', err);
  }
};
