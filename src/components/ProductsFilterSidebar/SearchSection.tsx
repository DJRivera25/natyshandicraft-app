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
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200/60 shadow-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-amber-50/50"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
            <Search className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-gray-900">Search Products</span>
        </div>
        <div className={`${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </div>
      </button>

      {isExpanded && (
        <div className="px-5 pb-5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, category, or tags..."
              value={searchInput}
              onChange={onSearchInputChange}
              onBlur={onSearchInputBlur}
              onKeyDown={onSearchInputKeyDown}
              onCompositionStart={onCompositionStart}
              onCompositionEnd={onCompositionEnd}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-white/90 backdrop-blur-sm shadow-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSection;
