'use client';

import React from 'react';
import type { Product } from '@/types/product';

interface ProductPricingProps {
  product: Product;
  finalPrice: number;
  originalPrice: number;
  discountAmount: number;
}

const ProductPricing: React.FC<ProductPricingProps> = ({
  product,
  finalPrice,
  originalPrice,
  discountAmount,
}) => {
  return (
    <div className="space-y-1.5 sm:space-y-2">
      <div className="flex items-baseline gap-2 sm:gap-3">
        <span className="text-2xl sm:text-3xl font-bold text-amber-700">
          {finalPrice.toLocaleString()}
        </span>
        {discountAmount > 0 && (
          <>
            <span className="text-lg sm:text-xl text-gray-500 line-through">
              {originalPrice.toLocaleString()}
            </span>
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-red-100 text-red-700 text-xs sm:text-sm font-bold rounded-full">
              Save {discountAmount.toLocaleString()}
            </span>
          </>
        )}
      </div>
      {product.promoText && (
        <div className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200 rounded-lg">
          <p className="text-xs sm:text-sm text-amber-800 font-medium">
            {product.promoText}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductPricing;
