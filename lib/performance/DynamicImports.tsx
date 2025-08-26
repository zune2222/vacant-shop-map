"use client";

import dynamic from "next/dynamic";
import { ComponentType } from "react";

// 로딩 컴포넌트들
import { FilterSkeleton } from "@/components/Filter";
import { ShopDetailSkeleton } from "@/components/Shop";

/**
 * 동적으로 로딩되는 컴포넌트들
 * 초기 번들 크기를 줄이고 필요할 때만 로드
 */

// Filter 관련 컴포넌트들 - 사용자가 필터 버튼을 클릭했을 때만 로드
export const DynamicFilterPanel = dynamic(
  () => import("@/components/Filter/FilterPanel"),
  {
    loading: () => <FilterSkeleton />,
    ssr: false, // 클라이언트 사이드에서만 필요
  }
);

export const DynamicRangeSlider = dynamic(
  () => import("@/components/Filter/RangeSlider"),
  {
    loading: () => (
      <div className="h-6 bg-gray-200 rounded-full animate-pulse" />
    ),
    ssr: false,
  }
);

export const DynamicShopTypeSelector = dynamic(
  () => import("@/components/Filter/ShopTypeSelector"),
  {
    loading: () => (
      <div className="grid grid-cols-2 gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    ),
    ssr: false,
  }
);

// ShopDetail 컴포넌트 - 마커 클릭 시에만 로드
export const DynamicShopDetail = dynamic(
  () => import("@/components/BottomSheet/ShopDetail"),
  {
    loading: () => (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="p-4">
            <ShopDetailSkeleton />
          </div>
        </div>
      </div>
    ),
    ssr: false,
  }
);

// Map 관련 무거운 컴포넌트들
export const DynamicMarkerManager = dynamic(
  () => import("@/components/Map/MarkerManager"),
  {
    loading: () => null, // 마커는 로딩 UI 없이 자연스럽게
    ssr: false,
  }
);

// 현재 위치 버튼 - 사용자가 필요할 때만 로드
export const DynamicCurrentLocationButton = dynamic(
  () => import("@/components/Map/CurrentLocationButton"),
  {
    loading: () => (
      <div className="absolute bottom-24 right-4 w-12 h-12 bg-white rounded-full shadow-lg animate-pulse" />
    ),
    ssr: false,
  }
);

/**
 * 지연 로딩 헬퍼 함수들
 */

// 컴포넌트 preload 함수들 (타입 안전하게 처리)
export const preloadFilterComponents = async () => {
  try {
    // 병렬로 컴포넌트들을 프리로드
    await Promise.all([
      import("@/components/Filter/FilterPanel"),
      import("@/components/Filter/RangeSlider"),
      import("@/components/Filter/ShopTypeSelector"),
    ]);
  } catch (error) {
    console.warn("Failed to preload filter components:", error);
  }
};

export const preloadShopDetailComponents = async () => {
  try {
    await import("@/components/BottomSheet/ShopDetail");
  } catch (error) {
    console.warn("Failed to preload shop detail components:", error);
  }
};

export const preloadMapComponents = async () => {
  try {
    await Promise.all([
      import("@/components/Map/MarkerManager"),
      import("@/components/Map/CurrentLocationButton"),
    ]);
  } catch (error) {
    console.warn("Failed to preload map components:", error);
  }
};

// 마우스 호버나 포커스 시 미리 로드
export const usePreloadOnHover = (preloadFn: () => Promise<void>) => ({
  onMouseEnter: () => {
    preloadFn().catch(console.warn);
  },
  onFocus: () => {
    preloadFn().catch(console.warn);
  },
});

/**
 * 성능 모니터링을 위한 헬퍼
 */
export const logComponentLoadTime = (componentName: string) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`🚀 Dynamic component loaded: ${componentName}`);
  }
};

/**
 * 컴포넌트 지연 로딩 상태 관리
 */
export const ComponentPreloader = {
  filter: {
    isPreloaded: false,
    preload: async () => {
      if (!ComponentPreloader.filter.isPreloaded) {
        await preloadFilterComponents();
        ComponentPreloader.filter.isPreloaded = true;
        logComponentLoadTime("FilterComponents");
      }
    },
  },

  shopDetail: {
    isPreloaded: false,
    preload: async () => {
      if (!ComponentPreloader.shopDetail.isPreloaded) {
        await preloadShopDetailComponents();
        ComponentPreloader.shopDetail.isPreloaded = true;
        logComponentLoadTime("ShopDetailComponents");
      }
    },
  },

  mapComponents: {
    isPreloaded: false,
    preload: async () => {
      if (!ComponentPreloader.mapComponents.isPreloaded) {
        await preloadMapComponents();
        ComponentPreloader.mapComponents.isPreloaded = true;
        logComponentLoadTime("MapComponents");
      }
    },
  },
};
