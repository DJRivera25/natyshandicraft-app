'use client';

import React from 'react';
import { Star, ChevronDown, TrendingUp, Package } from 'lucide-react';

export interface SpecialFeatures {
  isFeatured?: boolean;
  discountActive?: boolean;
  inStock?: boolean;
  isBestSeller?: boolean;
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
    <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-amber-200/60 shadow-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between text-left hover:bg-amber-50/50 transition-colors"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <span className="font-semibold text-gray-900 text-sm sm:text-base">
            Special Features
          </span>
        </div>
        <div
          className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
        >
          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
        </div>
      </button>

      {isExpanded && (
        <div className="px-3 sm:px-4 pb-3 sm:pb-4">
          <div className="space-y-2 sm:space-y-3">
            <button
              className={`w-full flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl border transition-all shadow-sm ${
                specialFeatures.isBestSeller
                  ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white border-orange-400 shadow-lg'
                  : 'bg-white/90 text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-amber-300'
              }`}
              onClick={() => onSpecialFeatureToggle('isBestSeller')}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-medium">
                    Best Sellers
                  </div>
                  <div className="text-xs text-gray-600 sm:text-gray-500">
                    Most popular products
                  </div>
                </div>
              </div>
              <div
                className={`w-4 h-4 sm:w-5 sm:h-5 border-2 rounded-full transition-all ${specialFeatures.isBestSeller ? 'border-white bg-orange-400' : 'border-gray-300 bg-white'}`}
              ></div>
            </button>
            <button
              className={`w-full flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl border transition-all shadow-sm ${
                specialFeatures.isFeatured
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white border-yellow-400 shadow-lg'
                  : 'bg-white/90 text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-amber-300'
              }`}
              onClick={() => onSpecialFeatureToggle('isFeatured')}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-medium">
                    Featured Products
                  </div>
                  <div className="text-xs text-gray-600 sm:text-gray-500">
                    Handpicked favorites
                  </div>
                </div>
              </div>
              <div
                className={`w-4 h-4 sm:w-5 sm:h-5 border-2 rounded-full transition-all ${specialFeatures.isFeatured ? 'border-white bg-yellow-400' : 'border-gray-300 bg-white'}`}
              ></div>
            </button>
            <button
              className={`w-full flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl border transition-all shadow-sm ${
                specialFeatures.discountActive
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-red-200 shadow-lg'
                  : 'bg-white/90 text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-amber-300'
              }`}
              onClick={() => onSpecialFeatureToggle('discountActive')}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div
                  className={`p-1.5 sm:p-2 rounded-lg ${specialFeatures.discountActive ? 'bg-gradient-to-br from-red-500 to-pink-500' : 'bg-gray-200'}`}
                >
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-medium">On Sale</div>
                  <div className="text-xs text-gray-600 sm:text-gray-500">
                    Special discounts
                  </div>
                </div>
              </div>
              <div
                className={`w-4 h-4 sm:w-5 sm:h-5 border-2 rounded-full transition-all ${specialFeatures.discountActive ? 'border-white bg-red-500' : 'border-gray-300 bg-white'}`}
              ></div>
            </button>
            <button
              className={`w-full flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl border transition-all shadow-sm ${
                specialFeatures.inStock
                  ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white border-blue-400 shadow-lg'
                  : 'bg-white/90 text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-amber-300'
              }`}
              onClick={() => onSpecialFeatureToggle('inStock')}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg">
                  <Package className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-medium">In Stock</div>
                  <div className="text-xs text-gray-600 sm:text-gray-500">
                    Available now
                  </div>
                </div>
              </div>
              <div
                className={`w-4 h-4 sm:w-5 sm:h-5 border-2 rounded-full transition-all ${specialFeatures.inStock ? 'border-white bg-blue-400' : 'border-gray-300 bg-white'}`}
              ></div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecialFeaturesFilter;
