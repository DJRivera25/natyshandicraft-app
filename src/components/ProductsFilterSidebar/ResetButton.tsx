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
      className="w-full py-4 px-6 bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-600 hover:via-red-700 hover:to-red-800 shadow-xl flex items-center justify-center gap-3"
    >
      <RefreshCw className="w-5 h-5" />
      Clear All Filters
    </button>
  );
};

export default ResetButton;
