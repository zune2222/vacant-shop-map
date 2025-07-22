"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import Supercluster from "supercluster";
import { useMapStore } from "@/store/mapStore";
// import { useBottomSheetStore } from "@/store/bottomSheetStore"; // 제거
import { VacantShop, SHOP_TYPE_COLORS } from "@/types";

interface MarkerManagerProps {
  shops: VacantShop[];
  onMarkerClick?: (shopId: string) => void;
}

// GeoJSON Point Feature 타입 정의
interface ShopFeature {
  type: "Feature";
  properties: {
    cluster: boolean;
    shopId: string;
    name: string;
    shopType: string;
    monthlyRent: number;
  };
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
}

interface ClusterFeature {
  type: "Feature";
  properties: {
    cluster: true;
    cluster_id: number;
    point_count: number;
    point_count_abbreviated: string;
  };
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
}

// Naver Maps 객체 존재 여부 확인 함수
const isNaverMapsAvailable = (): boolean => {
  return (
    typeof window !== "undefined" &&
    window.naver &&
    window.naver.maps &&
    window.naver.maps.Map
  );
};

export default function MarkerManager({
  shops,
  onMarkerClick,
}: MarkerManagerProps) {
  const {
    mapInstance,
    isMapLoaded,
    markers,
    mapMarkers,
    selectedMarkerId,
    hoveredMarkerId,
    setMarkers,
    setMapMarkers,
    setSelectedMarkerId,
    setHoveredMarkerId,
    clearAllMarkers,
  } = useMapStore();

  // 바텀시트 스토어 제거 - props의 onMarkerClick 사용
  // const { openSheet } = useBottomSheetStore();

  // Supercluster 인스턴스
  const supercluster = useRef<Supercluster>(
    new Supercluster({
      radius: 80, // 클러스터 반경 (픽셀)
      maxZoom: 16, // 클러스터링을 적용할 최대 줌 레벨
      minZoom: 0,
      minPoints: 2, // 클러스터를 만들기 위한 최소 포인트 수
    })
  );

  // 현재 줌 레벨 추적
  const [currentZoom, setCurrentZoom] = useState<number>(13);

  // 상가 유형별 마커 아이콘 경로 반환
  const getMarkerIconPath = useCallback((shopType: string): string => {
    switch (shopType) {
      case "restaurant":
        return "/markers/restaurant.svg";
      case "retail":
        return "/markers/retail.svg";
      case "office":
        return "/markers/office.svg";
      case "etc":
      default:
        return "/markers/etc.svg";
    }
  }, []);

  // 클러스터 아이콘 생성 - 안전성 검사 추가
  const createClusterIcon = useCallback((pointCount: number): any => {
    // Naver Maps가 로드되지 않았으면 null 반환
    if (!isNaverMapsAvailable()) {
      console.warn("⚠️ Naver Maps not available for cluster icon creation");
      return null;
    }

    const size = pointCount < 10 ? 40 : pointCount < 100 ? 50 : 60;
    const color =
      pointCount < 10 ? "#4285F4" : pointCount < 100 ? "#FF6B35" : "#E53E3E";

    try {
      return {
        content: `<div style="
          width: ${size}px;
          height: ${size}px;
          background-color: ${color};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: ${size < 50 ? "12px" : "14px"};
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          cursor: pointer;
        ">${pointCount}</div>`,
        size: new window.naver.maps.Size(size, size),
        anchor: new window.naver.maps.Point(size / 2, size / 2),
      };
    } catch (error) {
      console.error("❌ Failed to create cluster icon:", error);
      return null;
    }
  }, []);

  // 줌 레벨 변경 감지
  useEffect(() => {
    if (!mapInstance || !isMapLoaded || !isNaverMapsAvailable()) return;

    try {
      const zoomChangedListener = window.naver.maps.Event.addListener(
        mapInstance,
        "zoom_changed",
        () => {
          const zoom = mapInstance.getZoom();
          setCurrentZoom(zoom);
        }
      );

      // 초기 줌 레벨 설정
      setCurrentZoom(mapInstance.getZoom());

      return () => {
        if (window.naver && window.naver.maps && window.naver.maps.Event) {
          window.naver.maps.Event.removeListener(zoomChangedListener);
        }
      };
    } catch (error) {
      console.error("❌ Failed to setup zoom listener:", error);
    }
  }, [mapInstance, isMapLoaded]);

  // 상가 데이터를 GeoJSON 형식으로 변환
  const prepareGeoJSONFeatures = useCallback(
    (shops: VacantShop[]): ShopFeature[] => {
      return shops.map((shop) => ({
        type: "Feature",
        properties: {
          cluster: false,
          shopId: shop.id,
          name: shop.name,
          shopType: shop.shopType,
          monthlyRent: shop.monthlyRent,
        },
        geometry: {
          type: "Point",
          coordinates: [shop.longitude, shop.latitude],
        },
      }));
    },
    []
  );

  // 마커 생성 및 클러스터링 적용
  useEffect(() => {
    if (
      !mapInstance ||
      !isMapLoaded ||
      !shops.length ||
      !isNaverMapsAvailable()
    ) {
      console.log("🔍 MarkerManager conditions not met:", {
        mapInstance: !!mapInstance,
        isMapLoaded,
        shopsLength: shops.length,
        naverMapsAvailable: isNaverMapsAvailable(),
      });
      return;
    }

    console.log(
      "🗺️ Creating clustered markers for",
      shops.length,
      "shops at zoom",
      currentZoom
    );

    try {
      // 기존 마커들 제거
      const currentMarkers = useMapStore.getState().markers;
      currentMarkers.forEach((marker: any) => {
        if (marker && marker.setMap) {
          marker.setMap(null);
        }
      });

      // GeoJSON 피처 준비
      const features = prepareGeoJSONFeatures(shops);

      // Supercluster에 데이터 로드
      supercluster.current.load(features);

      // 현재 지도 영역 가져오기
      const bounds = mapInstance.getBounds();
      const bbox: [number, number, number, number] = [
        bounds.getSW().lng(), // west
        bounds.getSW().lat(), // south
        bounds.getNE().lng(), // east
        bounds.getNE().lat(), // north
      ];

      // 클러스터와 개별 포인트 가져오기
      const clusters = supercluster.current.getClusters(
        bbox,
        Math.floor(currentZoom)
      );

      console.log("📍 Found", clusters.length, "clusters/points");

      const newMarkers: any[] = [];
      const newMapMarkers: any[] = [];

      clusters.forEach((cluster) => {
        try {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const position = new window.naver.maps.LatLng(latitude, longitude);

          let marker: any;

          if (cluster.properties.cluster) {
            // 클러스터 마커 생성
            const clusterData = cluster as ClusterFeature;
            const pointCount = clusterData.properties.point_count;
            const clusterIcon = createClusterIcon(pointCount);

            if (!clusterIcon) {
              console.warn(
                "⚠️ Skipping cluster marker due to icon creation failure"
              );
              return;
            }

            marker = new window.naver.maps.Marker({
              position,
              map: mapInstance,
              icon: clusterIcon,
              zIndex: 1000,
            });

            // 클러스터 클릭 시 확대
            window.naver.maps.Event.addListener(marker, "click", () => {
              const expansionZoom = Math.min(
                supercluster.current.getClusterExpansionZoom(
                  clusterData.properties.cluster_id
                ),
                17
              );
              mapInstance.setZoom(expansionZoom);
              mapInstance.setCenter(position);
            });

            newMapMarkers.push({
              id: `cluster-${clusterData.properties.cluster_id}`,
              position: { lat: latitude, lng: longitude },
              isCluster: true,
              pointCount,
              shopType: "cluster",
              isActive: true,
              name: `${pointCount}개 상점`,
              monthlyRent: 0,
            });
          } else {
            // 개별 마커 생성
            const shopData = cluster.properties as ShopFeature["properties"];

            marker = new window.naver.maps.Marker({
              position,
              map: mapInstance,
              title: shopData.name,
              icon: {
                url: getMarkerIconPath(shopData.shopType),
                size: new window.naver.maps.Size(40, 50),
                anchor: new window.naver.maps.Point(20, 50),
              },
              zIndex: 100,
            });

            // 개별 마커 클릭 이벤트
            window.naver.maps.Event.addListener(marker, "click", () => {
              console.log("🎯 Marker clicked:", shopData.shopId, shopData.name);
              setSelectedMarkerId(shopData.shopId);
              onMarkerClick?.(shopData.shopId);
            });

            // 마커 호버 이벤트
            window.naver.maps.Event.addListener(marker, "mouseover", () => {
              setHoveredMarkerId(shopData.shopId);
              marker.setIcon({
                url: getMarkerIconPath(shopData.shopType),
                size: new window.naver.maps.Size(45, 56),
                anchor: new window.naver.maps.Point(22, 56),
              });
            });

            window.naver.maps.Event.addListener(marker, "mouseout", () => {
              setHoveredMarkerId(null);
              marker.setIcon({
                url: getMarkerIconPath(shopData.shopType),
                size: new window.naver.maps.Size(40, 50),
                anchor: new window.naver.maps.Point(20, 50),
              });
            });

            newMapMarkers.push({
              id: shopData.shopId,
              position: { lat: latitude, lng: longitude },
              shopType: shopData.shopType,
              isActive: true,
              name: shopData.name,
              monthlyRent: shopData.monthlyRent,
              isCluster: false,
            });
          }

          if (marker) {
            newMarkers.push(marker);
          }
        } catch (error) {
          console.error("❌ Failed to create marker for cluster:", error);
        }
      });

      // 스토어에 마커 정보 저장
      setMarkers(newMarkers);
      setMapMarkers(newMapMarkers);

      console.log("✅ Created", newMarkers.length, "clustered markers");

      // 컴포넌트 언마운트시 마커들 제거
      return () => {
        console.log("🗑️ Cleaning up clustered markers");
        newMarkers.forEach((marker) => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      };
    } catch (error) {
      console.error("❌ Failed to create markers:", error);
    }
  }, [
    mapInstance,
    isMapLoaded,
    shops,
    currentZoom,
    getMarkerIconPath,
    onMarkerClick,
    prepareGeoJSONFeatures,
    createClusterIcon,
    setMarkers,
    setMapMarkers,
    setSelectedMarkerId,
    setHoveredMarkerId,
  ]);

  // 지도 이동시 클러스터 업데이트
  useEffect(() => {
    if (!mapInstance || !isMapLoaded || !isNaverMapsAvailable()) return;

    try {
      const centerChangedListener = window.naver.maps.Event.addListener(
        mapInstance,
        "center_changed",
        () => {
          // 디바운스를 위해 타이머 사용
          setTimeout(() => {
            setCurrentZoom(mapInstance.getZoom()); // 강제로 리렌더링 트리거
          }, 300);
        }
      );

      return () => {
        if (window.naver && window.naver.maps && window.naver.maps.Event) {
          window.naver.maps.Event.removeListener(centerChangedListener);
        }
      };
    } catch (error) {
      console.error("❌ Failed to setup center change listener:", error);
    }
  }, [mapInstance, isMapLoaded]);

  // 선택된 마커 스타일 업데이트 (클러스터가 아닌 경우만)
  useEffect(() => {
    if (
      !selectedMarkerId ||
      !markers.length ||
      !mapMarkers.length ||
      !isNaverMapsAvailable()
    )
      return;

    try {
      markers.forEach((marker, index) => {
        const mapMarker = mapMarkers[index];
        if (!mapMarker || mapMarker.isCluster) return;

        if (mapMarker.id === selectedMarkerId) {
          marker.setIcon({
            url: getMarkerIconPath(mapMarker.shopType),
            size: new window.naver.maps.Size(50, 62),
            anchor: new window.naver.maps.Point(25, 62),
          });
          marker.setZIndex(1000);
        } else {
          marker.setIcon({
            url: getMarkerIconPath(mapMarker.shopType),
            size: new window.naver.maps.Size(40, 50),
            anchor: new window.naver.maps.Point(20, 50),
          });
          marker.setZIndex(100);
        }
      });
    } catch (error) {
      console.error("❌ Failed to update marker styles:", error);
    }
  }, [selectedMarkerId, markers, mapMarkers, getMarkerIconPath]);

  return null;
}
