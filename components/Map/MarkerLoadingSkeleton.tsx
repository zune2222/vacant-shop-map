interface MarkerLoadingSkeletonProps {
  count?: number;
  className?: string;
  showClusters?: boolean;
}

export default function MarkerLoadingSkeleton({
  count = 8,
  className = "",
  showClusters = true,
}: MarkerLoadingSkeletonProps) {
  // 무작위 위치 생성 (시뮬레이션용)
  const markers = Array.from({ length: count }, (_, i) => ({
    id: i,
    top: Math.random() * 70 + 10, // 10% ~ 80%
    left: Math.random() * 70 + 10, // 10% ~ 80%
    delay: i * 200, // 스태거드 애니메이션
  }));

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {/* 개별 마커 스켈레톤 */}
      {markers.map((marker) => (
        <div
          key={marker.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{
            top: `${marker.top}%`,
            left: `${marker.left}%`,
            animationDelay: `${marker.delay}ms`,
          }}
        >
          <div className="relative">
            {/* 메인 마커 */}
            <div className="w-6 h-6 bg-blue-300 rounded-full animate-pulse shadow-lg border-2 border-white">
              <div className="absolute inset-1 bg-blue-400 rounded-full animate-ping opacity-75"></div>
            </div>

            {/* 마커 꼬리 */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-blue-300"></div>
          </div>
        </div>
      ))}

      {/* 클러스터 스켈레톤 */}
      {showClusters && (
        <>
          {/* 대형 클러스터 */}
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
            style={{ top: "30%", left: "65%" }}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-orange-300 rounded-full shadow-lg border-3 border-white flex items-center justify-center">
                <span className="text-xs font-bold text-white animate-pulse">
                  ●●●
                </span>
              </div>
              <div className="absolute inset-0 w-10 h-10 bg-orange-200 rounded-full animate-ping opacity-50"></div>
            </div>
          </div>

          {/* 중형 클러스터 */}
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
            style={{ top: "70%", left: "25%", animationDelay: "500ms" }}
          >
            <div className="relative">
              <div className="w-8 h-8 bg-green-300 rounded-full shadow-lg border-2 border-white flex items-center justify-center">
                <span className="text-xs font-bold text-white animate-pulse">
                  ●●
                </span>
              </div>
              <div className="absolute inset-0 w-8 h-8 bg-green-200 rounded-full animate-ping opacity-50"></div>
            </div>
          </div>
        </>
      )}

      {/* 로딩 인디케이터 (우하단) */}
      <div className="absolute bottom-20 right-4 bg-white rounded-lg shadow-lg p-2 animate-pulse">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-gray-600">마커 로딩 중...</span>
        </div>
      </div>
    </div>
  );
}

/**
 * 간단한 마커 로딩 상태
 */
export function SimpleMarkerLoading({
  className = "",
}: Pick<MarkerLoadingSkeletonProps, "className">) {
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center pointer-events-none ${className}`}
    >
      <div className="bg-white rounded-lg shadow-lg p-4 animate-pulse">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-gray-600">
            상가 위치를 표시하는 중...
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * 클러스터링 진행 상태
 */
export function ClusteringProgress({
  progress = 0,
  total = 100,
  className = "",
}: {
  progress?: number;
  total?: number;
  className?: string;
}) {
  const percentage = Math.min((progress / total) * 100, 100);

  return (
    <div
      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${className}`}
    >
      <div className="bg-white rounded-lg shadow-xl p-6 min-w-64">
        <div className="text-center">
          <div className="mb-4">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          </div>

          <h3 className="text-lg font-medium text-gray-900 mb-2">
            마커 처리 중
          </h3>

          <p className="text-sm text-gray-600 mb-4">
            {progress}개 / {total}개 상가 위치 표시
          </p>

          {/* 프로그레스 바 */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

          <p className="text-xs text-gray-500">{percentage.toFixed(1)}% 완료</p>
        </div>
      </div>
    </div>
  );
}

/**
 * 마커 에러 상태
 */
export function MarkerLoadingError({
  onRetry,
  className = "",
}: {
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      className={`absolute top-4 left-1/2 transform -translate-x-1/2 ${className}`}
    >
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 shadow-lg">
        <div className="flex items-center space-x-2">
          <svg
            className="w-5 h-5 text-red-500"
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
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">마커 로딩 실패</p>
            <p className="text-xs text-red-600">
              상가 위치를 표시할 수 없습니다
            </p>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
            >
              재시도
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
