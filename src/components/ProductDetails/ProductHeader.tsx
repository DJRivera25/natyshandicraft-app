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
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl lg:text-4xl font-bold text-amber-900 mb-2 leading-tight">
            {product.name}
          </h1>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Tag className="w-4 h-4" />
              {product.category || 'Uncategorized'}
            </span>
            <span className="flex items-center gap-1">
              <Package className="w-4 h-4" />
              SKU: {product.sku || 'N/A'}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {product.views} views
            </span>
            {product.wishlistCount > 0 && (
              <span className="flex items-center gap-1 text-red-500">
                <Heart className="w-4 h-4" />
                {product.wishlistCount} wishlisted
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onWishlistToggle}
            disabled={isLoading}
            className={`p-3 rounded-full transition-all ${
              isLoading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : isWishlisted
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Heart
                className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`}
              />
            )}
          </button>
          <button
            onClick={onShare}
            className="p-3 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-all"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductHeader;
