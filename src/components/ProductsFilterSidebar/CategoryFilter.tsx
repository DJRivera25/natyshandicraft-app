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
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200/60 shadow-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-amber-50/50"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
            <Tag className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-gray-900">Categories</span>
        </div>
        <div className={`${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </div>
      </button>

      {isExpanded && (
        <div className="px-5 pb-5">
          <div className="space-y-3">
            <button
              onClick={() => onCategorySelect('All')}
              className={`w-full px-4 py-3 rounded-xl text-sm font-medium text-left ${
                selectedCategory === 'All'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                  : 'bg-white/90 text-gray-700 border border-gray-300 hover:bg-amber-50 hover:border-amber-300 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>All Categories</span>
                {selectedCategory === 'All' && (
                  <Sparkles className="w-4 h-4 ml-auto" />
                )}
              </div>
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategorySelect(cat)}
                className={`w-full px-4 py-3 rounded-xl text-sm font-medium text-left ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                    : 'bg-white/90 text-gray-700 border border-gray-300 hover:bg-amber-50 hover:border-amber-300 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Tag className="w-4 h-4" />
                  <span>{cat}</span>
                  {selectedCategory === cat && (
                    <Sparkles className="w-4 h-4 ml-auto" />
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
