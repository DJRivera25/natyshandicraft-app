'use client';

import React from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface SearchSectionProps {
  searchInput: string;
  onSearchInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchInputBlur: () => void;
  onSearchInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onCompositionStart: () => void;
  onCompositionEnd: () => void;
  isExpanded: boolean;
  onToggle: () => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({
  searchInput,
  onSearchInputChange,
  onSearchInputBlur,
  onSearchInputKeyDown,
  onCompositionStart,
  onCompositionEnd,
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
          <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <span className="font-semibold text-gray-900 text-sm sm:text-base">
            Search Products
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
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, category, or tags..."
              value={searchInput}
              onChange={onSearchInputChange}
              onBlur={onSearchInputBlur}
              onKeyDown={onSearchInputKeyDown}
              onCompositionStart={onCompositionStart}
              onCompositionEnd={onCompositionEnd}
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-white/90 backdrop-blur-sm shadow-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSection;
