'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 md:p-0 p-2"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-white rounded-xl md:rounded-xl rounded-t-2xl shadow-2xl w-full max-w-lg md:max-w-lg p-0 flex flex-col overflow-hidden md:mt-0 mt-auto md:mb-0 mb-0 md:h-auto h-full"
            style={{ maxHeight: '100dvh' }}
          >
            {/* Gradient Header */}
            <div className="bg-gradient-to-r from-red-50 to-pink-50 px-4 py-4 border-b border-red-200 flex items-center justify-between relative">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-red-900">
                    Cancel Order
                  </h2>
                  <p className="text-red-700 text-xs sm:text-sm">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <button
                onClick={onCancel}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 focus:outline-none text-3xl md:text-2xl"
                aria-label="Close"
              >
                <span aria-hidden>×</span>
              </button>
            </div>
            {/* Content */}
            <div className="flex-1 flex flex-col justify-between p-4 sm:p-6">
              <div className="flex items-start gap-3 mb-6">
                <AlertTriangle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-900 font-medium mb-2">
                    Are you sure you want to cancel this order?
                  </p>
                  <p className="text-sm text-gray-600">
                    The order will be marked as cancelled and any pending
                    payments will be voided.
                  </p>
                  {orderId && (
                    <p className="text-xs text-gray-500 mt-2">
                      Order ID: #{orderId.slice(-8)}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <button
                  onClick={onCancel}
                  disabled={isCancelling}
                  className="w-full sm:w-auto px-4 py-2 rounded bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
                  type="button"
                >
                  Keep Order
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isCancelling}
                  className="w-full sm:w-auto px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  type="button"
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
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
