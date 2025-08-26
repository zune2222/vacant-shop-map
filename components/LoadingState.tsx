interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export default function LoadingState({
  message = "로딩 중...",
  size = "md",
}: LoadingStateProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 animate-fade-in">
      <div className={`${sizeClasses[size]} animate-spin`}>
        <svg
          className="w-full h-full text-[#6E62F6]"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      <div className="mt-6 text-center">
        <p className="text-lg font-medium text-gray-900 mb-2">{message}</p>
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-[#6E62F6] rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-[#6E62F6] rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-[#6E62F6] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}
