'use client';

import React from 'react';
import { Heart, Share2, Tag, Package, Eye, Loader2 } from 'lucide-react';
import type { Product } from '@/types/product';

interface ProductHeaderProps {
  product: Product;
  isWishlisted: boolean;
  onWishlistToggle: () => void;
  onShare: () => void;
  isLoading?: boolean;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({
  product,
  isWishlisted,
  onWishlistToggle,
  onShare,
  isLoading = false,
}) => {
  return (
    <div>
      <div className="flex items-start justify-between gap-2 sm:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-amber-900 mb-1 sm:mb-2 leading-tight">
            {product.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Tag className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">
                {product.category || 'Uncategorized'}
              </span>
              <span className="sm:hidden">
                {product.category?.slice(0, 8) || 'Uncat'}
              </span>
            </span>
            <span className="flex items-center gap-1">
              <Package className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">
                SKU: {product.sku || 'N/A'}
              </span>
              <span className="sm:hidden">
                {product.sku?.slice(0, 6) || 'N/A'}
              </span>
            </span>
            <span className="flex items-center gap-1">
              <Package className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Stock: {product.stock}</span>
              <span className="sm:hidden">{product.stock}</span>
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{product.views} views</span>
              <span className="sm:hidden">{product.views}</span>
            </span>
            {product.wishlistCount > 0 && (
              <span className="flex items-center gap-1 text-red-500">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">
                  {product.wishlistCount} wishlisted
                </span>
                <span className="sm:hidden">{product.wishlistCount}</span>
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={onWishlistToggle}
            disabled={isLoading}
            className={`p-2 sm:p-3 rounded-full transition-all ${
              isLoading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : isWishlisted
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <Heart
                className={`w-4 h-4 sm:w-5 sm:h-5 ${isWishlisted ? 'fill-current' : ''}`}
              />
            )}
          </button>
          <button
            onClick={onShare}
            className="p-2 sm:p-3 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-all"
          >
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductHeader;
