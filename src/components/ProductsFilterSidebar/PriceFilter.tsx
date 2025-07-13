'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import Slider from '@mui/material/Slider';

interface PriceFilterProps {
  priceRange: [number, number];
  onPriceRangeChange: (value: [number, number]) => void;
  isExpanded: boolean;
  onToggle: () => void;
  isMobile?: boolean;
}

const PriceFilter: React.FC<PriceFilterProps> = ({
  priceRange,
  onPriceRangeChange,
  isExpanded,
  onToggle,
  isMobile = false,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-amber-200/60 shadow-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between text-left hover:bg-amber-50/50 transition-colors"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full"></div>
          </div>
          <span className="font-semibold text-gray-900 text-sm sm:text-base">
            Price Range
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
          <div className="space-y-4 sm:space-y-6">
            <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-2">
              Price Range
            </label>
            <div
              className={`w-full ${isMobile ? 'pt-12 sm:pt-14' : 'pt-6 sm:pt-8'} pb-2 flex flex-col items-center`}
            >
              <Slider
                value={priceRange}
                min={0}
                max={10000}
                step={10}
                onChange={(_, newValue) => {
                  if (Array.isArray(newValue)) {
                    onPriceRangeChange(newValue as [number, number]);
                  }
                }}
                valueLabelDisplay="on"
                valueLabelFormat={(v) => `${v.toLocaleString()}`}
                sx={{
                  color: '#f59e42',
                  height: isMobile ? 8 : 6,
                  padding: isMobile ? '32px 0 16px 0' : '24px 0',
                  '& .MuiSlider-thumb': {
                    height: isMobile ? 28 : 24,
                    width: isMobile ? 28 : 24,
                    backgroundColor: '#fff',
                    border: '3px solid #f59e42',
                    boxShadow: isMobile
                      ? '0 4px 16px rgba(0,0,0,0.13), 0 0 0 2px #fde68a'
                      : '0 3px 12px rgba(0,0,0,0.10)',
                    '&:hover, &.Mui-focusVisible': {
                      boxShadow: isMobile
                        ? '0 0 0 6px #fde68a, 0 4px 16px rgba(0,0,0,0.13)'
                        : '0 0 0 4px #fde68a',
                      borderColor: '#fbbf24',
                    },
                    ...(isMobile && {
                      '&:after': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        left: 6,
                        top: 6,
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        boxShadow: 'inset 0 2px 6px #fbbf24',
                        opacity: 0.15,
                      },
                    }),
                  },
                  '& .MuiSlider-rail': {
                    background: isMobile
                      ? 'linear-gradient(90deg, #fde68a 0%, #fbbf24 100%)'
                      : 'linear-gradient(to right, #fde68a, #fbbf24)',
                    opacity: 1,
                    height: isMobile ? 8 : 6,
                    borderRadius: isMobile ? 4 : 3,
                    ...(isMobile && {
                      boxShadow: '0 1px 4px rgba(251,191,36,0.10)',
                    }),
                  },
                  '& .MuiSlider-track': {
                    background: isMobile
                      ? 'linear-gradient(90deg, #fbbf24 0%, #f59e42 100%)'
                      : 'linear-gradient(to right, #fbbf24, #f59e42)',
                    height: isMobile ? 8 : 6,
                    borderRadius: isMobile ? 4 : 3,
                    ...(isMobile && {
                      boxShadow: '0 1px 4px rgba(245,158,66,0.13)',
                    }),
                  },
                  '& .MuiSlider-valueLabel': {
                    background: '#f59e42',
                    color: '#fff',
                    borderRadius: isMobile ? '999px' : '6px',
                    fontWeight: isMobile ? 600 : 'bold',
                    fontSize: isMobile ? '0.9em' : '0.85em',
                    top: isMobile ? -42 : -30,
                    padding: isMobile ? '8px 14px' : '4px 10px',
                    boxShadow: isMobile
                      ? '0 3px 12px rgba(0,0,0,0.18)'
                      : '0 2px 6px rgba(0,0,0,0.10)',
                    zIndex: 100,
                    ...(isMobile && {
                      '::after': {
                        content: '""',
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        bottom: -6,
                        width: 0,
                        height: 0,
                        borderLeft: '6px solid transparent',
                        borderRight: '6px solid transparent',
                        borderTop: '6px solid #f59e42',
                      },
                    }),
                  },
                }}
                disableSwap
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceFilter;
