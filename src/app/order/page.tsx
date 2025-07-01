'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { clearCart } from '@/features/cart/cartSlice';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createOrderThunk } from '@/features/order/orderThunk';
import type { CreateOrderInput } from '@/types/order';
import { apiCreateXenditInvoice } from '@/utils/api/xendit';

export default function CheckoutPage() {
  const { items } = useAppSelector((state) => state.cart);
  const user = useAppSelector((state) => state.auth.user);
  const userAddress = user?.address;
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const [address, setAddress] = useState({
    street: userAddress?.street || '',
    brgy: userAddress?.brgy || '',
    city: userAddress?.city || '',
    province: userAddress?.province || '',
    postalCode: userAddress?.postalCode || '',
    country: userAddress?.country || 'Philippines',
  });

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (!user) return setError('Please log in to place your order.');
    if (items.length === 0) return setError('Your cart is empty.');

    const requiredFields = ['street', 'brgy', 'city', 'province', 'postalCode'];
    const hasEmpty = requiredFields.some(
      (key) => !address[key as keyof typeof address]
    );
    if (hasEmpty) return setError('Please complete all address fields.');

    const orderData: CreateOrderInput = {
      user: user.id,
      items: items.map(({ productId, name, price, quantity }) => ({
        productId,
        name,
        price,
        quantity,
      })),
      totalAmount,
      paymentMethod,
      status: 'pending',
      address,
    };

    setLoading(true);
    setError('');

    try {
      const order = await dispatch(createOrderThunk(orderData));

      if (!order || !('_id' in order)) {
        throw new Error('Failed to create order');
      }

      dispatch(clearCart());

      if (paymentMethod === 'cod') {
        router.push('/order/success');
        return;
      }

      const { invoiceURL } = await apiCreateXenditInvoice({
        orderId: order._id,
        userId: user.id,
        amount: totalAmount,
        customerName: user.fullName || 'Customer',
        customerEmail: user.email,
      });

      window.location.href = invoiceURL;
    } catch (err) {
      console.error('❌ Order placement failed:', err);
      if (err instanceof Error) setError(err.message);
      else setError('Something went wrong.');
    }

    setLoading(false);
  };

  if (!items.length) {
    return (
      <div className="p-8 text-center text-gray-500">Your cart is empty.</div>
    );
  }

  const addressFields = [
    { label: 'Street', name: 'street', placeholder: '#, street, brgy' },
    { label: 'Barangay', name: 'brgy', placeholder: 'Barangay' },
    { label: 'City', name: 'city', placeholder: 'City' },
    { label: 'Province', name: 'province', placeholder: 'Province' },
    { label: 'Postal Code', name: 'postalCode', placeholder: 'Postal Code' },
    { label: 'Country', name: 'country', placeholder: 'Country' },
  ];

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Checkout</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center justify-between border-b pb-2"
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

        <div className="mt-6 flex justify-between text-xl font-semibold">
          <span>Total:</span>
          <span>₱{totalAmount.toFixed(2)}</span>
        </div>

        {/* Address Fields */}
        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-semibold">Shipping Address</h2>
          {addressFields.map(({ name, placeholder }) => (
            <input
              key={name}
              type="text"
              placeholder={placeholder}
              className="w-full rounded border px-4 py-2"
              value={address[name as keyof typeof address]}
              onChange={(e) =>
                setAddress((prev) => ({
                  ...prev,
                  [name]: e.target.value,
                }))
              }
            />
          ))}
        </div>

        {/* Payment Method */}
        <div className="mt-6">
          <label className="mb-2 block font-medium">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full rounded border px-4 py-2"
          >
            <option value="cod">Cash on Delivery</option>
            <option value="online banking">Online Banking</option>
          </select>
        </div>

        {error && <p className="mt-4 text-red-600">{error}</p>}

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
