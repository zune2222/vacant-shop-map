"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * 오프라인 감지 상태 인터페이스
 */
interface OfflineDetectionState {
  isOnline: boolean;
  wasOffline: boolean;
  reconnectedAt: Date | null;
  offlineAt: Date | null;
}

/**
 * 오프라인 감지 옵션 인터페이스
 */
interface UseOfflineDetectionOptions {
  onOnline?: () => void;
  onOffline?: () => void;
  enableNotifications?: boolean;
  pingUrl?: string;
  pingInterval?: number;
}

/**
 * 오프라인 상태 감지 훅
 */
export const useOfflineDetection = ({
  onOnline,
  onOffline,
  enableNotifications = true,
  pingUrl = "/api/ping",
  pingInterval = 30000, // 30초마다 핑 테스트
}: UseOfflineDetectionOptions = {}) => {
  const [state, setState] = useState<OfflineDetectionState>({
    isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
    wasOffline: false,
    reconnectedAt: null,
    offlineAt: null,
  });

  // 안정화된 콜백들
  const stableOnOnline = useCallback(() => {
    onOnline?.();
  }, [onOnline]);

  const stableOnOffline = useCallback(() => {
    onOffline?.();
  }, [onOffline]);

  // 네트워크 상태 변경 핸들러
  const handleOnline = useCallback(() => {
    console.log("🌐 네트워크 연결 복구됨");

    const now = new Date();

    setState((prev) => ({
      ...prev,
      isOnline: true,
      wasOffline: prev.wasOffline || !prev.isOnline,
      reconnectedAt: now,
    }));

    // 알림 표시
    if (
      enableNotifications &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      new Notification("연결 복구", {
        body: "인터넷 연결이 복구되었습니다.",
        icon: "/favicon.ico",
        tag: "network-status",
      });
    }

    stableOnOnline();
  }, [enableNotifications, stableOnOnline]);

  const handleOffline = useCallback(() => {
    console.log("🚫 네트워크 연결 끊어짐");

    const now = new Date();

    setState((prev) => ({
      ...prev,
      isOnline: false,
      wasOffline: true,
      offlineAt: now,
    }));

    // 알림 표시
    if (
      enableNotifications &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      new Notification("연결 끊김", {
        body: "인터넷 연결이 끊어졌습니다. 일부 기능이 제한될 수 있습니다.",
        icon: "/favicon.ico",
        tag: "network-status",
      });
    }

    stableOnOffline();
  }, [enableNotifications, stableOnOffline]);

  // 실제 네트워크 연결 테스트 (optional)
  const testConnection = useCallback(async (): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(pingUrl, {
        method: "HEAD",
        cache: "no-cache",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.log("🔍 연결 테스트 실패:", error);
      return false;
    }
  }, [pingUrl]);

  // 초기 알림 권한 요청
  useEffect(() => {
    if (
      enableNotifications &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission().then((permission) => {
        console.log("📢 알림 권한:", permission);
      });
    }
  }, [enableNotifications]);

  // 네트워크 이벤트 리스너 등록
  useEffect(() => {
    if (typeof window === "undefined") return;

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // 초기 상태 설정
    setState((prev) => ({
      ...prev,
      isOnline: navigator.onLine,
    }));

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [handleOnline, handleOffline]);

  // 주기적 연결 테스트 (선택적)
  useEffect(() => {
    if (!pingUrl || !pingInterval) return;

    const interval = setInterval(async () => {
      const isConnected = await testConnection();
      const wasOnline = state.isOnline;

      if (wasOnline && !isConnected) {
        // 온라인이었는데 연결 테스트 실패
        console.log("🔍 핑 테스트 실패 - 오프라인 감지");
        handleOffline();
      } else if (!wasOnline && isConnected) {
        // 오프라인이었는데 연결 테스트 성공
        console.log("🔍 핑 테스트 성공 - 온라인 감지");
        handleOnline();
      }
    }, pingInterval);

    return () => clearInterval(interval);
  }, [
    pingUrl,
    pingInterval,
    testConnection,
    handleOnline,
    handleOffline,
    state.isOnline,
  ]);

  // 오프라인 시간 계산
  const getOfflineDuration = useCallback((): number => {
    if (!state.offlineAt || state.isOnline) return 0;
    return Date.now() - state.offlineAt.getTime();
  }, [state.offlineAt, state.isOnline]);

  // 수동 재연결 시도
  const retry = useCallback(async (): Promise<boolean> => {
    console.log("🔄 수동 재연결 시도");

    const isConnected = await testConnection();

    if (isConnected && !state.isOnline) {
      handleOnline();
      return true;
    }

    return isConnected;
  }, [testConnection, state.isOnline, handleOnline]);

  // 오프라인 메시지 생성
  const getOfflineMessage = useCallback((): string => {
    const duration = getOfflineDuration();

    if (duration === 0) {
      return "현재 오프라인 상태입니다.";
    }

    const minutes = Math.floor(duration / (1000 * 60));

    if (minutes < 1) {
      return "방금 전부터 오프라인 상태입니다.";
    } else if (minutes < 60) {
      return `${minutes}분 전부터 오프라인 상태입니다.`;
    } else {
      const hours = Math.floor(minutes / 60);
      return `${hours}시간 전부터 오프라인 상태입니다.`;
    }
  }, [getOfflineDuration]);

  return {
    ...state,
    retry,
    testConnection,
    getOfflineDuration,
    getOfflineMessage,
    // 유틸리티 속성들
    isReconnected: state.wasOffline && state.isOnline,
    hasBeenOffline: state.wasOffline,
  };
};

/**
 * 간단한 온라인 상태만 체크하는 훅
 */
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
};
