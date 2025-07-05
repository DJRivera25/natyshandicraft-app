'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { clearCart } from '@/features/cart/cartSlice';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createOrderThunk } from '@/features/order/orderThunk';
import type { CreateOrderInput } from '@/types/order';
import { apiCreateXenditInvoice } from '@/utils/api/xendit';
import { Pencil } from 'lucide-react';
import { useHasMounted } from '@/utils/useHasMounted';

export default function CheckoutPage() {
  const { items } = useAppSelector((state) => state.cart);
  const user = useAppSelector((state) => state.auth.user);
  const userAddress = user?.address;
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [progress, setProgress] = useState(0);

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

  useEffect(() => {
    const animateSteps = () => {
      setProgress(0);
      setTimeout(() => setProgress(50), 1000);
    };
    animateSteps();
  }, []);

  useEffect(() => {
    if (userAddress) {
      setAddress({
        street: userAddress.street || '',
        brgy: userAddress.brgy || '',
        city: userAddress.city || '',
        province: userAddress.province || '',
        postalCode: userAddress.postalCode || '',
        country: userAddress.country || 'Philippines',
      });
    }
  }, [userAddress]);

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

  const hasMounted = useHasMounted();
  if (!hasMounted) return null;

  if (!items.length) {
    return null;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* Progress Bar */}
      <div className="mb-8 relative">
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

      {/* Page Content */}
      {progress < 50 && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      )}
      <div
        className={`transition-opacity duration-700 ease-in-out ${progress < 50 ? 'opacity-0 pointer-events-none' : 'opacity-100 animate-fade-in'}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-6 lg:gap-10">
          {/* LEFT: ORDER SUMMARY */}
          <aside className="order-1 md:order-none bg-white border border-amber-300 rounded-xl shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-amber-900 mb-4">
              Order Summary
            </h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div className="text-sm text-amber-800 font-medium">
                    {item.name}
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-amber-700">
                    ₱{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-4 mt-4 text-base font-bold text-amber-900 border-t">
              <span>Total:</span>
              <span>₱{totalAmount.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Estimated delivery in 2-3 business days.
            </p>
            <button
              onClick={() => router.push('/cart')}
              className="mt-4 w-full rounded-md border border-amber-400 text-amber-600 py-1.5 text-sm hover:bg-amber-50 transition"
            >
              Back to Cart
            </button>
          </aside>

          {/* RIGHT: FORM */}
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-amber-800">
                Shipping Address
              </h2>
              <button
                onClick={() => setShowAddressModal(true)}
                className="text-amber-600 hover:underline flex items-center gap-1 text-sm"
              >
                <Pencil size={14} /> Edit
              </button>
            </div>

            <p className="text-gray-700">
              {[
                address.street,
                address.brgy,
                address.city,
                address.province,
                address.postalCode,
                address.country,
              ]
                .filter(Boolean)
                .join(', ')}
            </p>

            <div className="pt-2">
              <label className="text-sm font-medium text-amber-800 mb-1 block">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full rounded-md border px-3 py-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="cod">Cash on Delivery</option>
                <option value="online banking">Online Banking</option>
              </select>
            </div>

            {error && (
              <p className="text-sm text-red-600 font-medium pt-2">{error}</p>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="mt-2 w-full rounded-md bg-amber-600 px-4 py-2 text-sm text-white font-semibold hover:bg-amber-700 transition disabled:opacity-50"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
      {/* Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-amber-800">
              Edit Shipping Address
            </h3>
            <div className="space-y-3">
              {[
                { field: 'street', label: 'Street Address' },
                { field: 'brgy', label: 'Barangay' },
                { field: 'city', label: 'City/Municipality' },
                { field: 'province', label: 'Province' },
                { field: 'postalCode', label: 'Postal Code' },
                { field: 'country', label: 'Country' },
              ].map(({ field, label }) => (
                <div key={field}>
                  <label className="text-xs font-medium text-gray-700 block mb-1">
                    {label}
                  </label>
                  <input
                    type="text"
                    value={address[field as keyof typeof address]}
                    onChange={(e) =>
                      setAddress((prev) => ({
                        ...prev,
                        [field]: e.target.value,
                      }))
                    }
                    placeholder={`Enter ${label.toLowerCase()}`}
                    className="w-full rounded-md border px-3 py-2 text-sm focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowAddressModal(false)}
                className="text-sm text-gray-500 hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddressModal(false)}
                className="text-sm text-white bg-amber-600 hover:bg-amber-700 rounded px-4 py-2"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
