'use client';

import React, { useState } from 'react';
import type { Product } from '@/types/product';

interface ProductDescriptionProps {
  product: Product;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ product }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-gray-900">Description</h3>
      <div className="text-gray-700 leading-relaxed">
        {showFullDescription ? (
          <div className="whitespace-pre-line">{product.description}</div>
        ) : (
          <div className="whitespace-pre-line">
            {product.description && product.description.length > 200
              ? `${product.description.slice(0, 200)}...`
              : product.description}
          </div>
        )}
        {product.description && product.description.length > 200 && (
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="text-amber-600 hover:text-amber-700 font-medium text-sm mt-2"
          >
            {showFullDescription ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductDescription;
