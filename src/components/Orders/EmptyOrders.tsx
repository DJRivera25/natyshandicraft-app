'use client';

import { motion } from 'framer-motion';
import {
  Package,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Star,
  Heart,
  Truck,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import PageWrapper from '@/components/PageWrapper';

export default function EmptyOrders() {
  const router = useRouter();

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-yellow-50/20 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          {/* Enhanced Empty State Icon */}
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="relative mb-8"
          >
            <div className="w-28 h-28 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
              <Package className="w-14 h-14 text-amber-600" />
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-3 -right-3 w-7 h-7 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center"
            >
              <Heart className="w-4 h-4 text-white" />
            </motion.div>
            <motion.div
              animate={{ y: [5, -5, 5] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -bottom-3 -left-3 w-6 h-6 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center"
            >
              <Star className="w-3 h-3 text-white" />
            </motion.div>
            <motion.div
              animate={{ y: [-3, 3, -3] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute top-1/2 -right-6 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center"
            >
              <Truck className="w-2.5 h-2.5 text-white" />
            </motion.div>
          </motion.div>

          {/* Enhanced Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-2">
              No orders yet
            </h2>
            <p className="text-amber-700 text-base leading-relaxed">
              Start your shopping journey and discover our handcrafted
              treasures. Your first order is just a click away!
            </p>
          </motion.div>

          {/* Enhanced CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 space-y-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/products')}
              className="group bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl text-lg flex items-center justify-center gap-3 mx-auto"
            >
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Start Shopping
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            {/* Enhanced Features Grid */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center p-4 bg-white rounded-xl border border-amber-200/40 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Truck className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Free Shipping
                </p>
                <p className="text-xs text-gray-500">On all orders</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center p-4 bg-white rounded-xl border border-amber-200/40 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Handcrafted
                </p>
                <p className="text-xs text-gray-500">Unique pieces</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-center p-4 bg-white rounded-xl border border-amber-200/40 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Premium Quality
                </p>
                <p className="text-xs text-gray-500">Best materials</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-center p-4 bg-white rounded-xl border border-amber-200/40 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Easy Returns
                </p>
                <p className="text-xs text-gray-500">30-day policy</p>
              </motion.div>
            </div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">
                    New Customer?
                  </h4>
                  <p className="text-sm text-blue-700">
                    Create an account to track your orders and get exclusive
                    offers.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
