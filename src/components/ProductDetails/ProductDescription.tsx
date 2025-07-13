'use client';

import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';
import type { Product } from '@/types/product';

interface ProductDescriptionProps {
  product: Product;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ product }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  if (!product.description) {
    return null;
  }

  const isLongDescription = product.description.length > 120;
  const displayText = showFullDescription
    ? product.description
    : product.description.slice(0, 120) + (isLongDescription ? '...' : '');

  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="flex items-center gap-1.5 sm:gap-2">
        <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
        <h3 className="text-sm sm:text-base font-semibold text-gray-900">
          Description
        </h3>
      </div>

      <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
        <div className="text-xs sm:text-sm text-gray-700 leading-relaxed">
          <div className="whitespace-pre-line">{displayText}</div>

          {isLongDescription && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="flex items-center gap-1 text-amber-600 hover:text-amber-700 font-medium text-xs mt-2 transition-colors"
            >
              {showFullDescription ? (
                <>
                  <ChevronUp className="w-3 h-3" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3" />
                  Read more
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;
