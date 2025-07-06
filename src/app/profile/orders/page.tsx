'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchOrdersThunk } from '@/features/order/orderThunk';
import { apiCreateXenditInvoice } from '@/utils/api/xendit';
import { format } from 'date-fns';
import { useHasMounted } from '@/utils/useHasMounted';

export default function MyOrdersPage() {
  const dispatch = useAppDispatch();
  const hasMounted = useHasMounted();

  const { orders, loading, error } = useAppSelector((state) => state.order);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      dispatch(fetchOrdersThunk());
    }
  }, [dispatch, user]);

  const handlePayNow = async (orderId: string, totalAmount: number) => {
    try {
      if (!user) {
        alert('You must be logged in to pay.');
        return;
      }

      const { invoiceURL } = await apiCreateXenditInvoice({
        orderId,
        userId: user.id,
        amount: totalAmount,
        customerName: user.fullName,
        customerEmail: user.email,
      });

      window.location.href = invoiceURL;
    } catch (err) {
      console.error('❌ Failed to initiate payment:', err);
      alert('Failed to initiate payment. Please try again.');
    }
  };

  // 💡 Prevent hydration mismatch
  if (!hasMounted) return null;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold text-amber-900">My Orders</h1>

      {loading && <p className="text-gray-500">Loading orders...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && orders.length === 0 && (
        <p className="text-gray-500">You have no orders yet.</p>
      )}

      <div className="grid gap-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                Order #{order._id.slice(-6)}
              </h2>
              <span
                className={`mt-2 md:mt-0 inline-block rounded-full px-3 py-1 text-xs font-medium capitalize text-white ${
                  order.status === 'paid'
                    ? 'bg-green-600'
                    : order.status === 'cancelled'
                      ? 'bg-gray-500'
                      : 'bg-yellow-500'
                }`}
              >
                {order.status}
              </span>
            </div>

            <p className="mb-3 text-sm text-gray-500">
              Placed on{' '}
              {format(new Date(order.createdAt), 'MMM d, yyyy h:mm a')}
            </p>

            <ul className="mb-4 divide-y divide-gray-100">
              {order.items.map((item, index) => (
                <li
                  key={`${order._id}-${item.productId || index}`}
                  className="flex justify-between text-sm text-gray-700"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>₱{(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <p className="text-base font-semibold text-gray-800">
                Total: ₱{order.totalAmount.toFixed(2)}
              </p>

              {order.status === 'paid' && order.paymentMethod !== 'cod' && (
                <p className="text-sm text-gray-500">
                  Paid via{' '}
                  <span className="font-medium capitalize text-gray-700">
                    {order.paymentMethod}
                  </span>
                </p>
              )}

              {order.paymentMethod !== 'cod' && order.status === 'pending' && (
                <button
                  onClick={() => handlePayNow(order._id, order.totalAmount)}
                  className="rounded-md bg-violet-600 px-4 py-2 text-sm text-white hover:bg-violet-700"
                >
                  Pay Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
