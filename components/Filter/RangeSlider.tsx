"use client";

import React, { useState, useEffect, useCallback } from "react";

interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (range: [number, number]) => void;
  formatValue?: (value: number) => string;
}

export default function RangeSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  formatValue = (val) => val.toString(),
}: RangeSliderProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMin = Math.max(
        min,
        Math.min(Number(e.target.value), localValue[1] - step)
      );
      const newRange: [number, number] = [newMin, localValue[1]];
      setLocalValue(newRange);
      onChange(newRange);
    },
    [min, step, localValue, onChange]
  );

  const handleMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMax = Math.min(
        max,
        Math.max(Number(e.target.value), localValue[0] + step)
      );
      const newRange: [number, number] = [localValue[0], newMax];
      setLocalValue(newRange);
      onChange(newRange);
    },
    [max, step, localValue, onChange]
  );

  const minPercent = ((localValue[0] - min) / (max - min)) * 100;
  const maxPercent = ((localValue[1] - min) / (max - min)) * 100;

  return (
    <div className="w-full space-y-4">
      <div className="relative h-6">
        {/* Track */}
        <div className="absolute top-3 w-full h-0.5 bg-gray-200 rounded" />

        {/* Active track */}
        <div
          className="absolute top-3 h-0.5 bg-blue-500 rounded"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />

        {/* Min handle */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[0]}
          onChange={handleMinChange}
          className="absolute w-full h-6 bg-transparent appearance-none pointer-events-none focus:outline-none slider-thumb-1"
          style={{ zIndex: 1 }}
        />

        {/* Max handle */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[1]}
          onChange={handleMaxChange}
          className="absolute w-full h-6 bg-transparent appearance-none pointer-events-none focus:outline-none slider-thumb-2"
          style={{ zIndex: 2 }}
        />
      </div>

      {/* Value labels */}
      <div className="flex justify-between text-sm text-gray-600">
        <span className="px-2 py-1 bg-gray-100 rounded">
          {formatValue(localValue[0])}
        </span>
        <span className="px-2 py-1 bg-gray-100 rounded">
          {formatValue(localValue[1])}
        </span>
      </div>

      {/* Custom styles for slider thumbs */}
      <style jsx>{`
        .slider-thumb-1::-webkit-slider-thumb,
        .slider-thumb-2::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: #3b82f6;
          border: 2px solid white;
          border-radius: 50%;
          cursor: pointer;
          pointer-events: all;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .slider-thumb-1::-moz-range-thumb,
        .slider-thumb-2::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #3b82f6;
          border: 2px solid white;
          border-radius: 50%;
          cursor: pointer;
          pointer-events: all;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}
