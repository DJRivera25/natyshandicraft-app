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
    <div className="fixed z-50 md:hidden top-20 right-4">
      <button
        onClick={onToggle}
        className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white border border-amber-400 rounded-full px-6 py-3 text-sm shadow-xl hover:shadow-2xl"
      >
        {isSidebarOpen ? (
          <>
            <X className="w-4 h-4" />
            <span className="ml-2">Close</span>
          </>
        ) : (
          <>
            <Filter className="w-4 h-4" />
            <span className="ml-2">Filters</span>
          </>
        )}
      </button>
    </div>
  );
};

export default MobileToggle;
