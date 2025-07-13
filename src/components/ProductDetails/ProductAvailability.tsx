'use client';

import React from 'react';
import { Calendar } from 'lucide-react';
import type { Product } from '@/types/product';

interface ProductAvailabilityProps {
  product: Product;
}

const ProductAvailability: React.FC<ProductAvailabilityProps> = ({
  product,
}) => {
  if (!product.availableFrom && !product.availableUntil) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
      {product.availableFrom && (
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          From: {new Date(product.availableFrom).toLocaleDateString()}
        </span>
      )}
      {product.availableUntil && (
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          Until: {new Date(product.availableUntil).toLocaleDateString()}
        </span>
      )}
    </div>
  );
};

export default ProductAvailability;
