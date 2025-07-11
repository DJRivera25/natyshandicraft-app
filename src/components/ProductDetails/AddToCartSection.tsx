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
  return (
    <div className="mt-auto space-y-4 p-6 bg-gradient-to-br from-amber-50 to-white rounded-2xl border border-amber-200">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Add to Cart</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Shield className="w-4 h-4" />
          <span>Secure checkout</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => onQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-4 py-3 text-lg font-semibold min-w-[60px] text-center">
            {quantity}
          </span>
          <button
            onClick={() => onQuantityChange(quantity + 1)}
            disabled={quantity >= product.stock}
            className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={onAddToCart}
          disabled={product.stock === 0}
          className="flex-1 py-4 px-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold shadow-lg hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
      {product.stock > 0 && (
        <div className="text-sm text-gray-600 text-center">
          Free shipping on orders over ₱1,000
        </div>
      )}
    </div>
  );
};

export default AddToCartSection;
