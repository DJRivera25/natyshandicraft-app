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
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-gray-900">Availability</h3>
      <div className="flex items-center gap-4 text-sm text-gray-600">
        {product.availableFrom && (
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            From: {new Date(product.availableFrom).toLocaleDateString()}
          </span>
        )}
        {product.availableUntil && (
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Until: {new Date(product.availableUntil).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductAvailability;
