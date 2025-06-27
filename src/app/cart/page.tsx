'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
} from '@/features/cart/cartSlice';
import {
  fetchCartThunk,
  saveCartThunk,
} from '@/features/cart/cartThunk';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CartPage() {
  const { items } = useAppSelector((state) => state.cart);
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.id;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    console.log(`items`, items)
    setHasMounted(true);
    dispatch(fetchCartThunk());
  }, [dispatch]);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (!userId) return;
    dispatch(saveCartThunk({ user: userId, items }));
    router.push('/order');
  };

  if (!hasMounted) return null;

  if (items.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">Your cart is empty.</div>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Your Cart</h1>
      <div className="space-y-6">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex flex-col items-start gap-4 rounded border p-4 md:flex-row md:items-center md:justify-between"
          >
            {/* Product Image and Name */}
            <div className="flex items-center gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="h-20 w-20 rounded object-cover"
              />
              <div>
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p className="text-gray-600">₱{item.price.toFixed(2)}</p>
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => dispatch(decrementQuantity(item.productId))}
                className="rounded bg-gray-300 px-3 py-1 hover:bg-gray-400"
              >
                -
              </button>
              <span className="min-w-[2rem] text-center">{item.quantity}</span>
              <button
                onClick={() => dispatch(incrementQuantity(item.productId))}
                className="rounded bg-gray-300 px-3 py-1 hover:bg-gray-400"
              >
                +
              </button>
            </div>

            {/* Subtotal */}
            <p className="text-lg font-medium">
              Subtotal: ₱{(item.price * item.quantity).toFixed(2)}
            </p>

            {/* Remove Button */}
            <button
              onClick={() => dispatch(removeFromCart(item.productId))}
              className="rounded bg-red-500 px-4 py-1 text-white hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Total & Checkout */}
      <div className="mt-8 flex flex-col items-end gap-4">
        <p className="text-xl font-semibold">Total: ₱{totalPrice.toFixed(2)}</p>
        <button
          onClick={handleCheckout}
          className="rounded bg-violet-600 px-6 py-2 text-white hover:bg-violet-700"
        >
          Proceed to Checkout
        </button>
      </div>
    </main>
  );
}
