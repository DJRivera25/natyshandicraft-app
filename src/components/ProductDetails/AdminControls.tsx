'use client';

import React from 'react';
import { Edit, Eye, EyeOff, Trash2 } from 'lucide-react';
import type { Product } from '@/types/product';

interface AdminControlsProps {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
  isTogglingActive?: boolean;
}

const AdminControls: React.FC<AdminControlsProps> = ({
  product,
  onEdit,
  onDelete,
  onToggleActive,
  isTogglingActive,
}) => {
  return (
    <div className="space-y-2 sm:space-y-3 p-2 sm:p-3 bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-200">
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={onEdit}
          className="flex items-center justify-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-blue-600 text-white rounded text-xs sm:text-sm hover:bg-blue-700 transition-colors font-medium"
        >
          <Edit className="w-3 h-3" />
          Edit
        </button>

        <button
          onClick={onToggleActive}
          className={`flex items-center justify-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded text-xs sm:text-sm transition-colors font-medium ${
            product.isActive
              ? 'bg-yellow-500 text-white hover:bg-yellow-600'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
          disabled={isTogglingActive}
        >
          {isTogglingActive ? (
            <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin inline-block"></span>
          ) : product.isActive ? (
            <EyeOff className="w-3 h-3" />
          ) : (
            <Eye className="w-3 h-3" />
          )}
          {isTogglingActive
            ? 'Toggling...'
            : product.isActive
              ? 'Hide'
              : 'Show'}
        </button>

        <button
          onClick={onDelete}
          className="flex items-center justify-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-red-600 text-white rounded text-xs sm:text-sm hover:bg-red-700 transition-colors font-medium"
        >
          <Trash2 className="w-3 h-3" />
          Delete
        </button>
      </div>

      <div className="flex justify-between text-xs text-gray-600">
        <span>
          Created:{' '}
          {product.createdAt
            ? new Date(product.createdAt).toLocaleDateString()
            : 'N/A'}
        </span>
        <span>Sold: {product.soldQuantity} units</span>
      </div>
    </div>
  );
};

export default AdminControls;
