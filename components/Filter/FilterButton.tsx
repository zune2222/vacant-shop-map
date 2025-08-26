"use client";

interface FilterButtonProps {
  onClick: () => void;
  hasActiveFilters?: boolean;
}

export default function FilterButton({
  onClick,
  hasActiveFilters = false,
}: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        absolute top-4 right-4 z-10 touch-target
        bg-white shadow-brand rounded-2xl p-4
        border border-gray-100
        hover:bg-gray-50 active:bg-gray-100
        transition-all duration-200 animate-scale-in
        ${hasActiveFilters ? "ring-2 ring-[#6E62F6] shadow-lg" : "shadow-soft"}
      `}
      aria-label="필터 열기"
    >
      <div className="relative">
        <svg
          className={`w-6 h-6 transition-colors duration-200 ${
            hasActiveFilters ? "text-[#6E62F6]" : "text-gray-700"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        {hasActiveFilters && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#6E62F6] rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
    </button>
  );
}
