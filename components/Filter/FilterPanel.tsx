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
    <div className="bg-white p-6 rounded-2xl space-y-6 max-h-[80vh] overflow-y-auto shadow-2xl animate-slide-up">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">필터</h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 touch-target transition-all duration-200"
          aria-label="닫기"
        >
          <svg
            className="w-6 h-6"
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

      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-[#6E62F6]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <h3 className="font-semibold text-gray-900">월 임대료 범위</h3>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            <RangeSlider
              min={0}
              max={1000}
              step={10}
              value={filters.rentRange}
              onChange={handleRentChange}
              formatValue={(value) => `${value}만원`}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-[#6E62F6]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z"/>
            </svg>
            <h3 className="font-semibold text-gray-900">면적 범위</h3>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            <RangeSlider
              min={0}
              max={100}
              step={1}
              value={filters.areaRange}
              onChange={handleAreaChange}
              formatValue={(value) => `${value}평`}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-[#6E62F6]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <h3 className="font-semibold text-gray-900">상가 유형</h3>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            <ShopTypeSelector
              selected={filters.shopTypes}
              onChange={handleShopTypesChange}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-[#6E62F6]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <h3 className="font-semibold text-gray-900">지역 검색</h3>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            <RegionSearch value={filters.region} onChange={handleRegionChange} />
          </div>
        </div>
      </div>

      <div className="flex space-x-3 pt-6 border-t border-gray-100">
        <button
          onClick={handleReset}
          className="btn-secondary flex-1"
        >
          초기화
        </button>
        <button
          onClick={handleApply}
          className="btn-primary flex-1"
        >
          적용하기
        </button>
      </div>
    </div>
  );
}
