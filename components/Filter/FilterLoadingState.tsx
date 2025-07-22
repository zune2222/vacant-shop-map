"use client";

interface FilterLoadingStateProps {
  message?: string;
}

export default function FilterLoadingState({
  message = "필터를 적용하는 중...",
}: FilterLoadingStateProps) {
  return (
    <div className="absolute inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 flex items-center space-x-3">
        {/* Spinner */}
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

        {/* Message */}
        <span className="text-gray-700 font-medium">{message}</span>
      </div>
    </div>
  );
}
