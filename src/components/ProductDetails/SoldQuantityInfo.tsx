'use client';

import React from 'react';
import { TrendingUp, Package } from 'lucide-react';
import type { Product } from '@/types/product';

interface SoldQuantityInfoProps {
  product: Product;
}

const SoldQuantityInfo: React.FC<SoldQuantityInfoProps> = ({ product }) => {
  if (!product.soldQuantity || product.soldQuantity === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-green-600" />
        <span className="text-sm font-medium text-green-800">
          {product.soldQuantity} sold
        </span>
      </div>

      {product.stock > 0 && (
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {product.stock} in stock
          </span>
        </div>
      )}

      {product.soldQuantity > 10 && (
        <div className="ml-auto">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Popular Item
          </span>
        </div>
      )}
    </div>
  );
};

export default SoldQuantityInfo;
