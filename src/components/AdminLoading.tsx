import { motion } from 'framer-motion';
import React from 'react';

interface AdminLoadingProps {
  message?: string;
}

export default function AdminLoading({
  message = 'Loading...',
}: AdminLoadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-8 sm:py-12"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-8 h-8 border-2 border-amber-200 border-t-amber-600 rounded-full mb-3"
      />
      <p className="text-sm text-gray-600">{message}</p>
    </motion.div>
  );
}
