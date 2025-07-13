'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ProgressTracker from '@/components/ProgressTracker';

interface CartHeaderProps {
  totalItems: number;
}

export default function CartHeader({ totalItems }: CartHeaderProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-amber-200/60 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Enhanced Title Section */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="p-2 bg-white border border-amber-200 rounded-xl hover:bg-amber-50 transition-all shadow-sm"
            >
              <ArrowLeft className="w-5 h-5 text-amber-600" />
            </motion.button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-900">
                  Shopping Cart
                </h1>
                <p className="text-amber-700 text-sm sm:text-base">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} in your
                  cart
                </p>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <ProgressTracker currentStep="cart" />
        </div>
      </div>
    </motion.div>
  );
}
