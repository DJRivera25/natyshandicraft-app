'use client';

import { motion } from 'framer-motion';
import {
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Package,
  Heart,
  Star,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import PageWrapper from '@/components/PageWrapper';

export default function EmptyCart() {
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
            <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
              <ShoppingBag className="w-12 h-12 text-amber-600" />
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center"
            >
              <Heart className="w-3 h-3 text-white" />
            </motion.div>
            <motion.div
              animate={{ y: [5, -5, 5] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -bottom-2 -left-2 w-5 h-5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center"
            >
              <Star className="w-2.5 h-2.5 text-white" />
            </motion.div>
            <motion.div
              animate={{ y: [-3, 3, -3] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute top-1/2 -right-4 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center"
            >
              <Package className="w-2 h-2 text-white" />
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
              Your cart is empty
            </h2>
            <p className="text-amber-700 text-base leading-relaxed">
              Discover our handcrafted treasures and start building your
              collection of unique, artisanal products.
            </p>
          </motion.div>

          {/* Enhanced CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 space-y-4"
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

            {/* Additional Features */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center p-4 bg-white rounded-xl border border-amber-200/40 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-xs font-medium text-gray-700">
                  Free Shipping
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center p-4 bg-white rounded-xl border border-amber-200/40 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Heart className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-xs font-medium text-gray-700">Handcrafted</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-center p-4 bg-white rounded-xl border border-amber-200/40 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Star className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-xs font-medium text-gray-700">
                  Premium Quality
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
