'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface CancelOrderModalProps {
  isOpen: boolean;
  orderId: string | null;
  onConfirm: () => void;
  onCancel: () => void;
  isCancelling: boolean;
}

export default function CancelOrderModal({
  isOpen,
  orderId,
  onConfirm,
  onCancel,
  isCancelling,
}: CancelOrderModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Cancel Order
                </h3>
              </div>
              <button
                onClick={onCancel}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex items-start gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-gray-900 font-medium mb-2">
                  Are you sure you want to cancel this order?
                </p>
                <p className="text-sm text-gray-600">
                  This action cannot be undone. The order will be marked as
                  cancelled and any pending payments will be voided.
                </p>
                {orderId && (
                  <p className="text-xs text-gray-500 mt-2">
                    Order ID: #{orderId.slice(-8)}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onCancel}
                disabled={isCancelling}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Keep Order
              </button>
              <button
                onClick={onConfirm}
                disabled={isCancelling}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isCancelling ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Cancelling...
                  </>
                ) : (
                  'Cancel Order'
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
