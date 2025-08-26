import { ShopType } from "./VacantShop";
import { BottomSheetHeight } from "./BottomSheet";

/**
 * 공실 상가 관련 타입들
 */
export type {
  VacantShop,
  EnhancedVacantShop,
  ShopType,
  Contact,
  CreateVacantShopData,
  UpdateVacantShopData,
} from "./VacantShop";

export { 
  SHOP_TYPE_LABELS, 
  SHOP_TYPE_COLORS, 
  SHOP_TYPE_GROUPS 
} from "./VacantShop";

/**
 * 상권 분석 관련 타입들
 */
export type {
  FootTraffic,
  MarketCharacteristics,
  NearbyBusinesses,
  BusinessSuccessStats,
  MarketPrice,
  MarketAnalysis,
  AnalysisMetrics,
} from "./MarketAnalysis";

export { AREA_TYPE_LABELS } from "./MarketAnalysis";

/**
 * 추천 시스템 관련 타입들
 */
export type {
  BusinessTypeRecommendation,
  RentRecommendation,
  ComprehensiveRecommendation,
  RecommendationWeights,
  RiskAssessment,
  SeasonalAnalysis,
  RecommendationFilters,
  BusinessTypeAnalysis,
} from "./Recommendation";

/**
 * 지도 필터 관련 타입들
 */
export type { MapFilter, FilterFunction } from "./MapFilter";

export {
  DEFAULT_FILTER,
  RENT_RANGE_PRESETS,
  AREA_RANGE_PRESETS,
  isDefaultFilter,
} from "./MapFilter";

/**
 * 바텀시트 관련 타입들
 */
export type {
  BottomSheetHeight,
  BottomSheetState,
  BottomSheetActions,
  BottomSheetGesture,
} from "./BottomSheet";

export {
  INITIAL_BOTTOM_SHEET_STATE,
  BOTTOM_SHEET_HEIGHT_CLASSES,
  BOTTOM_SHEET_HEIGHT_VALUES,
  BOTTOM_SHEET_THRESHOLDS,
} from "./BottomSheet";

/**
 * 지도 관련 타입들
 */
export type {
  NaverMapOptions,
  MapMarker,
  MapState,
  ClusterOptions,
  MapEventType,
  MapEventHandler,
  MapPosition,
  LatLngLiteral,
} from "./map";

export {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_OPTIONS,
  DEFAULT_CLUSTER_OPTIONS,
  ZOOM_LEVELS,
  getNaverMapPosition,
} from "./map";

// 타입 가드 함수들
export const isValidShopType = (type: string): type is ShopType => {
  const validTypes: ShopType[] = [
    // 음식점
    "korean_restaurant", "chinese_restaurant", "japanese_restaurant", "western_restaurant",
    "fastfood", "cafe", "bakery", "chicken", "pizza", "pub",
    // 소매업  
    "convenience_store", "clothing", "cosmetics", "electronics", "pharmacy",
    "supermarket", "bookstore", "toy_store", "flower_shop",
    // 서비스업
    "hair_salon", "nail_salon", "fitness", "laundry", "repair_shop",
    "real_estate", "insurance", "bank", "clinic",
    // 업무공간
    "office", "coworking", "academy", "consulting",
    // 기타
    "etc"
  ];
  return validTypes.includes(type as ShopType);
};

export const isValidBottomSheetHeight = (
  height: string
): height is BottomSheetHeight => {
  return ["collapsed", "partial", "full"].includes(height);
};
