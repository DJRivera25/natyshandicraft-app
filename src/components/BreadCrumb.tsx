'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface BreadcrumbProps {
  currentTitle?: string; // optional title for last segment
  customLabels?: Record<string, string>; // e.g. { admin: 'Admin', product: 'Products' }
  hideSegments?: string[]; // e.g. ['[id]']
}

const defaultLabels: Record<string, string> = {
  admin: 'Admin',
  product: 'Products',
  products: 'Products',
  order: 'Orders',
  profile: 'Profile',
  cart: 'Cart',
  login: 'Login',
  'complete-profile': 'Complete Profile',
};

type PathSegment = { label: string; href: string; seg: string };

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  currentTitle,
  customLabels = {},
  hideSegments = [],
}) => {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  // Map segments to labels, allow custom and default mapping
  const paths: PathSegment[] = segments
    .map((seg, index) => {
      if (hideSegments.includes(seg)) return null;
      const href = '/' + segments.slice(0, index + 1).join('/');
      const label =
        customLabels[seg] ||
        defaultLabels[seg] ||
        seg.charAt(0).toUpperCase() + seg.slice(1);
      return { label, href, seg };
    })
    .filter((x): x is PathSegment => x !== null);

  // Replace the last label with currentTitle if available
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
        <nav className="flex items-center gap-1 py-4 text-sm font-medium">
          <Link href="/" className="hover:underline text-amber-700">
            Home
          </Link>
          {paths.map((seg, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="w-4 h-4 mx-1 text-amber-400" />
              {idx === paths.length - 1 ? (
                <span className="text-amber-900 font-bold bg-amber-100 rounded px-2 py-1">
                  {seg.label}
                </span>
              ) : (
                <Link
                  href={seg.href}
                  className="hover:underline text-amber-700 bg-amber-50 rounded px-2 py-1"
                >
                  {seg.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>
    </motion.header>
  );
};

export default Breadcrumb;
