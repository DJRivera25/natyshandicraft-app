'use client';

import React from 'react';
import { SlidersHorizontal, RefreshCw } from 'lucide-react';

interface SidebarHeaderProps {
  onReset: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ onReset }) => {
  return (
    <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-amber-200/60">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="p-2 sm:p-2.5 bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 rounded-lg sm:rounded-xl shadow-lg">
          <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900">
            Smart Filters
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Refine your search with precision
          </p>
        </div>
      </div>
      <button
        onClick={onReset}
        className="p-1.5 sm:p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
        title="Reset all filters"
      >
        <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
};

export default SidebarHeader;
