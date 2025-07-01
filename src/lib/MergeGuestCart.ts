'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadCartFromStorage, clearCartStorage } from '@/utils/localStorage';
import { apiFetchCart, apiSaveCart } from '@/utils/api/cart';
import { addToCart, clearCart } from '@/features/cart/cartSlice';
import { useEffect, useRef } from 'react';

export default function MergeGuestCart() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const hasMergedRef = useRef(false); // local memory safeguard

  useEffect(() => {
    console.log(`user:`, user);
    const mergeCart = async () => {
      const mergedKey = `cartMerged-${user?.id}`;
      const isAlreadyMerged = localStorage.getItem(mergedKey) === 'true';
      if (isAlreadyMerged) {
        console.log(`isAlreadyMerged`);
        return;
      }

      try {
        const guestItems = loadCartFromStorage();
        if (guestItems.length === 0) return;

        const serverCart = await apiFetchCart();
        const mergedItemsMap = new Map();

        [...serverCart.items, ...guestItems].forEach((item) => {
          const key = item.productId;
          if (!mergedItemsMap.has(key)) {
            mergedItemsMap.set(key, { ...item });
          } else {
            mergedItemsMap.get(key).quantity += item.quantity;
          }
        });

        const mergedItems = Array.from(mergedItemsMap.values());

        await apiSaveCart({ user: user?.id, items: mergedItems });

        dispatch(clearCart());
        mergedItems.forEach((item) => dispatch(addToCart(item)));

        clearCartStorage();
        localStorage.setItem(mergedKey, 'true');
        hasMergedRef.current = true;

        console.log('✅ Guest cart merged with logged-in cart');
      } catch (err) {
        console.error('❌ Failed to merge guest cart:', err);
      }
    };

    mergeCart();
  }, [user?.id, dispatch]);

  return null;
}
