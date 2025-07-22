import apiClient from "./axios";
import { vacantShopService } from "./vacantShopService";

/**
 * API 클라이언트 및 에러 타입
 */
export { default as apiClient } from "./axios";
export type { ApiResponse, ApiError } from "./axios";

/**
 * 공실 상가 API 서비스
 */
export {
  VacantShopService,
  vacantShopService,
  getShops,
  getShopById,
  clearShopCache,
} from "./vacantShopService";

export type {
  VacantShopQueryOptions,
  PaginatedResponse,
} from "./vacantShopService";

/**
 * API 관련 상수
 */
export const API_ENDPOINTS = {
  SHOPS: "/shops",
  SHOP_BY_ID: (id: string) => `/shops/${id}`,
  // 향후 추가될 엔드포인트들
  REGIONS: "/regions",
  SHOP_TYPES: "/shop-types",
} as const;

/**
 * API 설정 확인 유틸리티
 */
export const getApiConfig = () => ({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  useMockData:
    process.env.NODE_ENV === "development" ||
    !process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true",
  nodeEnv: process.env.NODE_ENV,
});

/**
 * API 헬스체크 함수
 */
export const healthCheck = async (): Promise<boolean> => {
  try {
    const config = getApiConfig();
    if (config.useMockData) {
      console.log("🔧 Using mock data - skipping health check");
      return true;
    }

    const response = await apiClient.get("/health");
    return response.status === 200;
  } catch (error) {
    console.warn("⚠️ API health check failed:", error);
    return false;
  }
};

/**
 * 모든 API 캐시 초기화
 */
export const clearAllCache = () => {
  vacantShopService.clearCache();
  console.log("🗑️ All API caches cleared");
};
