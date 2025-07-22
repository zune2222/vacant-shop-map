interface MapLoadingSkeletonProps {
  className?: string;
  showControls?: boolean;
}

export default function MapLoadingSkeleton({
  className = "",
  showControls = true,
}: MapLoadingSkeletonProps) {
  return (
    <div
      className={`relative w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 ${className}`}
    >
      {/* 중앙 로딩 스피너 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            {/* 메인 스피너 */}
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>

            {/* 펄스 효과 */}
            <div className="absolute inset-0 w-16 h-16 border-4 border-blue-100 rounded-full animate-ping opacity-25"></div>
          </div>

          <p className="mt-4 text-gray-600 font-medium">
            지도를 불러오는 중...
          </p>
          <p className="mt-1 text-sm text-gray-400">잠시만 기다려주세요</p>
        </div>
      </div>

      {/* 가상 지도 그리드 패턴 */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
          {Array.from({ length: 48 }).map((_, i) => (
            <div
              key={i}
              className="border border-gray-300 animate-pulse"
              style={{ animationDelay: `${i * 50}ms` }}
            />
          ))}
        </div>
      </div>

      {/* 지도 컨트롤 스켈레톤 */}
      {showControls && (
        <>
          {/* 줌 컨트롤 */}
          <div className="absolute top-4 right-4 space-y-1">
            <div className="w-10 h-10 bg-white rounded shadow-lg animate-pulse"></div>
            <div className="w-10 h-10 bg-white rounded shadow-lg animate-pulse"></div>
          </div>

          {/* 필터 버튼 */}
          <div className="absolute top-4 right-20">
            <div className="w-12 h-12 bg-white rounded-full shadow-lg animate-pulse"></div>
          </div>

          {/* 현재 위치 버튼 */}
          <div className="absolute bottom-24 right-4">
            <div className="w-12 h-12 bg-white rounded-full shadow-lg animate-pulse"></div>
          </div>

          {/* 상가 카운터 */}
          <div className="absolute bottom-4 left-4 w-48 h-20 bg-white rounded-lg shadow-lg animate-pulse"></div>
        </>
      )}

      {/* 가상 마커들 */}
      <div className="absolute inset-0">
        {/* 로딩 중인 마커 표현 */}
        <div className="absolute top-1/3 left-1/4 w-6 h-6 bg-blue-300 rounded-full animate-ping opacity-60"></div>
        <div
          className="absolute top-1/2 right-1/3 w-6 h-6 bg-blue-300 rounded-full animate-ping opacity-40"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/3 w-6 h-6 bg-blue-300 rounded-full animate-ping opacity-50"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-2/3 right-1/4 w-6 h-6 bg-blue-300 rounded-full animate-ping opacity-30"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>
    </div>
  );
}

/**
 * 간단한 지도 로딩 상태 (미니멀)
 */
export function MapLoadingSimple({
  className = "",
}: Pick<MapLoadingSkeletonProps, "className">) {
  return (
    <div
      className={`w-full h-full bg-gray-100 flex items-center justify-center ${className}`}
    >
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-3 text-gray-600">로딩 중...</p>
      </div>
    </div>
  );
}

/**
 * 지도 초기화 스켈레톤 (스크립트 로딩 중)
 */
export function MapInitializingSkeleton({
  className = "",
}: Pick<MapLoadingSkeletonProps, "className">) {
  return (
    <div
      className={`w-full h-full bg-gray-50 flex items-center justify-center ${className}`}
    >
      <div className="text-center">
        {/* 로딩 바 */}
        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto mb-4">
          <div
            className="h-full bg-blue-500 rounded-full animate-pulse"
            style={{ width: "60%" }}
          ></div>
        </div>

        <p className="text-gray-600 font-medium">지도 서비스 초기화 중...</p>
        <p className="text-sm text-gray-400 mt-1">Naver Maps API 로딩</p>
      </div>
    </div>
  );
}

/**
 * 지도 에러 상태 (로딩 실패)
 */
export function MapLoadingError({
  className = "",
  onRetry,
}: Pick<MapLoadingSkeletonProps, "className"> & {
  onRetry?: () => void;
}) {
  return (
    <div
      className={`w-full h-full bg-red-50 flex items-center justify-center ${className}`}
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <p className="text-red-700 font-medium">지도를 불러올 수 없습니다</p>
        <p className="text-sm text-red-500 mt-1">
          네트워크 연결을 확인해주세요
        </p>

        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            다시 시도
          </button>
        )}
      </div>
    </div>
  );
}
