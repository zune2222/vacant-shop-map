import { ShopType } from "./VacantShop";

// 위치 상수 정의 (naver.maps.Position 대신 사용)
export type MapPosition =
  | "TOP_LEFT"
  | "TOP_CENTER"
  | "TOP_RIGHT"
  | "CENTER_LEFT"
  | "CENTER"
  | "CENTER_RIGHT"
  | "BOTTOM_LEFT"
  | "BOTTOM_CENTER"
  | "BOTTOM_RIGHT";

// 좌표 인터페이스 정의
export interface LatLngLiteral {
  lat: number;
  lng: number;
}

// Naver Maps API 타입 정의 (SSR 안전)
export interface NaverMapOptions {
  center: LatLngLiteral;
  zoom: number;
  minZoom?: number;
  maxZoom?: number;
  zoomControl?: boolean;
  zoomControlOptions?: {
    position: MapPosition;
  };
  mapTypeControl?: boolean;
  mapDataControl?: boolean;
  logoControl?: boolean;
  scaleControl?: boolean;
}

/**
 * 지도 마커 인터페이스 (개선됨)
 */
export interface MapMarker {
  id: string; // 상가 ID
  position: {
    lat: number;
    lng: number;
  };
  shopType: ShopType | "cluster"; // 클러스터 타입 추가
  isActive: boolean;
  name: string; // 상가명
  monthlyRent: number; // 임대료 (마커에서 빠른 정보 표시용)
  isCluster?: boolean; // 클러스터 마커인지 여부
  pointCount?: number; // 클러스터에 포함된 마커 개수
}

/**
 * 지도 상태 인터페이스
 */
export interface MapState {
  mapInstance: any | null; // naver.maps.Map 대신 any 사용
  isMapLoaded: boolean;
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  markers: MapMarker[];
  selectedMarkerId: string | null;
}

/**
 * 지도 클러스터링 옵션
 */
export interface ClusterOptions {
  maxZoom: number;
  gridSize: number;
  minimumClusterSize: number;
}

/**
 * 지도 이벤트 타입들
 */
export type MapEventType =
  | "click"
  | "zoom_changed"
  | "center_changed"
  | "bounds_changed";

export interface MapEventHandler {
  (event: any): void;
}

// 부산 지역 좌표 (기본값)
export const DEFAULT_MAP_CENTER: LatLngLiteral = {
  lat: 35.22889,
  lng: 129.0813095,
};

export const DEFAULT_MAP_OPTIONS: NaverMapOptions = {
  center: DEFAULT_MAP_CENTER,
  zoom: 15, // 줌 레벨 15
  minZoom: 10,
  maxZoom: 20,
  zoomControl: true,
  zoomControlOptions: {
    position: "TOP_RIGHT",
  },
  mapTypeControl: false,
  mapDataControl: false,
  logoControl: true,
  scaleControl: false,
};

/**
 * 기본 클러스터 옵션
 */
export const DEFAULT_CLUSTER_OPTIONS: ClusterOptions = {
  maxZoom: 17, // 클러스터링 최대 줌 레벨
  gridSize: 60, // 클러스터 그리드 크기
  minimumClusterSize: 2, // 최소 클러스터 크기
};

/**
 * 지도 줌 레벨별 권장 사용처
 */
export const ZOOM_LEVELS = {
  COUNTRY: 6, // 국가 레벨
  PROVINCE: 8, // 도/시 레벨
  CITY: 12, // 시/군 레벨
  DISTRICT: 15, // 구/동 레벨
  STREET: 18, // 거리 레벨
} as const;

/**
 * MapPosition을 naver.maps.Position으로 변환하는 유틸리티 함수
 * 클라이언트에서만 사용
 */
export const getNaverMapPosition = (position: MapPosition): any => {
  if (typeof window === "undefined" || !window.naver) {
    return position; // SSR에서는 문자열 그대로 반환
  }

  const positionMap: Record<MapPosition, any> = {
    TOP_LEFT: window.naver.maps.Position.TOP_LEFT,
    TOP_CENTER: window.naver.maps.Position.TOP_CENTER,
    TOP_RIGHT: window.naver.maps.Position.TOP_RIGHT,
    CENTER_LEFT: window.naver.maps.Position.CENTER_LEFT,
    CENTER: window.naver.maps.Position.CENTER,
    CENTER_RIGHT: window.naver.maps.Position.CENTER_RIGHT,
    BOTTOM_LEFT: window.naver.maps.Position.BOTTOM_LEFT,
    BOTTOM_CENTER: window.naver.maps.Position.BOTTOM_CENTER,
    BOTTOM_RIGHT: window.naver.maps.Position.BOTTOM_RIGHT,
  };

  return positionMap[position] || window.naver.maps.Position.TOP_RIGHT;
};
