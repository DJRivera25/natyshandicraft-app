'use client';

import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface OrdersErrorProps {
  error: string;
}

export default function OrdersError({ error }: OrdersErrorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-8 sm:py-12"
    >
      <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Something went wrong
      </h3>
      <p className="text-gray-600 text-center max-w-md">{error}</p>
    </motion.div>
  );
}
