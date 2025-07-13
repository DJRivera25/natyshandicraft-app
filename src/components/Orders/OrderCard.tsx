'use client';

import { motion } from 'framer-motion';
import { Calendar, Package, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import type { Order } from '@/types/order';

interface OrderCardProps {
  order: Order;
  index: number;
  expandedOrder: string | null;
  onToggleExpansion: (orderId: string) => void;
  getStatusIcon: (status: string) => React.ReactNode;
  getStatusColor: (status: string) => string;
}

export default function OrderCard({
  order,
  index,
  expandedOrder,
  onToggleExpansion,
  getStatusIcon,
  getStatusColor,
}: OrderCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
      className="bg-white rounded-xl border border-amber-200/40 shadow-sm hover:shadow-md transition-all overflow-hidden"
    >
      {/* Order Header */}
      <div className="p-3 sm:p-4 border-b border-amber-200/40">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}
            >
              {getStatusIcon(order.status)}
              <span className="capitalize">{order.status}</span>
            </div>
            <span className="text-xs text-gray-500">
              #{order._id.slice(-8)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-amber-900">
              {order.totalAmount.toFixed(2)}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onToggleExpansion(order._id)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-all"
            >
              <ChevronRight
                className={`w-4 h-4 text-gray-600 transition-transform ${
                  expandedOrder === order._id ? 'rotate-90' : ''
                }`}
              />
            </motion.button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{format(new Date(order.createdAt), 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Package className="w-3 h-3" />
            <span>{order.items.length} items</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
