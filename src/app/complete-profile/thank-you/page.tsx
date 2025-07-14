'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  ShoppingCart,
  User,
  ShoppingBag,
  Sparkles,
  Heart,
  ArrowRight,
} from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';

export default function ProfileThankYouPage() {
  const router = useRouter();

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-amber-50/30 to-white">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 lg:py-12">
          {/* Success Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
            className="text-center mb-8 sm:mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-12 h-12 text-green-600" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-900 mb-4"
            >
              Profile Complete!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-amber-700 max-w-2xl mx-auto mb-6"
            >
              Thank you for completing your profile! You&apos;re now ready to
              enjoy a personalized shopping experience with us.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center gap-2 text-amber-600"
            >
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium">
                Welcome to Naty&apos;s Handicraft!
              </span>
              <Sparkles className="w-5 h-5" />
            </motion.div>
          </motion.div>

          {/* Navigation Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8"
          >
            {/* Shopping Cart Card */}
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/cart')}
              className="bg-white rounded-2xl shadow-lg border border-amber-200/60 p-6 cursor-pointer transition-all hover:shadow-xl group"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <ShoppingCart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  View Cart
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Check your shopping cart and proceed to checkout
                </p>
                <div className="flex items-center justify-center gap-2 text-blue-600 font-medium">
                  <span>Go to Cart</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>

            {/* Profile Card */}
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/profile')}
              className="bg-white rounded-2xl shadow-lg border border-amber-200/60 p-6 cursor-pointer transition-all hover:shadow-xl group"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  My Profile
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  View and manage your account information
                </p>
                <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
                  <span>View Profile</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>

            {/* Shop Card */}
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/products')}
              className="bg-white rounded-2xl shadow-lg border border-amber-200/60 p-6 cursor-pointer transition-all hover:shadow-xl group"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Continue Shopping
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Browse our collection of beautiful handicrafts
                </p>
                <div className="flex items-center justify-center gap-2 text-amber-600 font-medium">
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Additional Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 sm:p-8 border border-amber-200/60"
          >
            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-semibold text-amber-900 mb-2">
                What&apos;s Next?
              </h3>
              <p className="text-amber-700">
                Explore these features to enhance your shopping experience
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  icon: Heart,
                  title: 'Wishlist',
                  description: 'Save your favorite items',
                  color: 'text-pink-600',
                },
                {
                  icon: ShoppingCart,
                  title: 'Quick Checkout',
                  description: 'Fast and secure payments',
                  color: 'text-blue-600',
                },
                {
                  icon: User,
                  title: 'Order Tracking',
                  description: 'Monitor your deliveries',
                  color: 'text-green-600',
                },
                {
                  icon: Sparkles,
                  title: 'Personalized',
                  description: 'Tailored recommendations',
                  color: 'text-purple-600',
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="text-center"
                >
                  <div
                    className={`w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm`}
                  >
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 text-xs">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Footer Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="text-center mt-8 sm:mt-12"
          >
            <p className="text-amber-700 text-sm flex items-center justify-center gap-2">
              <Heart className="w-4 h-4" />
              Thank you for choosing Naty&apos;s Handicraft
              <Heart className="w-4 h-4" />
            </p>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}
