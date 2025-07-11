'use client';

import React from 'react';
import type { Product } from '@/types/product';

interface ProductTagsProps {
  product: Product;
}

const ProductTags: React.FC<ProductTagsProps> = ({ product }) => {
  if (!product.tags || product.tags.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
      <div className="flex flex-wrap gap-2">
        {product.tags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProductTags;
