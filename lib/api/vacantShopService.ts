import { VacantShop, MapFilter } from "@/types";
import { SAMPLE_VACANT_SHOPS, filterVacantShops } from "@/lib/sampleData";
import apiClient, { ApiResponse, ApiError } from "./axios";
import { CachedAPIService, dataCache } from "@/lib/performance/DataCache";
import { PerformanceMonitor } from "@/lib/performance/MapOptimizations";

/**
 * API 조회 옵션
 */
export interface VacantShopQueryOptions {
  filter?: Partial<MapFilter>;
  limit?: number;
  offset?: number;
  sortBy?: "rent" | "area" | "createdAt";
  sortOrder?: "asc" | "desc";
}

/**
 * 페이지네이션된 응답
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

/**
 * 공실 상가 API 서비스
 */
export class VacantShopService {
  private static instance: VacantShopService;
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5분

  // 싱글톤 패턴 적용
  static getInstance(): VacantShopService {
    if (!VacantShopService.instance) {
      VacantShopService.instance = new VacantShopService();
    }
    return VacantShopService.instance;
  }

  private constructor() {}

  /**
   * 캐시 키 생성
   */
  private getCacheKey(method: string, params?: any): string {
    return `${method}:${JSON.stringify(params || {})}`;
  }

  /**
   * 성능 모니터링과 함께 캐시된 데이터 조회
   */
  private async getCachedData<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number,
    params?: Record<string, any>
  ): Promise<T> {
    const endTiming = PerformanceMonitor.startTiming(`API:${key}`);

    try {
      // 캐시에서 먼저 확인
      const cached = dataCache.get<T>(key, params);
      if (cached) {
        endTiming();
        if (process.env.NODE_ENV === "development") {
          console.log(`🎯 Cache hit for ${key}`);
        }
        return cached;
      }

      // 캐시 미스 - API 호출
      const data = await fetcher();
      dataCache.set(key, data, ttl, params);

      if (process.env.NODE_ENV === "development") {
        console.log(`📡 API call for ${key}`);
      }

      return data;
    } finally {
      endTiming();
    }
  }

  /**
   * 캐시에서 데이터 가져오기
   */
  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > this.CACHE_TTL;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  /**
   * 캐시에 데이터 저장
   */
  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * 개발 모드 확인 (Mock 데이터 사용 여부)
   */
  private get useMockData(): boolean {
    return (
      process.env.NODE_ENV === "development" ||
      !process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true"
    );
  }

  /**
   * 모든 공실 상가 조회
   */
  async getShops(
    options: VacantShopQueryOptions = {}
  ): Promise<PaginatedResponse<VacantShop>> {
    const cacheKey = this.getCacheKey("getShops", options);

    // 캐시 확인
    const cached = this.getFromCache<PaginatedResponse<VacantShop>>(cacheKey);
    if (cached) {
      console.log("📦 Using cached data for getShops");
      return cached;
    }

    try {
      if (this.useMockData) {
        // Mock 데이터 사용
        return this.getMockShops(options);
      }

      // 실제 API 호출
      const response = await apiClient.get<
        ApiResponse<PaginatedResponse<VacantShop>>
      >("/shops", { params: options });

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || "Failed to fetch shops");
      }

      const result = response.data.data;
      this.setCache(cacheKey, result);

      return result;
    } catch (error) {
      console.error("Failed to fetch shops:", error);

      // API 실패시 Mock 데이터 폴백
      if (!this.useMockData) {
        console.log("🔄 Falling back to mock data due to API error");
        return this.getMockShops(options);
      }

      throw error;
    }
  }

  /**
   * 특정 공실 상가 조회
   */
  async getShopById(id: string): Promise<VacantShop> {
    const cacheKey = this.getCacheKey("getShopById", { id });

    // 캐시 확인
    const cached = this.getFromCache<VacantShop>(cacheKey);
    if (cached) {
      console.log(`📦 Using cached data for shop ${id}`);
      return cached;
    }

    try {
      if (this.useMockData) {
        // Mock 데이터에서 찾기
        const shop = SAMPLE_VACANT_SHOPS.find((s) => s.id === id);
        if (!shop) {
          const error: ApiError = {
            code: "NOT_FOUND",
            message: "해당 상가를 찾을 수 없습니다.",
          };
          throw error;
        }
        this.setCache(cacheKey, shop);
        return shop;
      }

      // 실제 API 호출
      const response = await apiClient.get<ApiResponse<VacantShop>>(
        `/shops/${id}`
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || "Failed to fetch shop");
      }

      const result = response.data.data;
      this.setCache(cacheKey, result);

      return result;
    } catch (error) {
      console.error(`Failed to fetch shop ${id}:`, error);

      // API 실패시 Mock 데이터 폴백
      if (!this.useMockData) {
        console.log("🔄 Falling back to mock data due to API error");
        const shop = SAMPLE_VACANT_SHOPS.find((s) => s.id === id);
        if (shop) {
          this.setCache(cacheKey, shop);
          return shop;
        }
      }

      throw error;
    }
  }

  /**
   * Mock 데이터 조회 (개발용)
   */
  private getMockShops(
    options: VacantShopQueryOptions
  ): PaginatedResponse<VacantShop> {
    let shops = [...SAMPLE_VACANT_SHOPS];

    // 필터 적용
    if (options.filter) {
      const filter: MapFilter = {
        rentRange: options.filter.rentRange || [0, 1000],
        areaRange: options.filter.areaRange || [0, 100],
        shopTypes: options.filter.shopTypes || [
          "restaurant",
          "retail",
          "office",
          "etc",
        ],
        region: options.filter.region,
      };
      shops = filterVacantShops(shops, filter);
    }

    // 정렬
    if (options.sortBy) {
      shops.sort((a, b) => {
        let aVal: any, bVal: any;

        switch (options.sortBy) {
          case "rent":
            aVal = a.monthlyRent;
            bVal = b.monthlyRent;
            break;
          case "area":
            aVal = a.area;
            bVal = b.area;
            break;
          case "createdAt":
            aVal = a.createdAt;
            bVal = b.createdAt;
            break;
          default:
            return 0;
        }

        if (options.sortOrder === "desc") {
          return aVal < bVal ? 1 : -1;
        }
        return aVal > bVal ? 1 : -1;
      });
    }

    // 페이지네이션
    const limit = options.limit || 20;
    const offset = options.offset || 0;
    const paginatedShops = shops.slice(offset, offset + limit);

    return {
      items: paginatedShops,
      total: shops.length,
      limit,
      offset,
      hasMore: offset + limit < shops.length,
    };
  }

  /**
   * 캐시 초기화
   */
  clearCache(): void {
    this.cache.clear();
    console.log("🗑️ API cache cleared");
  }

  /**
   * 특정 상가 캐시 무효화
   */
  invalidateShopCache(shopId?: string): void {
    if (shopId) {
      // 특정 상가 캐시만 삭제
      const keys = Array.from(this.cache.keys()).filter(
        (key) => key.includes(`"id":"${shopId}"`) || key.includes("getShops")
      );
      keys.forEach((key) => this.cache.delete(key));
    } else {
      // 모든 상가 관련 캐시 삭제
      this.clearCache();
    }
  }
}

// 서비스 인스턴스 생성 및 export
export const vacantShopService = VacantShopService.getInstance();

// 편의 함수들 export
export const getShops = (options?: VacantShopQueryOptions) =>
  vacantShopService.getShops(options);

export const getShopById = (id: string) => vacantShopService.getShopById(id);

export const clearShopCache = () => vacantShopService.clearCache();

export default vacantShopService;
