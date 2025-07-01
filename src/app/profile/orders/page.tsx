'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchOrdersThunk } from '@/features/order/orderThunk';
import { apiCreateXenditInvoice } from '@/utils/api/xendit';
import { format } from 'date-fns';

export default function MyOrdersPage() {
  const dispatch = useAppDispatch();
  const { orders, loading, error } = useAppSelector((state) => state.order);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) dispatch(fetchOrdersThunk());
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
        customerName: user.fullName || 'Customer',
        customerEmail: user.email,
      });

      window.location.href = invoiceURL;
    } catch (err) {
      console.error('❌ Failed to initiate payment:', err);
      alert('Failed to initiate payment. Please try again.');
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">My Orders</h1>

      {loading && <p className="text-gray-500">Loading orders...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && orders.length === 0 && (
        <p className="text-gray-500">You have no orders yet.</p>
      )}

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="rounded-lg border p-4 shadow-sm transition hover:shadow-md"
          >
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Order #{order._id.slice(-6)}
              </h2>
              <span
                className={`rounded-full px-3 py-1 text-sm capitalize text-white ${
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

            <p className="mb-2 text-sm text-gray-500">
              Placed on{' '}
              {format(new Date(order.createdAt), 'MMM d, yyyy h:mm a')}
            </p>

            <ul className="mb-4 space-y-1">
              {order.items.map((item) => (
                <li
                  key={`${order._id}-${item.productId}`}
                  className="flex justify-between text-sm text-gray-700"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>₱{(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
  <p className="text-lg font-semibold">
    Total: ₱{order.totalAmount.toFixed(2)}
  </p>

  {order.status === 'paid' && order.paymentMethod !== 'cod' && (
    <p className="text-sm text-gray-600">
      Paid via <span className="font-medium capitalize">{order.paymentMethod}</span>
    </p>
  )}

  {order.paymentMethod !== 'cod' && order.status === 'pending' && (
    <button
      onClick={() => handlePayNow(order._id, order.totalAmount)}
      className="rounded bg-violet-600 px-4 py-2 text-sm text-white hover:bg-violet-700"
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
