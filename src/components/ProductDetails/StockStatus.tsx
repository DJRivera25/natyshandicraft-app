'use client';

import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import type { Product } from '@/types/product';

interface StockStatusProps {
  product: Product;
}

const StockStatus: React.FC<StockStatusProps> = ({ product }) => {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
          product.stock > 0
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
        }`}
      >
        {product.stock > 0 ? (
          <>
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">
              {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
            </span>
          </>
        ) : (
          <>
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Out of Stock</span>
          </>
        )}
      </div>
      {product.stock <= product.restockThreshold && product.stock > 0 && (
        <div className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg">
          <span className="text-sm font-medium">Low Stock Alert</span>
        </div>
      )}
    </div>
  );
};

export default StockStatus;
