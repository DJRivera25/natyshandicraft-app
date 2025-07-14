import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import React from 'react';

interface AdminErrorProps {
  error: string;
  title?: string;
}

export default function AdminError({
  error,
  title = 'Something went wrong',
}: AdminErrorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-8 sm:py-12"
    >
      <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center max-w-md">{error}</p>
    </motion.div>
  );
}
