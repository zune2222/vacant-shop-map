import { create } from "zustand";
import { MapFilter, DEFAULT_FILTER } from "@/types";

/**
 * 필터 상태 인터페이스
 */
interface FilterState {
  filters: MapFilter;
  isFilterPanelOpen: boolean;
  appliedFilters: MapFilter; // 실제 적용된 필터 (API 호출용)
}

/**
 * 필터 액션 인터페이스
 */
interface FilterActions {
  setFilters: (filters: MapFilter) => void;
  applyFilters: (filters: MapFilter) => void;
  openFilterPanel: () => void;
  closeFilterPanel: () => void;
  resetFilters: () => void;
  isDefaultFilter: () => boolean;
}

/**
 * 필터 store 타입
 */
type FilterStore = FilterState & FilterActions;

/**
 * 필터 store
 */
export const useFilterStore = create<FilterStore>((set, get) => ({
  // 초기 상태
  filters: DEFAULT_FILTER,
  appliedFilters: DEFAULT_FILTER,
  isFilterPanelOpen: false,

  // 액션들
  setFilters: (filters) => {
    set({ filters });
  },

  applyFilters: (filters) => {
    set({
      filters,
      appliedFilters: filters,
      isFilterPanelOpen: false,
    });
  },

  openFilterPanel: () => {
    set({ isFilterPanelOpen: true });
  },

  closeFilterPanel: () => {
    set({ isFilterPanelOpen: false });
  },

  resetFilters: () => {
    set({
      filters: DEFAULT_FILTER,
      appliedFilters: DEFAULT_FILTER,
    });
  },

  isDefaultFilter: () => {
    const { appliedFilters } = get();
    return (
      appliedFilters.rentRange[0] === DEFAULT_FILTER.rentRange[0] &&
      appliedFilters.rentRange[1] === DEFAULT_FILTER.rentRange[1] &&
      appliedFilters.areaRange[0] === DEFAULT_FILTER.areaRange[0] &&
      appliedFilters.areaRange[1] === DEFAULT_FILTER.areaRange[1] &&
      appliedFilters.shopTypes.length === DEFAULT_FILTER.shopTypes.length &&
      appliedFilters.shopTypes.every((type) =>
        DEFAULT_FILTER.shopTypes.includes(type)
      ) &&
      !appliedFilters.region
    );
  },
}));
