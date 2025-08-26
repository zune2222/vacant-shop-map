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
    <header className="bg-white border-b border-gray-100 safe-area-inset shadow-soft">
      <div className="container-mobile">
        <div className="flex items-center justify-between h-16 px-4 sm:px-0">
          {/* Left section */}
          <div className="flex items-center">
            {showBack && (
              <button
                onClick={onBackClick}
                className="mr-3 p-2 -ml-2 rounded-xl hover:bg-gray-50 touch-target touch-manipulation transition-colors duration-200"
                aria-label="뒤로가기"
              >
                <svg
                  className="w-6 h-6 text-gray-700"
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
            <div className="flex items-center space-x-3">
              {/* Logo/Icon placeholder */}
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <svg 
                  className="w-5 h-5 text-white" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 7V17C2 17.5523 2.44772 18 3 18H9V12H15V18H21C21.5523 18 22 17.5523 22 17V7L12 2Z"/>
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900 truncate text-balance">
                {title}
              </h1>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-2">{rightAction}</div>
        </div>
      </div>
    </header>
  );
}
