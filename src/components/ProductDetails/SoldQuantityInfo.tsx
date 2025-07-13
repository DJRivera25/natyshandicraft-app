'use client';

import React from 'react';
import { TrendingUp, Star, Award } from 'lucide-react';
import type { Product } from '@/types/product';

interface SoldQuantityInfoProps {
  product: Product;
}

const SoldQuantityInfo: React.FC<SoldQuantityInfoProps> = ({ product }) => {
  const soldQuantity = product.soldQuantity || 0;
  const isPopular = soldQuantity > 10;
  const isBestSeller = soldQuantity > 50;
  const isTrending = soldQuantity > 20;

  return (
    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
      <div className="flex items-center gap-1.5 sm:gap-2">
        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600" />
        <span className="text-xs sm:text-sm font-medium text-amber-800">
          {soldQuantity} sold
        </span>
      </div>

      {/* Popularity Badges */}
      <div className="flex items-center gap-1 sm:gap-2 ml-auto">
        {isBestSeller && (
          <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <Award className="w-2.5 h-2.5" />
            Best Seller
          </span>
        )}
        {isPopular && !isBestSeller && (
          <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Star className="w-2.5 h-2.5" />
            Popular
          </span>
        )}
        {isTrending && !isPopular && (
          <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <TrendingUp className="w-2.5 h-2.5" />
            Trending
          </span>
        )}
      </div>
    </div>
  );
};

export default SoldQuantityInfo;
