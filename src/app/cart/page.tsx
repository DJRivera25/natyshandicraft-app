'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  incrementQuantity,
  decrementQuantity,
} from '@/features/cart/cartSlice';
import {
  fetchCartThunk,
  removeFromCartThunk,
  saveCartThunk,
} from '@/features/cart/cartThunk';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useHasMounted } from '@/utils/useHasMounted';
import Image from 'next/image';

export default function CartPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const hasMounted = useHasMounted();

  const { items } = useAppSelector((state) => state.cart);
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.id;

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCartThunk());
    }
  }, [dispatch, userId]);

  useEffect(() => {
    const animateSteps = () => {
      setTimeout(() => setProgress(0), 1000);
    };
    animateSteps();
  }, []);

  // 🚨 Early return to prevent hydration issues
  if (!hasMounted || !Array.isArray(items)) return null;

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (!userId) return;
    dispatch(saveCartThunk({ user: userId, items }));
    router.push('/order');
  };

  if (items.length === 0) {
    return (
      <div className="p-10 text-center text-gray-500 text-lg">
        Your cart is empty.
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="relative w-full h-6">
          <div className="absolute top-1/2 left-0 w-full h-2 bg-gray-200 rounded-full -translate-y-1/2" />
          <div
            className="absolute top-1/2 left-0 h-2 bg-amber-500 transition-all duration-700 ease-in-out rounded-full -translate-y-1/2"
            style={{ width: `${progress}%` }}
          />
          {[0, 50, 100].map((left, index) => (
            <div
              key={index}
              className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center border-2 shadow-sm
                absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-colors duration-700
                ${progress >= left ? 'bg-amber-600 border-amber-600 text-white' : 'bg-white border-gray-400 text-gray-400'}`}
              style={{ left: `${left}%` }}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-amber-900">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10">
        {/* Cart Items */}
        <div className="space-y-5">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center gap-5 rounded-xl border border-amber-200 bg-white px-4 py-4 shadow-sm hover:shadow-md transition"
            >
              <Image
                src={item.image}
                alt={item.name}
                width={80}
                height={80}
                className="h-20 w-20 rounded object-cover border"
              />

              <div className="flex flex-col justify-between w-full h-full">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-base font-medium text-amber-900 truncate w-40">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    ₱{item.price.toFixed(2)}{' '}
                    <span className="text-xs text-gray-400">each</span>
                  </p>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        dispatch(decrementQuantity(item.productId))
                      }
                      className="rounded bg-gray-100 p-1 hover:bg-gray-200"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center font-semibold text-amber-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        dispatch(incrementQuantity(item.productId))
                      }
                      className="rounded bg-gray-100 p-1 hover:bg-gray-200"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <span className="text-sm font-medium text-amber-700">
                    Subtotal: ₱{(item.price * item.quantity).toFixed(2)}
                  </span>

                  <button
                    onClick={() =>
                      dispatch(removeFromCartThunk(item.productId))
                    }
                    className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <aside className="sticky top-24 self-start h-fit bg-amber-100 p-6 rounded-xl shadow-md border border-amber-200">
          <h2 className="text-xl font-bold text-amber-900 mb-4">
            Order Summary
          </h2>

          <div className="space-y-3 text-gray-800 text-sm">
            <div className="flex justify-between">
              <span>Total Items</span>
              <span className="font-medium">
                {items.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2 font-semibold text-amber-800">
              <span>Total Price</span>
              <span>₱{totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="mt-6 w-full rounded-lg bg-amber-700 px-4 py-2 text-white font-semibold hover:bg-amber-800 transition"
          >
            Proceed to Checkout
          </button>

          <button
            onClick={() => router.push('/products')}
            className="mt-4 w-full rounded-md border border-amber-400 text-amber-600 py-1.5 text-sm hover:bg-amber-50 transition"
          >
            ← Back to Shop
          </button>
        </aside>
      </div>
    </main>
  );
}
