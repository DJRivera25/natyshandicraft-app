'use client';

import React from 'react';
import { Range, getTrackBackground } from 'react-range';

export interface IThumbProps {
  key: number;
  style: React.CSSProperties;
  tabIndex?: number;
  'aria-label': string;
  'aria-labelledby': string;
  'aria-valuemax': number;
  'aria-valuemin': number;
  'aria-valuenow': number;
  draggable: boolean;
  role: string;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onKeyUp: (e: React.KeyboardEvent) => void;
} // copy paste from react-range interface

export interface IRenderThumbParams {
  props: IThumbProps;
  value: number;
  index: number;
  isDragged: boolean;
} // copy paste from react-range interface

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
  return (
    <div className="w-full px-2 py-4">
      <Range
        values={values}
        step={step}
        min={min}
        max={max}
        onChange={(vals) => onChange([vals[0], vals[1]])}
        renderTrack={({ props, children }) => (
          <div
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            className="w-full h-10 flex items-center"
          >
            <div
              ref={props.ref}
              className="w-full h-2 rounded bg-amber-100 relative"
              style={{
                background: getTrackBackground({
                  values,
                  colors: ['#fcd34d', '#f59e0b', '#fcd34d'],
                  min,
                  max,
                }),
              }}
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={(params: IRenderThumbParams) => (
          <div
            {...params.props}
            key={params.index} // ✅ Key applied correctly
            className="h-4 w-4 rounded-full bg-amber-500 shadow cursor-pointer relative flex items-center justify-center"
          >
            <div className="absolute top-5 text-xs text-amber-800 font-medium whitespace-nowrap">
              ₱{params.value}
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default PriceRangeSlider;
