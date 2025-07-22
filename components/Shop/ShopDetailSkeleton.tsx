interface ShopDetailSkeletonProps {
  className?: string;
}

export default function ShopDetailSkeleton({
  className = "",
}: ShopDetailSkeletonProps) {
  return (
    <div className={`space-y-4 animate-pulse ${className}`}>
      {/* 상점 이름 */}
      <div className="h-7 bg-gray-200 rounded-lg w-3/4"></div>

      {/* 이미지 갤러리 */}
      <div className="space-y-3">
        <div className="h-48 bg-gray-200 rounded-lg"></div>
        <div className="flex space-x-2 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0"
            />
          ))}
        </div>
      </div>

      {/* 기본 정보 섹션 */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>

      {/* 구분선 */}
      <div className="border-t border-gray-100 pt-4">
        {/* 상세 설명 섹션 */}
        <div className="space-y-3">
          <div className="h-5 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>

      {/* 구분선 */}
      <div className="border-t border-gray-100 pt-4">
        {/* 연락처 섹션 */}
        <div className="space-y-3">
          <div className="h-5 bg-gray-200 rounded w-1/3"></div>
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-20"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
}

/**
 * 간단한 상점 카드 스켈레톤 (리스트용)
 */
export function ShopCardSkeleton({ className = "" }: ShopDetailSkeletonProps) {
  return (
    <div
      className={`p-4 bg-white rounded-lg shadow-sm animate-pulse ${className}`}
    >
      <div className="flex space-x-3">
        {/* 썸네일 이미지 */}
        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>

        {/* 내용 */}
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="flex justify-between">
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 여러 상점 카드 스켈레톤 (스태거드 애니메이션)
 */
export function ShopListSkeleton({
  count = 5,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          style={{ animationDelay: `${index * 150}ms` }}
          className="animate-pulse"
        >
          <ShopCardSkeleton />
        </div>
      ))}
    </div>
  );
}
