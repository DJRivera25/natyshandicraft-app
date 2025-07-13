'use client';

import { motion } from 'framer-motion';
import { Package, Clock, TrendingUp, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface OrdersHeaderProps {
  ordersCount: number;
  pendingCount: number;
}

export default function OrdersHeader({
  ordersCount,
  pendingCount,
}: OrdersHeaderProps) {
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
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-900">
                  My Orders
                </h1>
                <p className="text-amber-700 text-sm sm:text-base">
                  Track your purchases and manage your orders
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Stats */}
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="hidden sm:flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl px-4 py-3"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Package className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-lg font-bold text-blue-900">{ordersCount}</p>
                <p className="text-xs text-blue-700">Total Orders</p>
              </div>
            </motion.div>

            {pendingCount > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl px-4 py-3"
              >
                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-lg font-bold text-amber-900">
                    {pendingCount}
                  </p>
                  <p className="text-xs text-amber-700">Pending</p>
                </div>
              </motion.div>
            )}

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/products')}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl text-sm font-medium flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Shop More
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Enhanced Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4 sm:mt-6 pt-4 border-t border-amber-200/60"
        >
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Completed: {ordersCount - pendingCount}</span>
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span>In Progress: {pendingCount}</span>
              </span>
            </div>
            <div className="text-right">
              <span className="font-medium text-amber-700">
                {ordersCount > 0
                  ? Math.round(
                      ((ordersCount - pendingCount) / ordersCount) * 100
                    )
                  : 0}
                % Complete
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width:
                  ordersCount > 0
                    ? `${((ordersCount - pendingCount) / ordersCount) * 100}%`
                    : '0%',
              }}
              transition={{ delay: 0.6, duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
