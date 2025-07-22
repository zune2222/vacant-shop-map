"use client";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBackClick?: () => void;
  rightAction?: React.ReactNode;
}

export default function Header({
  title = "공실 상가 지도",
  showBack = false,
  onBackClick,
  rightAction,
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 safe-area-inset">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left section */}
        <div className="flex items-center">
          {showBack && (
            <button
              onClick={onBackClick}
              className="mr-3 p-2 -ml-2 rounded-lg hover:bg-gray-100 touch-manipulation"
              aria-label="뒤로가기"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}
          <h1 className="text-lg font-semibold text-gray-900 truncate">
            {title}
          </h1>
        </div>

        {/* Right section */}
        <div className="flex items-center">{rightAction}</div>
      </div>
    </header>
  );
}
