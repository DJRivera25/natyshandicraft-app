'use client';

import React from 'react';
import { Tag, ChevronDown, Package, Sparkles } from 'lucide-react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
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
          <div className="p-1.5 sm:p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
            <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <span className="font-semibold text-gray-900 text-sm sm:text-base">
            Categories
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
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            <button
              onClick={() => onCategorySelect('All')}
              className={`px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-center transition-all ${
                selectedCategory === 'All'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                  : 'bg-white/90 text-gray-700 border border-gray-300 hover:bg-amber-50 hover:border-amber-300 shadow-sm'
              }`}
            >
              <div className="flex flex-col items-center gap-1 sm:gap-1.5">
                <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">All</span>
                {selectedCategory === 'All' && (
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-200" />
                )}
              </div>
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategorySelect(cat)}
                className={`px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-center transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                    : 'bg-white/90 text-gray-700 border border-gray-300 hover:bg-amber-50 hover:border-amber-300 shadow-sm'
                }`}
              >
                <div className="flex flex-col items-center gap-1 sm:gap-1.5">
                  <Tag className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm leading-tight">
                    {cat}
                  </span>
                  {selectedCategory === cat && (
                    <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-200" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
