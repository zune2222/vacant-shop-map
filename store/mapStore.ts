import { create } from "zustand";
import { MapMarker } from "@/types";

interface MapState {
  mapInstance: any | null; // naver.maps.Map
  isMapLoaded: boolean;
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  isLoading: boolean;
  error: string | null;
  // 마커 관련 상태 추가
  markers: any[]; // naver.maps.Marker[]
  mapMarkers: MapMarker[];
  selectedMarkerId: string | null;
  hoveredMarkerId: string | null;
}

interface MapActions {
  setMapInstance: (map: any) => void;
  setMapLoaded: (loaded: boolean) => void;
  setCenter: (center: { lat: number; lng: number }) => void;
  setZoom: (zoom: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetMap: () => void;
  // 마커 관련 액션 추가
  setMarkers: (markers: any[]) => void;
  setMapMarkers: (mapMarkers: MapMarker[]) => void;
  setSelectedMarkerId: (markerId: string | null) => void;
  setHoveredMarkerId: (markerId: string | null) => void;
  clearAllMarkers: () => void;
}

type MapStore = MapState & MapActions;

const initialState: MapState = {
  mapInstance: null,
  isMapLoaded: false,
  center: {
    lat: 35.22889, // 부산 지역
    lng: 129.0813095,
  },
  zoom: 15, // 줌 레벨 15
  isLoading: false,
  error: null,
  // 마커 관련 초기 상태
  markers: [],
  mapMarkers: [],
  selectedMarkerId: null,
  hoveredMarkerId: null,
};

export const useMapStore = create<MapStore>((set, get) => ({
  ...initialState,

  setMapInstance: (map) => set({ mapInstance: map, isMapLoaded: !!map }),

  setMapLoaded: (loaded) => set({ isMapLoaded: loaded }),

  setCenter: (center) => set({ center }),

  setZoom: (zoom) => set({ zoom }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  resetMap: () => set(initialState),

  // 마커 관련 액션 구현
  setMarkers: (markers) => set({ markers }),

  setMapMarkers: (mapMarkers) => set({ mapMarkers }),

  setSelectedMarkerId: (markerId) => set({ selectedMarkerId: markerId }),

  setHoveredMarkerId: (markerId) => set({ hoveredMarkerId: markerId }),

  clearAllMarkers: () => {
    const { markers } = get();
    // 기존 마커들을 지도에서 제거
    markers.forEach((marker: any) => {
      if (marker && marker.setMap) {
        marker.setMap(null);
      }
    });
    set({
      markers: [],
      mapMarkers: [],
      selectedMarkerId: null,
      hoveredMarkerId: null,
    });
  },
}));
