"use client";

import { useBottomSheetStore } from "@/store/bottomSheetStore";

export default function TestButton() {
  const { openSheet } = useBottomSheetStore();

  const handleTestBottomSheet = () => {
    console.log("🧪 Test button clicked - opening bottom sheet");
    openSheet("test-shop-123");
  };

  return (
    <button
      onClick={handleTestBottomSheet}
      className="absolute top-4 right-4 z-30 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg font-medium hover:bg-blue-700 transition-colors"
    >
      🧪 바텀시트 테스트
    </button>
  );
}
