import { ShopType } from "./VacantShop";

/**
 * 지도 필터링 조건 인터페이스
 */
export interface MapFilter {
  rentRange: [number, number]; // 임대료 범위 [최소, 최대] (만원)
  areaRange: [number, number]; // 면적 범위 [최소, 최대] (평)
  shopTypes: ShopType[]; // 선택된 상가 유형들
  region?: string; // 지역 필터 (선택적)
}

/**
 * 필터 초기값
 */
export const DEFAULT_FILTER: MapFilter = {
  rentRange: [0, 1000], // 0~1000만원
  areaRange: [0, 100], // 0~100평
  shopTypes: [
    // 음식점 카테고리
    "korean_restaurant",
    "chinese_restaurant",
    "japanese_restaurant",
    "western_restaurant",
    "fastfood",
    "cafe",
    "bakery",
    "chicken",
    "pizza",
    "pub",
    // 소매업 카테고리
    "convenience_store",
    "clothing",
    "cosmetics",
    "electronics",
    "pharmacy",
    "supermarket",
    "bookstore",
    "toy_store",
    "flower_shop",
    // 서비스업 카테고리
    "hair_salon",
    "nail_salon",
    "fitness",
    "laundry",
    "repair_shop",
    "real_estate",
    "insurance",
    "bank",
    "clinic",
    // 업무공간 카테고리
    "office",
    "coworking",
    "academy",
    "consulting",
    // 기타
    "etc",
  ], // 모든 유형 선택
  region: undefined,
};

/**
 * 임대료 범위 프리셋
 */
export const RENT_RANGE_PRESETS: Array<{
  label: string;
  range: [number, number];
}> = [
  { label: "전체", range: [0, 1000] },
  { label: "50만원 이하", range: [0, 50] },
  { label: "50~100만원", range: [50, 100] },
  { label: "100~200만원", range: [100, 200] },
  { label: "200~300만원", range: [200, 300] },
  { label: "300만원 이상", range: [300, 1000] },
];

/**
 * 면적 범위 프리셋
 */
export const AREA_RANGE_PRESETS: Array<{
  label: string;
  range: [number, number];
}> = [
  { label: "전체", range: [0, 100] },
  { label: "10평 이하", range: [0, 10] },
  { label: "10~20평", range: [10, 20] },
  { label: "20~30평", range: [20, 30] },
  { label: "30~50평", range: [30, 50] },
  { label: "50평 이상", range: [50, 100] },
];

/**
 * 필터가 기본값인지 확인하는 유틸리티 함수
 */
export const isDefaultFilter = (filter: MapFilter): boolean => {
  return (
    filter.rentRange[0] === DEFAULT_FILTER.rentRange[0] &&
    filter.rentRange[1] === DEFAULT_FILTER.rentRange[1] &&
    filter.areaRange[0] === DEFAULT_FILTER.areaRange[0] &&
    filter.areaRange[1] === DEFAULT_FILTER.areaRange[1] &&
    filter.shopTypes.length === DEFAULT_FILTER.shopTypes.length &&
    filter.shopTypes.every((type) => DEFAULT_FILTER.shopTypes.includes(type)) &&
    !filter.region
  );
};

/**
 * 필터 적용 함수 타입
 */
export type FilterFunction<T> = (items: T[], filter: MapFilter) => T[];
