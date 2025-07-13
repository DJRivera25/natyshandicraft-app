'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchCartThunk,
  removeFromCartThunk,
  saveCartThunk,
} from '@/features/cart/cartThunk';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { useHasMounted } from '@/utils/useHasMounted';
import PageWrapper from '@/components/PageWrapper';
import { CartHeader, CartLayout, EmptyCart } from '@/components/Cart';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Package,
  Truck,
  Shield,
  CreditCard,
} from 'lucide-react';

export default function CartPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const hasMounted = useHasMounted();

  const { items } = useAppSelector((state) => state.cart);
  const user = useAppSelector((state) => state.auth.user);
  const isProfileComplete = useAppSelector(
    (state) => state.auth.isProfileComplete
  );
  const userId = user?.id;

  const [removingItem, setRemovingItem] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCartThunk());
    }
  }, [dispatch, userId]);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = useCallback(async () => {
    if (!userId || !isProfileComplete) return;

    setIsAnimating(true);
    await dispatch(saveCartThunk({ user: userId, items }));

    // Smooth transition to checkout
    setTimeout(() => {
      router.push('/order');
    }, 300);
  }, [userId, isProfileComplete, dispatch, items, router]);

  const handleRemoveItem = useCallback(
    async (productId: string) => {
      setRemovingItem(productId);
      try {
        await dispatch(removeFromCartThunk(productId));
      } finally {
        setRemovingItem(null);
      }
    },
    [dispatch]
  );

  // 🚨 Early return to prevent hydration issues
  if (!hasMounted || !Array.isArray(items)) return null;

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-yellow-50/20">
        {/* Enhanced Header with Progress Tracker */}
        <CartHeader totalItems={totalItems} />

        {/* Main Content - Enhanced Layout */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Cart Items - Left Column */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                {/* Section Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-amber-900">
                        Shopping Cart
                      </h2>
                      <p className="text-sm text-amber-600">
                        {totalItems} {totalItems === 1 ? 'item' : 'items'} in
                        your cart
                      </p>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push('/products')}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-amber-200 rounded-xl hover:bg-amber-50 transition-all text-sm font-medium text-amber-700 shadow-sm"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    Continue Shopping
                  </motion.button>
                </div>

                {/* Cart Items */}
                <CartLayout
                  items={items}
                  onRemoveItem={handleRemoveItem}
                  removingItem={removingItem}
                />
              </motion.div>
            </div>

            {/* Order Summary - Right Column */}
            <div className="lg:w-96">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="sticky top-24 space-y-6"
              >
                {/* Enhanced Order Summary */}
                <div className="bg-white rounded-2xl border border-amber-200/40 shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-6 py-4 border-b border-amber-200/40">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-amber-900 flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Order Summary
                      </h3>
                      <div className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                        <Sparkles className="w-3 h-3" />
                        Free shipping
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Price Breakdown */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">
                          Subtotal ({totalItems} items)
                        </span>
                        <span className="font-semibold text-gray-800">
                          {totalPrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 flex items-center gap-2">
                          <Truck className="w-4 h-4 text-green-500" />
                          Shipping
                        </span>
                        <span className="font-semibold text-green-600">
                          Free
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 flex items-center gap-2">
                          <Shield className="w-4 h-4 text-blue-500" />
                          Protection
                        </span>
                        <span className="font-semibold text-blue-600">
                          Included
                        </span>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="border-t border-amber-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-amber-900">
                          Total
                        </span>
                        <span className="text-2xl font-bold text-amber-900">
                          {totalPrice.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        All prices include applicable taxes
                      </p>
                    </div>
                  </div>
                </div>

                {/* Profile Status Warning */}
                {(!userId || !isProfileComplete) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">
                          Complete your profile
                        </h4>
                        <p className="text-sm text-blue-700 mb-3">
                          Please log in and add your shipping address to
                          continue with checkout.
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => router.push('/complete-profile')}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Complete Profile
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Enhanced Checkout Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  disabled={!userId || !isProfileComplete || isAnimating}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-xl ${
                    !userId || !isProfileComplete
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700'
                  } ${isAnimating ? 'animate-pulse' : ''}`}
                >
                  <AnimatePresence mode="wait">
                    {isAnimating ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-3"
                      >
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </motion.div>
                    ) : (
                      <motion.div
                        key="checkout"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-3"
                      >
                        {!userId
                          ? 'Login to Checkout'
                          : !isProfileComplete
                            ? 'Complete Profile to Checkout'
                            : 'Proceed to Checkout'}
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* Trust Indicators */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-green-500" />
                      Secure Checkout
                    </div>
                    <div className="flex items-center gap-1">
                      <Truck className="w-3 h-3 text-blue-500" />
                      Free Shipping
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="w-3 h-3 text-amber-500" />
                      Quality Guarantee
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
