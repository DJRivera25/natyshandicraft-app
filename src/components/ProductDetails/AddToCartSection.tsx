'use client';

import React from 'react';
import { ShoppingCart, Plus, Minus, Shield } from 'lucide-react';
import type { Product } from '@/types/product';

interface AddToCartSectionProps {
  product: Product;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
}

const AddToCartSection: React.FC<AddToCartSectionProps> = ({
  product,
  quantity,
  onQuantityChange,
  onAddToCart,
}) => {
  const maxQuantity = Math.max(0, product.stock);
  const currentQuantity = Math.min(quantity, maxQuantity);

  return (
    <div className="space-y-2 sm:space-y-3 p-2 sm:p-3 bg-gradient-to-br from-amber-50 to-white rounded-lg border border-amber-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 sm:gap-2 text-xs text-gray-600">
          <Shield className="w-3 h-3" />
          <span>Secure checkout</span>
        </div>
        {product.stock > 0 && (
          <div className="text-xs text-gray-500">
            Available: {product.stock} units
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => onQuantityChange(Math.max(1, currentQuantity - 1))}
            disabled={currentQuantity <= 1}
            className="p-1.5 sm:p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base font-semibold min-w-[40px] text-center">
            {currentQuantity}
          </span>
          <button
            onClick={() =>
              onQuantityChange(Math.min(maxQuantity, currentQuantity + 1))
            }
            disabled={currentQuantity >= maxQuantity}
            className="p-1.5 sm:p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
        <button
          onClick={onAddToCart}
          disabled={product.stock === 0}
          className="flex-1 py-2 sm:py-3 px-3 sm:px-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium shadow-md hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5 text-sm"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default AddToCartSection;
