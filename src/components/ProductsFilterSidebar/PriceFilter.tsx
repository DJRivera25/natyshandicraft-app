'use client';

import React from 'react';
import { DollarSign, ChevronDown } from 'lucide-react';
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
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200/60 shadow-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-amber-50/50"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-gray-900">Price Range</span>
        </div>
        <div className={`${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </div>
      </button>

      {isExpanded && (
        <div className="px-5 pb-5">
          <div className="space-y-6">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              Price Range
            </label>
            <div
              className={`w-full ${isMobile ? 'pt-14' : 'pt-8'} pb-2 flex flex-col items-center`}
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
                valueLabelFormat={(v) => `₱${v.toLocaleString()}`}
                sx={{
                  color: '#f59e42',
                  height: isMobile ? 10 : 8,
                  padding: isMobile ? '40px 0 20px 0' : '30px 0',
                  '& .MuiSlider-thumb': {
                    height: isMobile ? 36 : 32,
                    width: isMobile ? 36 : 32,
                    backgroundColor: '#fff',
                    border: '4px solid #f59e42',
                    boxShadow: isMobile
                      ? '0 6px 24px rgba(0,0,0,0.13), 0 0 0 2px #fde68a'
                      : '0 4px 16px rgba(0,0,0,0.10)',
                    '&:hover, &.Mui-focusVisible': {
                      boxShadow: isMobile
                        ? '0 0 0 8px #fde68a, 0 6px 24px rgba(0,0,0,0.13)'
                        : '0 0 0 6px #fde68a',
                      borderColor: '#fbbf24',
                    },
                    ...(isMobile && {
                      '&:after': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        left: 8,
                        top: 8,
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        boxShadow: 'inset 0 2px 8px #fbbf24',
                        opacity: 0.15,
                      },
                    }),
                  },
                  '& .MuiSlider-rail': {
                    background: isMobile
                      ? 'linear-gradient(90deg, #fde68a 0%, #fbbf24 100%)'
                      : 'linear-gradient(to right, #fde68a, #fbbf24)',
                    opacity: 1,
                    height: isMobile ? 10 : 8,
                    borderRadius: isMobile ? 5 : 4,
                    ...(isMobile && {
                      boxShadow: '0 2px 8px rgba(251,191,36,0.10)',
                    }),
                  },
                  '& .MuiSlider-track': {
                    background: isMobile
                      ? 'linear-gradient(90deg, #fbbf24 0%, #f59e42 100%)'
                      : 'linear-gradient(to right, #fbbf24, #f59e42)',
                    height: isMobile ? 10 : 8,
                    borderRadius: isMobile ? 5 : 4,
                    ...(isMobile && {
                      boxShadow: '0 2px 8px rgba(245,158,66,0.13)',
                    }),
                  },
                  '& .MuiSlider-valueLabel': {
                    background: '#f59e42',
                    color: '#fff',
                    borderRadius: isMobile ? '999px' : '8px',
                    fontWeight: isMobile ? 700 : 'bold',
                    fontSize: isMobile ? '1.05em' : '0.95em',
                    top: isMobile ? -52 : -36,
                    padding: isMobile ? '10px 18px' : '6px 12px',
                    boxShadow: isMobile
                      ? '0 4px 16px rgba(0,0,0,0.18)'
                      : '0 2px 8px rgba(0,0,0,0.10)',
                    zIndex: 100,
                    ...(isMobile && {
                      '::after': {
                        content: '""',
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        bottom: -8,
                        width: 0,
                        height: 0,
                        borderLeft: '8px solid transparent',
                        borderRight: '8px solid transparent',
                        borderTop: '8px solid #f59e42',
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
