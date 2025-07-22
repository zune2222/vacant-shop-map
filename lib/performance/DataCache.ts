import { VacantShop, MapFilter } from "@/types";

/**
 * 캐시 항목 인터페이스
 */
interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  expiresAt: number;
  size: number; // 메모리 사용량 추적
}

/**
 * 캐시 통계 인터페이스
 */
interface CacheStats {
  hits: number;
  misses: number;
  totalRequests: number;
  memoryUsage: number;
  hitRate: number;
}

/**
 * 고성능 데이터 캐싱 클래스
 */
class DataCache {
  private cache: Map<string, CacheItem> = new Map();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    totalRequests: 0,
    memoryUsage: 0,
    hitRate: 0,
  };

  // 캐시 설정
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5분
  private readonly LONG_TTL = 30 * 60 * 1000; // 30분 (정적 데이터용)
  private readonly SHORT_TTL = 1 * 60 * 1000; // 1분 (동적 데이터용)
  private readonly MAX_MEMORY_SIZE = 50 * 1024 * 1024; // 50MB 제한
  private readonly CLEANUP_INTERVAL = 60 * 1000; // 1분마다 정리

  constructor() {
    // 주기적으로 만료된 캐시 정리
    setInterval(() => this.cleanup(), this.CLEANUP_INTERVAL);

    // 브라우저 메모리 압박 시 캐시 정리
    if (typeof window !== "undefined") {
      // 페이지 숨김 시 오래된 캐시 정리
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          this.cleanup(true);
        }
      });
    }
  }

  /**
   * 캐시 키 생성
   */
  private generateKey(baseKey: string, params?: Record<string, any>): string {
    if (!params) return baseKey;

    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        const value = params[key];
        if (value !== undefined && value !== null) {
          result[key] = Array.isArray(value)
            ? value.sort().join(",")
            : String(value);
        }
        return result;
      }, {} as Record<string, string>);

    return `${baseKey}:${JSON.stringify(sortedParams)}`;
  }

  /**
   * 데이터 크기 추정
   */
  private estimateSize(data: any): number {
    try {
      return new Blob([JSON.stringify(data)]).size;
    } catch {
      return JSON.stringify(data).length * 2; // 대략적인 추정
    }
  }

  /**
   * 캐시에서 데이터 가져오기
   */
  get<T>(key: string, params?: Record<string, any>): T | null {
    const cacheKey = this.generateKey(key, params);
    const item = this.cache.get(cacheKey);

    this.stats.totalRequests++;

    if (!item || Date.now() > item.expiresAt) {
      this.stats.misses++;
      if (item) {
        this.cache.delete(cacheKey);
        this.stats.memoryUsage -= item.size;
      }
      this.updateHitRate();
      return null;
    }

    this.stats.hits++;
    this.updateHitRate();

    // 액세스 시간 업데이트 (LRU 구현을 위해)
    item.timestamp = Date.now();

    return item.data as T;
  }

  /**
   * 캐시에 데이터 저장
   */
  set<T>(
    key: string,
    data: T,
    ttl?: number,
    params?: Record<string, any>
  ): void {
    const cacheKey = this.generateKey(key, params);
    const size = this.estimateSize(data);
    const now = Date.now();
    const expiresAt = now + (ttl || this.DEFAULT_TTL);

    // 메모리 제한 확인 및 정리
    if (this.stats.memoryUsage + size > this.MAX_MEMORY_SIZE) {
      this.evictLRU();
    }

    // 기존 항목 제거 (메모리 사용량 업데이트)
    const existingItem = this.cache.get(cacheKey);
    if (existingItem) {
      this.stats.memoryUsage -= existingItem.size;
    }

    // 새 항목 추가
    const item: CacheItem<T> = {
      data,
      timestamp: now,
      expiresAt,
      size,
    };

    this.cache.set(cacheKey, item);
    this.stats.memoryUsage += size;
  }

  /**
   * LRU 방식으로 오래된 캐시 제거
   */
  private evictLRU(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    Array.from(this.cache.entries()).forEach(([key, item]) => {
      if (item.timestamp < oldestTime) {
        oldestTime = item.timestamp;
        oldestKey = key;
      }
    });

    if (oldestKey) {
      const item = this.cache.get(oldestKey)!;
      this.cache.delete(oldestKey);
      this.stats.memoryUsage -= item.size;
    }
  }

  /**
   * 만료된 캐시 정리
   */
  private cleanup(aggressive = false): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    Array.from(this.cache.entries()).forEach(([key, item]) => {
      const isExpired = now > item.expiresAt;
      const isOld = aggressive && now - item.timestamp > this.DEFAULT_TTL;

      if (isExpired || isOld) {
        keysToDelete.push(key);
        this.stats.memoryUsage -= item.size;
      }
    });

    keysToDelete.forEach((key) => this.cache.delete(key));

    if (process.env.NODE_ENV === "development") {
      console.log(`🧹 Cache cleanup: removed ${keysToDelete.length} items`);
    }
  }

  /**
   * 히트율 업데이트
   */
  private updateHitRate(): void {
    this.stats.hitRate =
      this.stats.totalRequests > 0
        ? this.stats.hits / this.stats.totalRequests
        : 0;
  }

  /**
   * 특정 패턴의 캐시 무효화
   */
  invalidate(pattern: string): number {
    const keysToDelete: string[] = [];
    let freedMemory = 0;

    Array.from(this.cache.entries()).forEach(([key, item]) => {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
        freedMemory += item.size;
      }
    });

    keysToDelete.forEach((key) => this.cache.delete(key));
    this.stats.memoryUsage -= freedMemory;

    return keysToDelete.length;
  }

  /**
   * 캐시 통계 조회
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * 캐시 전체 삭제
   */
  clear(): void {
    this.cache.clear();
    this.stats = {
      hits: 0,
      misses: 0,
      totalRequests: 0,
      memoryUsage: 0,
      hitRate: 0,
    };
  }
}

/**
 * 글로벌 캐시 인스턴스
 */
export const dataCache = new DataCache();

/**
 * 캐시된 API 호출 헬퍼 함수들
 */
export class CachedAPIService {
  /**
   * 상가 목록 캐시된 조회
   */
  static async getCachedShops(
    fetcher: (filter?: Partial<MapFilter>) => Promise<VacantShop[]>,
    filter?: Partial<MapFilter>
  ): Promise<VacantShop[]> {
    const cacheKey = "shops";

    // 캐시에서 먼저 확인
    const cached = dataCache.get<VacantShop[]>(cacheKey, filter);
    if (cached) {
      return cached;
    }

    // API 호출 후 캐시 저장
    try {
      const data = await fetcher(filter);
      dataCache.set(cacheKey, data, dataCache["DEFAULT_TTL"], filter);
      return data;
    } catch (error) {
      console.error("Failed to fetch shops:", error);
      throw error;
    }
  }

  /**
   * 개별 상가 정보 캐시된 조회
   */
  static async getCachedShop(
    fetcher: (id: string) => Promise<VacantShop>,
    id: string
  ): Promise<VacantShop> {
    const cacheKey = `shop:${id}`;

    // 캐시에서 먼저 확인
    const cached = dataCache.get<VacantShop>(cacheKey);
    if (cached) {
      return cached;
    }

    // API 호출 후 캐시 저장 (긴 TTL 사용)
    try {
      const data = await fetcher(id);
      dataCache.set(cacheKey, data, dataCache["LONG_TTL"]);
      return data;
    } catch (error) {
      console.error(`Failed to fetch shop ${id}:`, error);
      throw error;
    }
  }

  /**
   * 필터 변경 시 관련 캐시 무효화
   */
  static invalidateShopsCache(): void {
    const invalidatedCount = dataCache.invalidate("shops");
    if (process.env.NODE_ENV === "development") {
      console.log(`🗑️ Invalidated ${invalidatedCount} shop cache entries`);
    }
  }
}

/**
 * 개발 도구용 캐시 디버깅
 */
if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  (window as any).__dataCache = {
    cache: dataCache,
    stats: () => dataCache.getStats(),
    clear: () => dataCache.clear(),
    invalidate: (pattern: string) => dataCache.invalidate(pattern),
  };
}
