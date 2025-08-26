"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useMapStore } from "@/store/mapStore";
import {
  getCurrentPosition,
  isGeolocationSupported,
  checkGeolocationPermission,
  GeolocationError,
} from "@/lib/geolocation";

interface InitialLocationState {
  isDetecting: boolean;
  hasDetected: boolean;
  error: string | null;
  position: GeolocationPosition | null;
  permissionStatus: PermissionState | "unsupported" | null;
}

interface UseInitialLocationOptions {
  enableAutoDetection?: boolean;
  fallbackToDefault?: boolean;
  timeout?: number;
  onLocationDetected?: (position: GeolocationPosition) => void;
  onError?: (error: GeolocationError) => void;
}

export const useInitialLocation = ({
  enableAutoDetection = true,
  fallbackToDefault = true,
  timeout = 8000,
  onLocationDetected,
  onError,
}: UseInitialLocationOptions = {}) => {
  const [state, setState] = useState<InitialLocationState>({
    isDetecting: false,
    hasDetected: false,
    error: null,
    position: null,
    permissionStatus: null,
  });

  const { mapInstance, setCenter } = useMapStore();

  // 무한 루프 방지를 위한 ref들
  const hasInitialized = useRef(false);
  const isCancelledRef = useRef(false);

  // 콜백 함수들을 메모이제이션
  const memoizedOnLocationDetected = useCallback(
    (position: GeolocationPosition) => {
      onLocationDetected?.(position);
    },
    [onLocationDetected]
  );

  const memoizedOnError = useCallback(
    (error: GeolocationError) => {
      onError?.(error);
    },
    [onError]
  );

  // 현재 감지 상태를 ref로 추적 (무한 루프 방지)
  const isDetectingRef = useRef(false);

  // 초기 위치 감지 함수
  const detectInitialLocation = useCallback(async () => {
    // 이미 초기화되었거나 감지 중이면 중단
    if (
      hasInitialized.current ||
      isDetectingRef.current ||
      !enableAutoDetection
    ) {
      return;
    }

    // 지오로케이션이 지원되지 않으면 종료
    if (!isGeolocationSupported()) {
      console.log("📍 지오로케이션이 지원되지 않습니다. 기본 위치 사용.");
      hasInitialized.current = true;
      return;
    }

    try {
      isCancelledRef.current = false;
      hasInitialized.current = true; // 중복 실행 방지
      isDetectingRef.current = true; // ref로 감지 상태 추적

      setState((prev) => ({ ...prev, isDetecting: true, error: null }));

      console.log("📍 초기 위치 감지 시작...");

      // 권한 상태 확인
      const permission = await checkGeolocationPermission();

      if (isCancelledRef.current) return;

      setState((prev) => ({ ...prev, permissionStatus: permission }));

      // 권한이 거부된 경우 조용히 종료
      if (permission === "denied") {
        console.log("📍 위치 권한이 거부되어 있습니다. 기본 위치 사용.");
        isDetectingRef.current = false; // ref 상태 업데이트
        setState((prev) => ({
          ...prev,
          isDetecting: false,
          hasDetected: true,
        }));
        return;
      }

      // 현재 위치 가져오기 (더 관대한 설정)
      const position = await getCurrentPosition({
        enableHighAccuracy: false, // 배터리 절약을 위해 낮은 정확도 사용
        timeout: timeout,
        maximumAge: 5 * 60 * 1000, // 5분간 캐시 허용
      });

      if (isCancelledRef.current) return;

      console.log("✅ 초기 위치 감지 성공:", {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });

      const newCenter = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      // 지도 중심 이동 (줌은 그대로 유지)
      if (
        mapInstance &&
        typeof window !== "undefined" &&
        window.naver &&
        window.naver.maps
      ) {
        const latLng = new window.naver.maps.LatLng(
          newCenter.lat,
          newCenter.lng
        );
        mapInstance.setCenter(latLng);
      }

      // 스토어 상태 업데이트
      setCenter(newCenter);

      isDetectingRef.current = false; // ref 상태 업데이트
      setState((prev) => ({
        ...prev,
        isDetecting: false,
        hasDetected: true,
        position,
        error: null,
      }));

      // 콜백 실행
      memoizedOnLocationDetected(position);
    } catch (error) {
      if (isCancelledRef.current) return;

      console.log("📍 초기 위치 감지 실패:", error);

      const errorMessage =
        error instanceof GeolocationError
          ? error.message
          : "위치 정보를 가져올 수 없습니다.";

      isDetectingRef.current = false; // ref 상태 업데이트
      setState((prev) => ({
        ...prev,
        isDetecting: false,
        hasDetected: true, // 실패해도 감지 시도는 완료
        error: errorMessage,
      }));

      // 에러 콜백 실행
      if (error instanceof GeolocationError) {
        memoizedOnError(error);
      }

      // 기본 위치로 폴백 (선택적)
      if (fallbackToDefault) {
        console.log("📍 기본 위치로 폴백합니다.");
        // 현재 설정된 기본 위치 그대로 사용
      }
    }
  }, [
    enableAutoDetection,
    fallbackToDefault,
    timeout,
    memoizedOnLocationDetected,
    memoizedOnError,
    setCenter,
    mapInstance,
    // state.isDetecting 제거됨 - isDetectingRef로 대체
  ]);

  // 초기 위치 감지 시도 - mapInstance가 준비되면 한 번만 실행
  useEffect(() => {
    if (mapInstance && !hasInitialized.current) {
      detectInitialLocation();
    }

    return () => {
      isCancelledRef.current = true;
    };
  }, [mapInstance, detectInitialLocation]);

  // 수동으로 위치 감지 재시도
  const retryDetection = useCallback(async () => {
    if (isDetectingRef.current) return; // ref로 상태 확인

    hasInitialized.current = false; // 재시도를 위해 초기화 플래그 리셋
    isDetectingRef.current = true; // ref 상태 업데이트

    try {
      setState((prev) => ({
        ...prev,
        isDetecting: true,
        error: null,
      }));

      const position = await getCurrentPosition({
        enableHighAccuracy: true,
        timeout: timeout,
      });

      const newCenter = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      if (
        mapInstance &&
        typeof window !== "undefined" &&
        window.naver &&
        window.naver.maps
      ) {
        const latLng = new window.naver.maps.LatLng(
          newCenter.lat,
          newCenter.lng
        );
        mapInstance.setCenter(latLng);
        mapInstance.setZoom(16);
      }

      setCenter(newCenter);

      isDetectingRef.current = false; // ref 상태 업데이트
      setState((prev) => ({
        ...prev,
        isDetecting: false,
        hasDetected: true,
        position,
        error: null,
      }));

      memoizedOnLocationDetected(position);
    } catch (error) {
      const errorMessage =
        error instanceof GeolocationError
          ? error.message
          : "위치 정보를 가져올 수 없습니다.";

      isDetectingRef.current = false; // ref 상태 업데이트
      setState((prev) => ({
        ...prev,
        isDetecting: false,
        error: errorMessage,
      }));

      if (error instanceof GeolocationError) {
        memoizedOnError(error);
      }
    }
  }, [
    // state.isDetecting 제거됨 - isDetectingRef로 대체
    timeout,
    mapInstance,
    setCenter,
    memoizedOnLocationDetected,
    memoizedOnError,
  ]);

  return {
    ...state,
    retryDetection,
    isSupported: isGeolocationSupported(),
  };
};
