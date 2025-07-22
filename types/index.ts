import { ShopType } from "./VacantShop";
import { BottomSheetHeight } from "./BottomSheet";

/**
 * 공실 상가 관련 타입들
 */
export type {
  VacantShop,
  ShopType,
  Contact,
  CreateVacantShopData,
  UpdateVacantShopData,
} from "./VacantShop";

export { SHOP_TYPE_LABELS, SHOP_TYPE_COLORS } from "./VacantShop";

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
  return ["restaurant", "retail", "office", "etc"].includes(type);
};

export const isValidBottomSheetHeight = (
  height: string
): height is BottomSheetHeight => {
  return ["collapsed", "partial", "full"].includes(height);
};
