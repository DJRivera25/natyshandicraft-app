'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface BreadcrumbProps {
  currentTitle?: string; // ✅ optional title for last segment
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ currentTitle }) => {
  const pathname = usePathname(); // e.g. /products/cart/orders
  const segments = pathname.split('/').filter(Boolean); // remove empty strings

  const paths = segments.map((seg, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    return { label: seg.charAt(0).toUpperCase() + seg.slice(1), href };
  });

  // Replace the last label with `currentTitle` if available
  if (currentTitle && paths.length) {
    paths[paths.length - 1].label = currentTitle;
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        <nav className="text-sm text-amber-800 font-medium py-4 flex items-center gap-1">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          {paths.map((seg, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="w-4 h-4 mx-1 text-amber-400" />
              <Link
                href={seg.href}
                className={`hover:underline ${
                  idx === paths.length - 1 ? 'text-amber-600 font-semibold' : ''
                }`}
              >
                {seg.label}
              </Link>
            </React.Fragment>
          ))}
        </nav>
      </div>
    </motion.header>
  );
};

export default Breadcrumb;
