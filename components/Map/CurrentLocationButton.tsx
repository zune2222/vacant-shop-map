"use client";

import { useState } from "react";
import { useMapStore } from "@/store/mapStore";
import {
  getCurrentPosition,
  GeolocationError,
  GeolocationErrorType,
  isGeolocationSupported,
  checkGeolocationPermission,
} from "@/lib/geolocation";

interface CurrentLocationButtonProps {
  className?: string;
  onLocationFound?: (position: GeolocationPosition) => void;
  onError?: (error: GeolocationError) => void;
}

export default function CurrentLocationButton({
  className = "",
  onLocationFound,
  onError,
}: CurrentLocationButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mapInstance, setCenter } = useMapStore();

  const handleClick = async () => {
    // 지도 인스턴스 확인
    if (!mapInstance) {
      console.warn("⚠️ Map instance not available");
      return;
    }

    // 지오로케이션 지원 확인
    if (!isGeolocationSupported()) {
      const errorMsg = "이 브라우저는 위치 서비스를 지원하지 않습니다.";
      setError(errorMsg);
      onError?.(
        new GeolocationError(GeolocationErrorType.NOT_SUPPORTED, errorMsg)
      );
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log("📍 현재 위치 요청 시작...");

      // 권한 상태 확인 (지원되는 경우)
      const permission = await checkGeolocationPermission();
      console.log("🔐 위치 권한 상태:", permission);

      // 현재 위치 가져오기
      const position = await getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000, // 30초간 캐시 허용
      });

      const { latitude, longitude } = position.coords;
      const newCenter = { lat: latitude, lng: longitude };

      console.log("✅ 현재 위치로 지도 이동:", newCenter);

      // 지도 이동 및 줌 조정
      if (window.naver && window.naver.maps) {
        const latLng = new window.naver.maps.LatLng(latitude, longitude);
        mapInstance.setCenter(latLng);
        mapInstance.setZoom(16); // 상세한 줌 레벨로 설정
      }

      // 스토어 상태 업데이트
      setCenter(newCenter);

      // 콜백 실행
      onLocationFound?.(position);

      // 성공 메시지 표시 (짧은 시간)
      setError(null);
      console.log("🎯 현재 위치로 이동 완료");
    } catch (err) {
      console.error("❌ 현재 위치 이동 실패:", err);

      let errorMessage: string;

      if (err instanceof GeolocationError) {
        errorMessage = err.message;
      } else {
        errorMessage = "위치 정보를 가져올 수 없습니다.";
      }

      setError(errorMessage);
      onError?.(err as GeolocationError);

      // 3초 후 에러 메시지 자동 숨김
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`absolute bottom-32 right-4 z-20 ${className}`}>
      {/* 현재 위치 버튼 */}
      <button
        onClick={handleClick}
        disabled={loading || !mapInstance}
        className={`
          bg-white p-4 rounded-2xl shadow-brand border border-gray-100 touch-target
          hover:bg-gray-50 active:bg-gray-100 hover:shadow-lg
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200 animate-scale-in
          ${loading ? "cursor-wait" : "cursor-pointer"}
        `}
        aria-label={loading ? "현재 위치를 찾는 중..." : "현재 위치로 이동"}
        title={loading ? "현재 위치를 찾는 중..." : "현재 위치로 이동"}
      >
        {loading ? (
          // 로딩 스피너
          <div className="relative">
            <svg
              className="animate-spin h-6 w-6 text-[#6E62F6]"
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
          </div>
        ) : (
          // 위치 아이콘 (더 모던한 벡터 아이콘)
          <svg
            className="h-6 w-6 text-[#6E62F6]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
          </svg>
        )}
      </button>

      {/* 에러 메시지 툴팁 */}
      {error && (
        <div className="absolute bottom-full right-0 mb-3 w-72 animate-slide-up">
          <div className="bg-white border border-red-200 text-red-700 text-sm p-4 rounded-2xl shadow-lg">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                <svg
                  className="w-4 h-4 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div>
                <div className="font-semibold mb-1 text-red-800">위치 정보 오류</div>
                <div className="text-red-600">{error}</div>
              </div>
            </div>
            {/* 화살표 */}
            <div className="absolute top-full right-6 -mt-2">
              <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-red-200"></div>
              <div className="absolute -top-1 left-0 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
