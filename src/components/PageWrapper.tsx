// components/PageWrapper.tsx
'use client';

import { motion } from 'framer-motion';

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.main
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex h-screen flex-col px-6  sm:px-12 relative"
    >
      {/* Background pattern */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-100 via-amber-50 to-transparent opacity-20"
      />
      {/* Content */}
      <div className="relative z-10 w-full">{children}</div>
    </motion.main>
  );
}
