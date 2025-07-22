"use client";

import { useState } from "react";
import { MapFilter, ShopType } from "@/types";
import RangeSlider from "./RangeSlider";
import ShopTypeSelector from "./ShopTypeSelector";
import RegionSearch from "./RegionSearch";

interface FilterPanelProps {
  initialFilters: MapFilter;
  onApplyFilters: (filters: MapFilter) => void;
  onClose: () => void;
}

export default function FilterPanel({
  initialFilters,
  onApplyFilters,
  onClose,
}: FilterPanelProps) {
  const [filters, setFilters] = useState<MapFilter>(initialFilters);

  const handleRentChange = (range: [number, number]) => {
    setFilters((prev) => ({ ...prev, rentRange: range }));
  };

  const handleAreaChange = (range: [number, number]) => {
    setFilters((prev) => ({ ...prev, areaRange: range }));
  };

  const handleShopTypesChange = (types: ShopType[]) => {
    setFilters((prev) => ({ ...prev, shopTypes: types }));
  };

  const handleRegionChange = (region: string) => {
    setFilters((prev) => ({ ...prev, region: region || undefined }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    const defaultFilters: MapFilter = {
      rentRange: [0, 1000],
      areaRange: [0, 100],
      shopTypes: ["restaurant", "retail", "office", "etc"] as ShopType[],
      region: undefined,
    };
    setFilters(defaultFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg space-y-6 max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">필터</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 p-1"
          aria-label="닫기"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-3">월 임대료 범위</h3>
          <RangeSlider
            min={0}
            max={1000}
            step={10}
            value={filters.rentRange}
            onChange={handleRentChange}
            formatValue={(value) => `${value}만원`}
          />
        </div>

        <div>
          <h3 className="font-medium mb-3">면적 범위</h3>
          <RangeSlider
            min={0}
            max={100}
            step={1}
            value={filters.areaRange}
            onChange={handleAreaChange}
            formatValue={(value) => `${value}평`}
          />
        </div>

        <div>
          <h3 className="font-medium mb-3">상가 유형</h3>
          <ShopTypeSelector
            selected={filters.shopTypes}
            onChange={handleShopTypesChange}
          />
        </div>

        <div>
          <h3 className="font-medium mb-3">지역 검색</h3>
          <RegionSearch value={filters.region} onChange={handleRegionChange} />
        </div>
      </div>

      <div className="flex space-x-2 pt-4 border-t border-gray-200">
        <button
          onClick={handleReset}
          className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          초기화
        </button>
        <button
          onClick={handleApply}
          className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          적용하기
        </button>
      </div>
    </div>
  );
}
