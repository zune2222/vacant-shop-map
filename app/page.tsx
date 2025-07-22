"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Header, HeaderSpacer } from "@/components/common";
import MapContainer from "@/components/Map/MapContainer";
import MarkerManager from "@/components/Map/MarkerManager";
import CurrentLocationButton from "@/components/Map/CurrentLocationButton";

import {
  FilterButton,
  FilterPanel,
  FilterLoadingState,
} from "@/components/Filter";
import { BottomSheet, ShopDetail } from "@/components/BottomSheet";
import { ApiErrorState } from "@/components/common";
import { useBottomSheetStore } from "@/store/bottomSheetStore";
import { useFilterStore } from "@/store/filterStore";
import { useInitialLocation } from "@/hooks/useInitialLocation";
import { getShops } from "@/lib/api";
import { VacantShop } from "@/types";
import { getFilterSummary } from "@/lib/utils/filterUtils";
import { GeolocationError } from "@/lib/geolocation";
import LoadingState from "@/components/LoadingState";

// 성능 최적화 도구들 import
import {
  useDebounce,
  useMapInteractionDebounce,
  PerformanceMonitor,
} from "@/lib/performance/MapOptimizations";

export default function HomePage() {
  // Hydration-safe mounting state
  const [isMounted, setIsMounted] = useState(false);

  // State for shops data management
  const [shops, setShops] = useState<VacantShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<any>(null);

  // Bottom sheet store
  const { openSheet } = useBottomSheetStore();

  // Filter store
  const {
    filters,
    appliedFilters,
    isFilterPanelOpen,
    applyFilters,
    openFilterPanel,
    closeFilterPanel,
    isDefaultFilter,
  } = useFilterStore();

  /**
   * Handle current location found - 메모이제이션으로 안정화
   */
  const handleLocationFound = useCallback((position: GeolocationPosition) => {
    console.log("📍 사용자가 현재 위치로 이동했습니다:", {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });
  }, []);

  /**
   * Handle location error - 메모이제이션으로 안정화
   */
  const handleLocationError = useCallback((error: GeolocationError) => {
    console.warn("📍 위치 오류:", error.message);
    // 위치 오류는 CurrentLocationButton 자체에서 처리됨
  }, []);

  // 초기 위치 감지 훅 사용 - mounted 상태에서만 실행
  const initialLocation = useInitialLocation({
    enableAutoDetection: isMounted, // mounted 후에만 활성화
    fallbackToDefault: true,
    timeout: 8000,
    onLocationDetected: handleLocationFound,
    onError: handleLocationError,
  });

  /**
   * 성능 최적화된 상가 데이터 fetch 함수
   */
  const optimizedFetchShops = useCallback(
    async (currentFilters: typeof appliedFilters) => {
      const endTiming = PerformanceMonitor.startTiming("FetchShops");

      try {
        setFilterLoading(true);
        setError(null);
        setApiError(null);

        if (process.env.NODE_ENV === "development") {
          console.log("📡 Loading shops with filters:", currentFilters);
        }

        const shopsResponse = await getShops({
          limit: 100,
          filter: currentFilters,
        });

        setShops(shopsResponse.items);

        if (process.env.NODE_ENV === "development") {
          console.log(
            "✅ Loaded",
            shopsResponse.items.length,
            "shops with filters"
          );
        }
      } catch (err: any) {
        console.error("❌ Failed to load shops:", err);

        // API 에러 객체가 있으면 구조화된 에러로 처리
        if (err && typeof err === "object" && err.code) {
          setApiError(err);
        } else {
          setError(err?.message || "상가 데이터를 불러오는데 실패했습니다.");
        }
      } finally {
        setFilterLoading(false);
        if (loading) setLoading(false);
        endTiming();
      }
    },
    [loading]
  );

  // 메모화된 상가 데이터 (중복 렌더링 방지)
  const memoizedShops = useMemo(() => {
    if (process.env.NODE_ENV === "development") {
      console.log(`📊 Memoizing ${shops.length} shops`);
    }
    return shops;
  }, [shops]);

  // 필터 요약 메모화 (복잡한 계산 최적화)
  const memoizedFilterSummary = useMemo(() => {
    const summary = getFilterSummary(appliedFilters);
    if (process.env.NODE_ENV === "development") {
      console.log("🔍 Filter summary memoized:", summary);
    }
    return summary;
  }, [appliedFilters]);

  // 디바운스된 fetch 함수 (안정된 참조)
  const debouncedFetchShops = useDebounce(optimizedFetchShops, 500);

  /**
   * Handle component mounting for hydration safety
   */
  useEffect(() => {
    setIsMounted(true);
  }, []);

  /**
   * Fetch shops data when filters change - mounted 상태에서만 실행
   */
  useEffect(() => {
    if (!isMounted) return;

    // debouncedFetchShops는 이미 디바운스된 함수이므로 바로 호출
    debouncedFetchShops(appliedFilters);
  }, [appliedFilters, isMounted, debouncedFetchShops]); // 의존성 배열에 debouncedFetchShops 추가

  /**
   * 마커 클릭 핸들러 (간단하고 안전한 버전)
   */
  const handleMarkerClick = useCallback(
    (id: string) => {
      if (process.env.NODE_ENV === "development") {
        console.log("🎯 Marker clicked:", id);
      }
      openSheet(id);
    },
    [openSheet]
  );

  /**
   * 필터 적용 핸들러 (간단하고 안전한 버전)
   */
  const handleApplyFilters = useCallback(
    (newFilters: typeof filters) => {
      if (process.env.NODE_ENV === "development") {
        console.log("🔍 Applying filters:", newFilters);
      }
      applyFilters(newFilters);
    },
    [applyFilters] // filters 의존성 제거 (실제로 사용되지 않음)
  );

  /**
   * Handle retry when error occurs
   */
  const handleRetry = useCallback(() => {
    setError(null);
    setApiError(null);
    setLoading(true);
    debouncedFetchShops(appliedFilters);
  }, [debouncedFetchShops, appliedFilters]);

  // 개발 모드에서 성능 통계 표시
  useEffect(() => {
    if (process.env.NODE_ENV === "development" && isMounted) {
      const interval = setInterval(() => {
        const metrics = PerformanceMonitor.getMetrics();
        if (Object.keys(metrics).length > 0) {
          console.group("🔍 Performance Metrics");
          Object.entries(metrics).forEach(([label, metric]) => {
            console.log(
              `${label}: ${metric.current.toFixed(
                2
              )}ms (avg: ${metric.average.toFixed(2)}ms)`
            );
          });
          console.groupEnd();
        }
      }, 30000); // 30초마다

      return () => clearInterval(interval);
    }
  }, [isMounted]);

  // Hydration이 완료되기 전까지 기본 로딩 상태 표시
  if (!isMounted) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <Header />
        <HeaderSpacer />
        <main className="flex-1 flex items-center justify-center">
          <LoadingState message="앱을 초기화하는 중..." size="lg" />
        </main>
      </div>
    );
  }

  // Initial loading state
  if (loading && !shops.length) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <Header />
        <HeaderSpacer />
        <main className="flex-1 flex items-center justify-center">
          <LoadingState message="상가 정보를 불러오는 중..." size="lg" />
        </main>
      </div>
    );
  }

  // Error state - API 에러 우선, 일반 에러 폴백
  if ((error || apiError) && !shops.length) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <Header />
        <HeaderSpacer />
        <main className="flex-1 flex items-center justify-center p-4">
          <ApiErrorState
            title={
              apiError?.code === "NETWORK_ERROR"
                ? "네트워크 연결 오류"
                : "데이터 로딩 실패"
            }
            message={
              apiError?.message ||
              error ||
              "상가 데이터를 불러오는데 실패했습니다."
            }
            errorCode={apiError?.code}
            onRetry={handleRetry}
            showDetails={true}
            size="large"
          />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header with Logo */}
      <Header />
      <HeaderSpacer />

      {/* Main Map Area */}
      <main className="flex-1 overflow-hidden relative">
        {/* Pure Map Container */}
        <MapContainer className="h-full w-full" />

        {/* Marker Manager with optimized shops */}
        {memoizedShops.length > 0 && (
          <MarkerManager
            shops={memoizedShops}
            onMarkerClick={handleMarkerClick}
          />
        )}

        {/* Filter Button */}
        <FilterButton
          onClick={openFilterPanel}
          hasActiveFilters={!isDefaultFilter()}
        />

        {/* Current Location Button */}
        <CurrentLocationButton
          onLocationFound={handleLocationFound}
          onError={handleLocationError}
        />

        {/* Shops Counter */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-10 max-w-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-700">
              📍 {memoizedShops.length}개의 공실 상가
            </div>
          </div>

          {!isDefaultFilter() && (
            <div className="text-xs text-blue-600 mb-2">
              {memoizedFilterSummary}
            </div>
          )}

          {/* 초기 위치 감지 상태 표시 (선택적) */}
          {initialLocation.isDetecting && (
            <div className="text-xs text-green-600 flex items-center">
              <svg
                className="animate-spin w-3 h-3 mr-1"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              위치 감지 중...
            </div>
          )}

          {/* API 에러 표시 (있는 경우) */}
          {(error || apiError) && shops.length > 0 && (
            <div className="text-xs text-red-600 mt-1">
              ⚠️ 일부 데이터 로딩 실패
            </div>
          )}
        </div>

        {/* Filter Loading Overlay */}
        {filterLoading && <FilterLoadingState />}

        {/* Filter Panel Modal */}
        {isFilterPanelOpen && (
          <div className="absolute inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
              <FilterPanel
                initialFilters={filters}
                onApplyFilters={handleApplyFilters}
                onClose={closeFilterPanel}
              />
            </div>
          </div>
        )}
      </main>

      {/* Bottom Sheet Integration */}
      <BottomSheet>
        <ShopDetail />
      </BottomSheet>
    </div>
  );
}
