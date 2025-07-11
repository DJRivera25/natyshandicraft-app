'use client';

import React from 'react';
import { Star, ChevronDown, TrendingUp, Package } from 'lucide-react';

interface SpecialFeatures {
  isFeatured?: boolean;
  discountActive?: boolean;
  inStock?: boolean;
}

interface SpecialFeaturesFilterProps {
  specialFeatures: SpecialFeatures;
  onSpecialFeatureToggle: (key: keyof SpecialFeatures) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

const SpecialFeaturesFilter: React.FC<SpecialFeaturesFilterProps> = ({
  specialFeatures,
  onSpecialFeatureToggle,
  isExpanded,
  onToggle,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200/60 shadow-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-amber-50/50"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg">
            <Star className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-gray-900">Special Features</span>
        </div>
        <div className={`${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </div>
      </button>

      {isExpanded && (
        <div className="px-5 pb-5">
          <div className="space-y-3">
            <button
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all shadow-sm ${
                specialFeatures.isFeatured
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white border-yellow-400 shadow-lg'
                  : 'bg-white/90 text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-amber-300'
              }`}
              onClick={() => onSpecialFeatureToggle('isFeatured')}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium">Featured Products</div>
                  <div className="text-xs">Handpicked favorites</div>
                </div>
              </div>
              <div
                className={`w-5 h-5 border-2 rounded-full transition-all ${specialFeatures.isFeatured ? 'border-white bg-yellow-400' : 'border-gray-300 bg-white'}`}
              ></div>
            </button>
            <button
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all shadow-sm ${
                specialFeatures.discountActive
                  ? 'bg-gradient-to-r from-green-400 to-green-500 text-white border-green-400 shadow-lg'
                  : 'bg-white/90 text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-amber-300'
              }`}
              onClick={() => onSpecialFeatureToggle('discountActive')}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-400 to-green-500 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium">On Sale</div>
                  <div className="text-xs">Special discounts</div>
                </div>
              </div>
              <div
                className={`w-5 h-5 border-2 rounded-full transition-all ${specialFeatures.discountActive ? 'border-white bg-green-400' : 'border-gray-300 bg-white'}`}
              ></div>
            </button>
            <button
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all shadow-sm ${
                specialFeatures.inStock
                  ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white border-blue-400 shadow-lg'
                  : 'bg-white/90 text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-amber-300'
              }`}
              onClick={() => onSpecialFeatureToggle('inStock')}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg">
                  <Package className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium">In Stock</div>
                  <div className="text-xs">Available now</div>
                </div>
              </div>
              <div
                className={`w-5 h-5 border-2 rounded-full transition-all ${specialFeatures.inStock ? 'border-white bg-blue-400' : 'border-gray-300 bg-white'}`}
              ></div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecialFeaturesFilter;
