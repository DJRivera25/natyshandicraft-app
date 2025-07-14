import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminModalProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  actions?: React.ReactNode;
}

export default function AdminModal({
  open,
  title,
  children,
  onClose,
  actions,
}: AdminModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 md:p-0 p-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-white rounded-xl md:rounded-xl rounded-t-2xl shadow-2xl w-full max-w-lg md:max-w-lg p-4 sm:p-6 relative md:mt-0 mt-auto md:mb-0 mb-0 md:h-auto h-full flex flex-col"
            style={{ maxHeight: '100dvh' }}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 focus:outline-none md:text-2xl text-3xl"
              aria-label="Close"
            >
              <span aria-hidden>×</span>
            </button>
            <h2 className="text-lg font-bold mb-4 text-amber-900 md:mt-0 mt-8 text-center md:text-left">
              {title}
            </h2>
            <div className="mb-6 flex-1 overflow-y-auto">{children}</div>
            {actions && (
              <div className="flex justify-end gap-2 pb-2">{actions}</div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
