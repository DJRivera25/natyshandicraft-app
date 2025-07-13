'use client';

import { motion } from 'framer-motion';
import { Package, AlertCircle, Sparkles } from 'lucide-react';

interface CartSummaryProps {
  totalPrice: number;
  totalItems: number;
  userId: string | undefined;
  isProfileComplete: boolean;
  onCheckout: () => void;
}

export default function CartSummary({
  totalPrice,
  totalItems,
  userId,
  isProfileComplete,
  onCheckout,
}: CartSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="sticky top-24 space-y-4"
    >
      {/* Order Summary */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200/40">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-amber-900 flex items-center gap-2">
            <Package className="w-4 h-4" />
            Order Summary
          </h2>
          <div className="flex items-center gap-1 text-xs text-amber-600">
            <Sparkles className="w-3 h-3" />
            Free shipping
          </div>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Items ({totalItems})</span>
            <span className="font-medium text-gray-800">
              {totalPrice.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium text-green-600">Free</span>
          </div>
        </div>

        <div className="border-t border-amber-200 pt-3">
          <div className="flex justify-between text-base font-bold text-amber-900">
            <span>Total</span>
            <span>{totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Profile Status Warning */}
      {(!userId || !isProfileComplete) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-amber-50 border border-amber-200 rounded-xl"
        >
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-amber-800">
              <p className="font-medium mb-1">
                Complete your profile to checkout
              </p>
              <p>Please log in and add your shipping address to continue.</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Checkout Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onCheckout}
        disabled={!userId || !isProfileComplete}
        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm"
      >
        {!userId
          ? 'Login to Checkout'
          : !isProfileComplete
            ? 'Complete Profile to Checkout'
            : 'Proceed to Checkout'}
      </motion.button>
    </motion.div>
  );
}
