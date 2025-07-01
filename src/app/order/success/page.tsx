// app/order/success/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { CheckCircleIcon } from 'lucide-react';

export default function OrderSuccessPage() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12 text-center">
      <CheckCircleIcon className="mb-4 h-16 w-16 text-green-500" />
      <h1 className="text-3xl font-bold text-gray-800">Order Placed Successfully!</h1>
      <p className="mt-2 text-gray-600">
        Thank you for your purchase. Your order is now being processed.  
      </p>

      {/* Optional: Display order/payment details here via query or context */}

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => router.push('/')}
          className="rounded bg-violet-600 px-6 py-3 text-white hover:bg-violet-700"
        >
          Back to Home
        </button>
        <button
          onClick={() => router.push('/profile/orders')}
          className="rounded border border-violet-600 px-6 py-3 text-violet-600 hover:bg-violet-50"
        >
          View My Orders
        </button>
      </div>
    </main>
  );
}
