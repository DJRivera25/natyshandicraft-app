'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { clearCart } from '@/features/cart/cartSlice';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createOrderThunk } from '@/features/order/orderThunk';
import type { CreateOrderInput } from '@/types/order';

export default function CheckoutPage() {
  const { items } = useAppSelector((state) => state.cart);
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (!user) {
      return setError('Please log in to place your order.');
    }

    const orderData: CreateOrderInput = {
      user: user.id,
      items: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      totalAmount,
      paymentMethod,
      status: 'pending',
    };

    setLoading(true);
    setError('');

    try {
      await dispatch(createOrderThunk(orderData));
      dispatch(clearCart());
      router.push('/order/success');
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) {
    return <div className="p-8 text-center text-gray-500">Your cart is empty.</div>;
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Checkout</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex justify-between items-center border-b pb-2"
          >
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p className="font-medium">
              ₱{(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}

        <div className="flex justify-between font-semibold text-xl mt-6">
          <span>Total:</span>
          <span>₱{totalAmount.toFixed(2)}</span>
        </div>

        <div className="mt-6">
          <label className="block mb-2 font-medium">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="border px-4 py-2 rounded w-full"
          >
            <option value="cod">Cash on Delivery</option>
            <option value="gcash">GCash</option>
            <option value="card">Credit/Debit Card</option>
          </select>
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="mt-6 w-full rounded bg-violet-600 px-6 py-3 text-white hover:bg-violet-700 disabled:opacity-50"
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </main>
  );
}
