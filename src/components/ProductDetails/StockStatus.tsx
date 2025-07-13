'use client';

import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import type { Product } from '@/types/product';

interface StockStatusProps {
  product: Product;
  isAdmin?: boolean;
}

const StockStatus: React.FC<StockStatusProps> = ({
  product,
  isAdmin = false,
}) => {
  const isLowStock =
    product.stock <= product.restockThreshold && product.stock > 0;
  const isInStock = product.stock > 0;

  return (
    <div className="space-y-2 sm:space-y-3">
      {/* Stock Status - Show for all users */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div
          className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg ${
            isInStock
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {isInStock ? (
            <>
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-medium">
                {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
              </span>
            </>
          ) : (
            <>
              <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-medium">
                Out of Stock
              </span>
            </>
          )}
        </div>

        {isLowStock && (
          <div className="px-2 sm:px-3 py-1.5 sm:py-2 bg-yellow-100 text-yellow-700 rounded-lg">
            <span className="text-xs sm:text-sm font-medium">
              Low Stock Alert
            </span>
          </div>
        )}
      </div>

      {/* Admin-only content */}
      {isAdmin && (
        <>
          {/* Restock Threshold Info - Only for admins */}
          {isLowStock && (
            <div className="px-2 sm:px-3 py-1.5 sm:py-2 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" />
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-medium text-orange-800">
                    Restock Alert
                  </span>
                  <span className="text-xs text-orange-600">
                    Restock threshold: {product.restockThreshold} units
                  </span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StockStatus;
