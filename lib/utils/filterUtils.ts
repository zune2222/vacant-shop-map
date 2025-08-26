import { VacantShop, MapFilter } from "@/types";

/**
 * 빈 상가 필터링 함수
 */
export function filterVacantShops(
  shops: VacantShop[],
  filter: MapFilter
): VacantShop[] {
  return shops.filter((shop) => {
    // 임대료 범위 필터
    if (
      shop.monthlyRent < filter.rentRange[0] ||
      shop.monthlyRent > filter.rentRange[1]
    ) {
      return false;
    }

    // 면적 범위 필터
    if (shop.area < filter.areaRange[0] || shop.area > filter.areaRange[1]) {
      return false;
    }

    // 상가 유형 필터
    if (
      filter.shopTypes.length > 0 &&
      !filter.shopTypes.includes(shop.shopType)
    ) {
      return false;
    }

    // 지역 필터
    if (filter.region && !shop.address.includes(filter.region)) {
      return false;
    }

    return true;
  });
}

/**
 * 필터가 기본값과 같은지 확인
 */
export function isDefaultFilter(
  filter: MapFilter,
  defaultFilter: MapFilter
): boolean {
  return (
    filter.rentRange[0] === defaultFilter.rentRange[0] &&
    filter.rentRange[1] === defaultFilter.rentRange[1] &&
    filter.areaRange[0] === defaultFilter.areaRange[0] &&
    filter.areaRange[1] === defaultFilter.areaRange[1] &&
    filter.shopTypes.length === defaultFilter.shopTypes.length &&
    filter.shopTypes.every((type) => defaultFilter.shopTypes.includes(type)) &&
    filter.region === defaultFilter.region
  );
}

/**
 * 두 필터가 같은지 비교
 */
export function areFiltersEqual(
  filter1: MapFilter,
  filter2: MapFilter
): boolean {
  return (
    filter1.rentRange[0] === filter2.rentRange[0] &&
    filter1.rentRange[1] === filter2.rentRange[1] &&
    filter1.areaRange[0] === filter2.areaRange[0] &&
    filter1.areaRange[1] === filter2.areaRange[1] &&
    filter1.shopTypes.length === filter2.shopTypes.length &&
    filter1.shopTypes.every((type) => filter2.shopTypes.includes(type)) &&
    filter1.region === filter2.region
  );
}

/**
 * 필터 요약 텍스트 생성
 */
export function getFilterSummary(filter: MapFilter): string {
  const parts: string[] = [];

  // 임대료 범위
  if (filter.rentRange[0] > 0 || filter.rentRange[1] < 1000) {
    parts.push(`임대료 ${filter.rentRange[0]}-${filter.rentRange[1]}만원`);
  }

  // 면적 범위
  if (filter.areaRange[0] > 0 || filter.areaRange[1] < 100) {
    parts.push(`면적 ${filter.areaRange[0]}-${filter.areaRange[1]}평`);
  }

  // 상가 유형
  if (filter.shopTypes.length < 4) {
    const typeLabels = filter.shopTypes.map((type) => {
      switch (type) {
        case "korean_restaurant":
          return "음식점";
        case "convenience_store":
          return "소매";
        case "office":
          return "사무실";
        case "etc":
          return "기타";
        default:
          return type;
      }
    });
    parts.push(`유형: ${typeLabels.join(", ")}`);
  }

  // 지역
  if (filter.region) {
    parts.push(`지역: ${filter.region}`);
  }

  return parts.length > 0 ? parts.join(" | ") : "전체";
}

/**
 * 필터에 맞는 상가 개수 계산
 */
export function getFilteredShopsCount(
  shops: VacantShop[],
  filter: MapFilter
): number {
  return filterVacantShops(shops, filter).length;
}

/**
 * 필터 성능 최적화를 위한 debounce 함수
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
