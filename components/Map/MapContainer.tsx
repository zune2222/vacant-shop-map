"use client";

import { useEffect, useRef, useState } from "react";
import { useMapStore } from "@/store/mapStore";
import { loadNaverMapsScript } from "@/lib/naverMapsLoader";
import { getNaverMapPosition } from "@/types/map";
import {
  MapLoadingSkeleton,
  MapInitializingSkeleton,
  MapLoadingError,
} from "@/components/Map";

interface MapContainerProps {
  className?: string;
}

export default function MapContainer({ className = "" }: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { mapInstance, setMapInstance, center, zoom, setLoading, isLoading } =
    useMapStore();

  // Naver Maps 스크립트 로드
  useEffect(() => {
    const loadScript = async () => {
      try {
        setLoading(true);
        await loadNaverMapsScript();
        setIsScriptLoaded(true);
        setError(null);
      } catch (err) {
        console.error("Failed to load Naver Maps:", err);
        const errorMessage = (err as Error).message;
        if (errorMessage.includes("authentication failed")) {
          setError(
            "Naver Maps API 인증에 실패했습니다. API 키를 확인해주세요."
          );
        } else {
          setError(
            "지도를 불러오는데 실패했습니다. 네트워크 연결을 확인해주세요."
          );
        }
      } finally {
        setLoading(false);
      }
    };
    loadScript();
  }, [setLoading]);

  // 지도 초기화
  useEffect(() => {
    if (!isScriptLoaded || !mapRef.current || mapInstance) return;

    try {
      console.log("🗺️ Initializing Naver Map...");
      const map = new window.naver.maps.Map(mapRef.current, {
        center: new window.naver.maps.LatLng(center.lat, center.lng),
        zoom: zoom,
        minZoom: 10,
        maxZoom: 20,
        zoomControl: true,
        zoomControlOptions: {
          position: getNaverMapPosition("TOP_RIGHT"),
        },
        mapTypeControl: false,
        mapDataControl: false,
        logoControl: true,
        scaleControl: false,
      });

      setMapInstance(map);
      console.log("✅ Naver Map initialized successfully");
    } catch (error) {
      console.error("❌ Failed to initialize map:", error);
      setError("지도 초기화에 실패했습니다.");
    }
  }, [isScriptLoaded, mapInstance, setMapInstance, center, zoom]);

  // 로딩 상태
  if (isLoading && !isScriptLoaded) {
    return (
      <div className={`w-full h-full ${className}`}>
        <MapInitializingSkeleton />
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className={`w-full h-full ${className}`}>
        <MapLoadingError
          onRetry={() => {
            setError(null);
            window.location.reload();
          }}
        />
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* 지도 컨테이너 - 순수하게 지도만 렌더링 */}
      <div
        ref={mapRef}
        className="w-full h-full"
        style={{ minHeight: "400px" }}
      />
    </div>
  );
}
