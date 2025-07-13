'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';

interface ResetButtonProps {
  onReset: () => void;
}

const ResetButton: React.FC<ResetButtonProps> = ({ onReset }) => {
  return (
    <button
      onClick={onReset}
      className="w-full py-2.5 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white rounded-lg sm:rounded-xl font-semibold hover:from-red-600 hover:via-red-700 hover:to-red-800 shadow-xl flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base transition-all duration-200"
    >
      <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
      Clear All Filters
    </button>
  );
};

export default ResetButton;
