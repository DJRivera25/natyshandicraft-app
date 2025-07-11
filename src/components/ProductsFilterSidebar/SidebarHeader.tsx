'use client';

import React from 'react';
import { SlidersHorizontal, RefreshCw } from 'lucide-react';

interface SidebarHeaderProps {
  onReset: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ onReset }) => {
  return (
    <div className="flex items-center justify-between pb-6 border-b border-amber-200/60">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 rounded-xl shadow-lg">
          <SlidersHorizontal className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Smart Filters</h2>
          <p className="text-sm text-gray-600">
            Refine your search with precision
          </p>
        </div>
      </div>
      <button
        onClick={onReset}
        className="p-2.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
        title="Reset all filters"
      >
        <RefreshCw className="w-5 h-5" />
      </button>
    </div>
  );
};

export default SidebarHeader;
