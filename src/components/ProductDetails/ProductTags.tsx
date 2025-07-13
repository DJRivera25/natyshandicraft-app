'use client';

import React from 'react';
import { Tag } from 'lucide-react';
import type { Product } from '@/types/product';

interface ProductTagsProps {
  product: Product;
}

const ProductTags: React.FC<ProductTagsProps> = ({ product }) => {
  if (!product.tags || product.tags.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Tag className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
        <h3 className="text-sm sm:text-base font-semibold text-gray-900">
          Tags
        </h3>
      </div>

      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {product.tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 rounded-full text-xs sm:text-sm font-medium border border-amber-200 hover:from-amber-200 hover:to-yellow-200 transition-all cursor-default"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProductTags;
