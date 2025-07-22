"use client";

import { ShopType } from "@/types";

interface ShopTypeSelectorProps {
  selected: ShopType[];
  onChange: (types: ShopType[]) => void;
}

const SHOP_TYPE_OPTIONS: Array<{
  value: ShopType;
  label: string;
  icon: string;
}> = [
  { value: "restaurant", label: "음식점", icon: "🍽️" },
  { value: "retail", label: "소매", icon: "🛍️" },
  { value: "office", label: "사무실", icon: "🏢" },
  { value: "etc", label: "기타", icon: "📦" },
];

export default function ShopTypeSelector({
  selected,
  onChange,
}: ShopTypeSelectorProps) {
  const handleToggle = (type: ShopType) => {
    const newSelected = selected.includes(type)
      ? selected.filter((t) => t !== type)
      : [...selected, type];
    onChange(newSelected);
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {SHOP_TYPE_OPTIONS.map((option) => {
        const isSelected = selected.includes(option.value);

        return (
          <button
            key={option.value}
            onClick={() => handleToggle(option.value)}
            className={`
              flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-all
              ${
                isSelected
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
              }
            `}
            type="button"
          >
            <span className="text-xl">{option.icon}</span>
            <span className="text-sm font-medium">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
