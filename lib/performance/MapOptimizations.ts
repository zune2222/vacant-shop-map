"use client";

import { useCallback, useRef, useMemo } from "react";
import { VacantShop } from "@/types";

/**
 * 디바운스 훅
 */
export function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  return debouncedCallback as T;
}

/**
 * 스로틀 훅 (연속 호출 제한)
 */
export function useThrottle<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const lastCallRef = useRef<number>(0);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now;
        callback(...args);
      }
    },
    [callback, delay]
  );

  return throttledCallback as T;
}

/**
 * 맵 뷰포트 기반 마커 필터링
 */
export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface VisibilityOptions {
  bounds?: MapBounds;
  maxMarkers?: number;
  minZoomLevel?: number;
  currentZoom?: number;
}

/**
 * 마커 가시성 최적화 클래스
 */
export class MarkerVisibilityOptimizer {
  private static readonly DEFAULT_MAX_MARKERS = 500;
  private static readonly DEFAULT_MIN_ZOOM = 10;

  /**
   * 뷰포트 내에 있는 마커들만 필터링
   */
  static filterByBounds(shops: VacantShop[], bounds: MapBounds): VacantShop[] {
    return shops.filter(
      (shop) =>
        shop.latitude >= bounds.south &&
        shop.latitude <= bounds.north &&
        shop.longitude >= bounds.west &&
        shop.longitude <= bounds.east
    );
  }

  /**
   * 거리 기반 마커 우선순위 계산
   */
  static prioritizeByDistance(
    shops: VacantShop[],
    centerLat: number,
    centerLng: number
  ): VacantShop[] {
    return shops
      .map((shop) => ({
        ...shop,
        distance: this.calculateDistance(
          centerLat,
          centerLng,
          shop.latitude,
          shop.longitude
        ),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, this.DEFAULT_MAX_MARKERS);
  }

  /**
   * 하버사인 공식을 사용한 거리 계산
   */
  private static calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 6371; // 지구 반지름 (km)
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRad(value: number): number {
    return (value * Math.PI) / 180;
  }

  /**
   * 줌 레벨에 따른 마커 표시 제한
   */
  static filterByZoom(
    shops: VacantShop[],
    currentZoom: number,
    options: VisibilityOptions = {}
  ): VacantShop[] {
    const minZoom = options.minZoomLevel || this.DEFAULT_MIN_ZOOM;
    const maxMarkers = options.maxMarkers || this.DEFAULT_MAX_MARKERS;

    // 줌 레벨이 낮으면 마커 수 제한
    if (currentZoom < minZoom) {
      // 중요도나 크기 기준으로 필터링 (임대료가 높은 순으로 표시)
      return shops
        .sort((a, b) => b.monthlyRent - a.monthlyRent)
        .slice(0, Math.floor(maxMarkers / 3));
    }

    return shops.slice(0, maxMarkers);
  }

  /**
   * 종합적인 마커 최적화
   */
  static optimizeMarkers(
    shops: VacantShop[],
    options: VisibilityOptions & {
      centerLat?: number;
      centerLng?: number;
    }
  ): VacantShop[] {
    let optimizedShops = [...shops];

    // 1. 뷰포트 필터링
    if (options.bounds) {
      optimizedShops = this.filterByBounds(optimizedShops, options.bounds);
    }

    // 2. 줌 레벨 필터링
    if (options.currentZoom !== undefined) {
      optimizedShops = this.filterByZoom(
        optimizedShops,
        options.currentZoom,
        options
      );
    }

    // 3. 거리 기반 우선순위 (중심점이 있을 경우)
    if (options.centerLat && options.centerLng) {
      optimizedShops = this.prioritizeByDistance(
        optimizedShops,
        options.centerLat,
        options.centerLng
      );
    }

    return optimizedShops;
  }
}

/**
 * 마커 클러스터링 최적화
 */
export interface ClusterOptions {
  maxZoom: number;
  radius: number;
  minPoints: number;
  maxMarkersPerCluster?: number;
}

export class MarkerClusterOptimizer {
  /**
   * 간단한 그리드 기반 클러스터링
   */
  static createGridClusters(
    shops: VacantShop[],
    options: Partial<ClusterOptions> = {}
  ): Array<{
    shops: VacantShop[];
    center: { lat: number; lng: number };
    count: number;
  }> {
    const gridSize = options.radius || 0.01; // 약 1km
    const clusters = new Map<string, VacantShop[]>();

    shops.forEach((shop) => {
      const gridKey = `${Math.floor(shop.latitude / gridSize)},${Math.floor(
        shop.longitude / gridSize
      )}`;

      if (!clusters.has(gridKey)) {
        clusters.set(gridKey, []);
      }
      clusters.get(gridKey)!.push(shop);
    });

    return Array.from(clusters.entries()).map(([key, clusterShops]) => {
      const avgLat =
        clusterShops.reduce((sum, shop) => sum + shop.latitude, 0) /
        clusterShops.length;
      const avgLng =
        clusterShops.reduce((sum, shop) => sum + shop.longitude, 0) /
        clusterShops.length;

      return {
        shops: clusterShops,
        center: { lat: avgLat, lng: avgLng },
        count: clusterShops.length,
      };
    });
  }
}

/**
 * 맵 상호작용 디바운싱 훅
 */
export function useMapInteractionDebounce() {
  // 맵 이동/줌 디바운싱 (300ms)
  const debouncedMapChange = useDebounce((callback: () => void) => {
    callback();
  }, 300);

  // 필터 변경 디바운싱 (500ms)
  const debouncedFilterChange = useDebounce((callback: () => void) => {
    callback();
  }, 500);

  // 검색 입력 디바운싱 (800ms)
  const debouncedSearch = useDebounce(
    (callback: (query: string) => void, query: string) => {
      if (query.trim().length >= 2 || query.length === 0) {
        callback(query);
      }
    },
    800
  );

  // 마커 클릭은 스로틀링 (200ms)
  const throttledMarkerClick = useThrottle(
    (callback: (id: string) => void, id: string) => {
      callback(id);
    },
    200
  );

  return {
    debouncedMapChange,
    debouncedFilterChange,
    debouncedSearch,
    throttledMarkerClick,
  };
}

/**
 * 메모화된 마커 최적화 훅
 */
export function useOptimizedMarkers(
  shops: VacantShop[],
  visibilityOptions: VisibilityOptions & {
    centerLat?: number;
    centerLng?: number;
  }
) {
  return useMemo(() => {
    if (!shops.length) return [];

    const startTime = performance.now();
    const optimized = MarkerVisibilityOptimizer.optimizeMarkers(
      shops,
      visibilityOptions
    );
    const endTime = performance.now();

    if (process.env.NODE_ENV === "development") {
      console.log(
        `🎯 Marker optimization took ${(endTime - startTime).toFixed(2)}ms`
      );
      console.log(
        `📍 Showing ${optimized.length} out of ${shops.length} markers`
      );
    }

    return optimized;
  }, [
    shops,
    visibilityOptions, // 전체 객체를 의존성에 포함
  ]);
}

/**
 * 성능 모니터링 유틸리티
 */
export class PerformanceMonitor {
  private static metrics: Record<string, number[]> = {};

  static startTiming(label: string): () => void {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      if (!this.metrics[label]) {
        this.metrics[label] = [];
      }

      this.metrics[label].push(duration);

      // 최근 10개 측정값만 유지
      if (this.metrics[label].length > 10) {
        this.metrics[label].shift();
      }

      if (process.env.NODE_ENV === "development") {
        const avg = this.getAverageTime(label);
        console.log(
          `⏱️ ${label}: ${duration.toFixed(2)}ms (avg: ${avg.toFixed(2)}ms)`
        );
      }
    };
  }

  static getAverageTime(label: string): number {
    const times = this.metrics[label] || [];
    return times.length > 0
      ? times.reduce((sum, time) => sum + time, 0) / times.length
      : 0;
  }

  static getMetrics(): Record<string, { current: number; average: number }> {
    const result: Record<string, { current: number; average: number }> = {};

    Object.keys(this.metrics).forEach((label) => {
      const times = this.metrics[label];
      result[label] = {
        current: times[times.length - 1] || 0,
        average: this.getAverageTime(label),
      };
    });

    return result;
  }
}
