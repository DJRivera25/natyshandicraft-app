'use client';

import React from 'react';
import { Edit, Eye, EyeOff, Trash2, Zap } from 'lucide-react';
import type { Product } from '@/types/product';

interface AdminControlsProps {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
}

const AdminControls: React.FC<AdminControlsProps> = ({
  product,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  return (
    <div className="space-y-4 p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-200">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Zap className="w-5 h-5 text-blue-600" />
        Admin Controls
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={onEdit}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Edit className="w-4 h-4" />
          Edit Product
        </button>

        <button
          onClick={onToggleActive}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors font-medium ${
            product.isActive
              ? 'bg-yellow-500 text-white hover:bg-yellow-600'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          {product.isActive ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
          {product.isActive ? 'Deactivate' : 'Activate'}
        </button>

        <button
          onClick={onDelete}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-1">
          <span className="text-gray-600">Created:</span>
          <span className="font-medium">
            {product.createdAt
              ? new Date(product.createdAt).toLocaleDateString()
              : 'N/A'}
          </span>
        </div>
        <div className="space-y-1">
          <span className="text-gray-600">Sold:</span>
          <span className="font-medium">{product.soldQuantity} units</span>
        </div>
      </div>
    </div>
  );
};

export default AdminControls;
