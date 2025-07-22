"use client";

import { useState, useRef, useEffect } from "react";

interface RegionSearchProps {
  value?: string;
  onChange: (region: string) => void;
}

const REGION_SUGGESTIONS = [
  "강남구",
  "서초구",
  "송파구",
  "강동구",
  "마포구",
  "용산구",
  "성동구",
  "광진구",
  "종로구",
  "중구",
  "서대문구",
  "은평구",
  "노원구",
  "도봉구",
  "강북구",
  "성북구",
  "동대문구",
  "중랑구",
  "영등포구",
  "구로구",
  "금천구",
  "관악구",
  "동작구",
  "양천구",
  "강서구",
];

export default function RegionSearch({
  value = "",
  onChange,
}: RegionSearchProps) {
  const [inputValue, setInputValue] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (inputValue) {
      const filtered = REGION_SUGGESTIONS.filter((region) =>
        region.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions(REGION_SUGGESTIONS);
    }
  }, [inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    onChange(suggestion);
    setShowSuggestions(false);
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    // Delay to allow click on suggestions
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const handleClear = () => {
    setInputValue("");
    onChange("");
    inputRef.current?.focus();
  };

  const handleApply = () => {
    onChange(inputValue);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder="지역을 검색하세요 (예: 강남구)"
          className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <div className="absolute inset-y-0 right-0 flex items-center">
          {inputValue && (
            <button
              onClick={handleClear}
              className="px-2 text-gray-400 hover:text-gray-600"
              type="button"
            >
              <svg
                className="w-4 h-4"
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
          )}

          <button
            onClick={handleApply}
            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 border-l border-gray-300"
            type="button"
          >
            적용
          </button>
        </div>
      </div>

      {showSuggestions && (
        <div
          ref={suggestionRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto"
        >
          {filteredSuggestions.length === 0 ? (
            <div className="px-3 py-2 text-gray-500">검색 결과가 없습니다</div>
          ) : (
            filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-3 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
                type="button"
              >
                {suggestion}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
