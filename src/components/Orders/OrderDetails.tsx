'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Eye, CreditCard, Ban } from 'lucide-react';
import OrderLocationMap from '@/components/OrderLocationMap';
import type { Order } from '@/types/order';

interface OrderDetailsProps {
  order: Order;
  expandedOrder: string | null;
  onToggleExpansion: (orderId: string) => void;
  onPayNow: (orderId: string, totalAmount: number) => void;
  onCancelOrder: (orderId: string) => void;
  canCancelOrder: (order: {
    status: string;
    paymentMethod?: string;
  }) => boolean;
}

export default function OrderDetails({
  order,
  expandedOrder,
  onToggleExpansion,
  onPayNow,
  onCancelOrder,
  canCancelOrder,
}: OrderDetailsProps) {
  return (
    <AnimatePresence>
      {expandedOrder === order._id && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="border-t border-amber-200/40"
        >
          {/* Order Items */}
          <div className="p-3 sm:p-4 space-y-3">
            <h4 className="text-sm font-semibold text-gray-900">Order Items</h4>
            <div className="space-y-2">
              {order.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      Qty: {item.quantity} × {item.price.toFixed(2)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-amber-700">
                    {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Details */}
          <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Payment Method</p>
                <p className="font-medium text-gray-900 capitalize">
                  {order.paymentMethod}
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Status</p>
                <p className="font-medium text-gray-900 capitalize">
                  {order.status}
                </p>
              </div>
            </div>

            {/* Address */}
            {order.address && (
              <div>
                <p className="text-gray-600 mb-1 text-sm">Shipping Address</p>
                <div className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                  <MapPin className="w-3 h-3 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    {[
                      order.address.street,
                      order.address.city,
                      order.address.province,
                      order.address.postalCode,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </div>
              </div>
            )}

            {/* Location Map */}
            {order.location && (
              <div>
                <p className="text-gray-600 mb-2 text-sm">Delivery Location</p>
                <OrderLocationMap
                  location={order.location}
                  address={
                    order.address as {
                      street: string;
                      city: string;
                      province: string;
                      postalCode: string;
                      country: string;
                    }
                  }
                  orderId={order._id}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              {order.status === 'pending' && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onPayNow(order._id, order.totalAmount)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all text-sm"
                  >
                    <CreditCard className="w-4 h-4" />
                    Pay Now
                  </motion.button>
                  {canCancelOrder(order) && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onCancelOrder(order._id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition-all text-sm"
                    >
                      <Ban className="w-4 h-4" />
                      Cancel Order
                    </motion.button>
                  )}
                </>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onToggleExpansion(order._id)}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-all text-sm"
              >
                <Eye className="w-4 h-4" />
                View Details
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
