interface FilterSkeletonProps {
  className?: string;
}

export default function FilterSkeleton({
  className = "",
}: FilterSkeletonProps) {
  return (
    <div
      className={`bg-white p-4 rounded-lg space-y-6 animate-pulse ${className}`}
    >
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-200 rounded w-16"></div>
        <div className="w-5 h-5 bg-gray-200 rounded"></div>
      </div>

      {/* 임대료 범위 필터 */}
      <div className="space-y-3">
        <div className="h-5 bg-gray-200 rounded w-24"></div>
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded-full"></div>
          <div className="flex justify-between">
            <div className="h-3 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>

      {/* 면적 범위 필터 */}
      <div className="space-y-3">
        <div className="h-5 bg-gray-200 rounded w-20"></div>
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded-full"></div>
          <div className="flex justify-between">
            <div className="h-3 bg-gray-200 rounded w-12"></div>
            <div className="h-3 bg-gray-200 rounded w-12"></div>
          </div>
        </div>
      </div>

      {/* 상가 유형 필터 */}
      <div className="space-y-3">
        <div className="h-5 bg-gray-200 rounded w-20"></div>
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-10 bg-gray-200 rounded-lg"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      </div>

      {/* 지역 검색 필터 */}
      <div className="space-y-3">
        <div className="h-5 bg-gray-200 rounded w-20"></div>
        <div className="h-12 bg-gray-200 rounded-lg"></div>
      </div>

      {/* 버튼 그룹 */}
      <div className="flex space-x-2 pt-2">
        <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
        <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
}

/**
 * 필터 옵션들의 스켈레톤
 */
export function FilterOptionsSkeleton({ className = "" }: FilterSkeletonProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* 슬라이더 스켈레톤 */}
      <div className="space-y-2 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-2 bg-gray-200 rounded-full"></div>
        <div className="flex justify-between">
          <div className="h-3 bg-gray-200 rounded w-12"></div>
          <div className="h-3 bg-gray-200 rounded w-12"></div>
        </div>
      </div>

      {/* 토글 버튼들 스켈레톤 */}
      <div className="space-y-2 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-8 bg-gray-200 rounded-full w-16"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * 검색 입력 스켈레톤
 */
export function SearchInputSkeleton({ className = "" }: FilterSkeletonProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="relative">
        <div className="h-12 bg-gray-200 rounded-lg"></div>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}

/**
 * 필터 적용 중 스켈레톤
 */
export function FilterApplyingSkeleton({
  className = "",
}: FilterSkeletonProps) {
  return (
    <div className={`bg-white p-6 rounded-lg text-center ${className}`}>
      <div className="animate-pulse space-y-4">
        {/* 스피너 */}
        <div className="flex justify-center">
          <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
        </div>

        {/* 텍스트 */}
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 rounded w-32 mx-auto"></div>
          <div className="h-3 bg-gray-200 rounded w-40 mx-auto"></div>
        </div>

        {/* 프로그레스 바 */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full animate-pulse"
            style={{ width: "60%" }}
          ></div>
        </div>
      </div>
    </div>
  );
}

/**
 * 필터 결과 카운트 스켈레톤
 */
export function FilterResultSkeleton({ className = "" }: FilterSkeletonProps) {
  return (
    <div
      className={`bg-white p-3 rounded-lg shadow-sm animate-pulse ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  );
}
