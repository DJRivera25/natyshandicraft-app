'use client';

import React from 'react';
import { Filter, X } from 'lucide-react';

interface MobileToggleProps {
  isSidebarOpen: boolean;
  onToggle: () => void;
}

const MobileToggle: React.FC<MobileToggleProps> = ({
  isSidebarOpen,
  onToggle,
}) => {
  return (
    <div className="fixed z-50 md:hidden top-16 sm:top-20 right-2 sm:right-4">
      <button
        onClick={onToggle}
        className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white border border-amber-400 rounded-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 whitespace-nowrap min-w-fit"
      >
        {isSidebarOpen ? (
          <>
            <X className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="flex-shrink-0">Close</span>
          </>
        ) : (
          <>
            <Filter className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="flex-shrink-0">Filters</span>
          </>
        )}
      </button>
    </div>
  );
};

export default MobileToggle;
