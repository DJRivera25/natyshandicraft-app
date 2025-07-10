'use client';

import React from 'react';

interface PriceRangeSliderProps {
  values: [number, number];
  onChange: (range: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  values,
  onChange,
  min = 0,
  max = 10000,
  step = 10,
}) => {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Number(e.target.value);
    onChange([newMin, Math.max(newMin, values[1])]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Number(e.target.value);
    onChange([Math.min(values[0], newMax), newMax]);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>₱{values[0].toLocaleString()}</span>
        <span>₱{values[1].toLocaleString()}</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 w-8">Min:</span>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={values[0]}
            onChange={handleMinChange}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 w-8">Max:</span>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={values[1]}
            onChange={handleMaxChange}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #f59e0b;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #f59e0b;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-webkit-slider-track {
          background: linear-gradient(
            to right,
            #fcd34d 0%,
            #f59e0b 50%,
            #fcd34d 100%
          );
          height: 8px;
          border-radius: 4px;
        }

        .slider::-moz-range-track {
          background: linear-gradient(
            to right,
            #fcd34d 0%,
            #f59e0b 50%,
            #fcd34d 100%
          );
          height: 8px;
          border-radius: 4px;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default PriceRangeSlider;
