'use client';

import React from 'react';
import { Zap, Search, Tag } from 'lucide-react';

interface ActiveFiltersSummaryProps {
  searchInput: string;
  selectedCategory: string;
  priceRange: [number, number];
}

const ActiveFiltersSummary: React.FC<ActiveFiltersSummaryProps> = ({
  searchInput,
  selectedCategory,
  priceRange,
}) => {
  const hasActiveFilters =
    searchInput ||
    selectedCategory !== 'All' ||
    priceRange[0] > 0 ||
    priceRange[1] < 10000;

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="p-3 sm:p-4 bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-lg sm:rounded-xl shadow-lg">
      <div className="flex items-center gap-2 mb-2 sm:mb-3">
        <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
        <h4 className="text-xs sm:text-sm font-bold text-amber-800">
          Active Filters
        </h4>
      </div>
      <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-amber-700">
        {searchInput && (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Search className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Search: &ldquo;{searchInput}&rdquo;</span>
          </div>
        )}
        {selectedCategory !== 'All' && (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Tag className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Category: {selectedCategory}</span>
          </div>
        )}
        {(priceRange[0] > 0 || priceRange[1] < 10000) && (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-amber-500 rounded-full"></div>
            <span>
              Price: {priceRange[0].toLocaleString()} -{' '}
              {priceRange[1].toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveFiltersSummary;
