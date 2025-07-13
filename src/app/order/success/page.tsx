// app/order/success/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Package,
  Home,
  Clock,
  Truck,
  Mail,
  ArrowRight,
  Star,
} from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';
import ProgressTracker from '@/components/ProgressTracker';

export default function OrderSuccessPage() {
  const router = useRouter();

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-amber-50/30 to-white">
        {/* Progress Tracker Header */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-amber-200/60 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-center">
              <ProgressTracker currentStep="complete" />
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
          {/* Success Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
            className="text-center mb-8"
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
              className="text-3xl sm:text-4xl font-bold text-amber-900 mb-4"
            >
              Order Placed Successfully!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-amber-700 max-w-2xl mx-auto"
            >
              Thank you for your purchase! Your order is now being processed and
              will be shipped soon.
            </motion.p>
          </motion.div>

          {/* Order Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl border border-amber-200/60 shadow-lg p-6 sm:p-8 mb-8"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-amber-900 mb-6 flex items-center gap-2">
              <Package className="w-6 h-6" />
              What&apos;s Next?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Order Confirmation */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="text-center p-4 bg-amber-50 rounded-xl border border-amber-200"
              >
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-semibold text-amber-900 mb-2">
                  Order Confirmation
                </h3>
                <p className="text-sm text-amber-700">
                  You&apos;ll receive an email confirmation with your order
                  details shortly.
                </p>
              </motion.div>

              {/* Processing */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-blue-900 mb-2">Processing</h3>
                <p className="text-sm text-blue-700">
                  We&apos;re preparing your order for shipment. This usually
                  takes 1-2 business days.
                </p>
              </motion.div>

              {/* Shipping */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
                className="text-center p-4 bg-green-50 rounded-xl border border-green-200"
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Truck className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-green-900 mb-2">Shipping</h3>
                <p className="text-sm text-green-700">
                  Your order will be shipped within 2-3 business days with
                  tracking information.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Delivery Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border border-amber-200 p-6 sm:p-8 mb-8"
          >
            <h3 className="text-lg sm:text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Delivery Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-amber-800">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span>Estimated delivery: 2-3 business days</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span>Free shipping on all orders</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span>Tracking number will be sent via email</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span>Signature may be required upon delivery</span>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/')}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/profile/orders')}
              className="flex items-center justify-center gap-2 bg-white border-2 border-amber-500 text-amber-600 px-8 py-4 rounded-xl font-semibold hover:bg-amber-50 transition-all shadow-lg hover:shadow-xl"
            >
              View My Orders
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-12 text-center"
          >
            <div className="bg-white rounded-xl border border-amber-200/60 p-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Star className="w-5 h-5 text-amber-500" />
                <h4 className="font-semibold text-amber-900">Need Help?</h4>
                <Star className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-amber-700 text-sm">
                If you have any questions about your order, please don&apos;t
                hesitate to contact our customer support team. We&apos;re here
                to help ensure you have the best shopping experience!
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}
