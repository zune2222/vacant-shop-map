"use client";

import { useState } from "react";
import { useOfflineDetection } from "@/hooks/useOfflineDetection";

interface OfflineNotificationProps {
  className?: string;
  position?: "top" | "bottom";
  showReconnectButton?: boolean;
  autoHide?: boolean;
  autoHideDelay?: number;
}

export default function OfflineNotification({
  className = "",
  position = "top",
  showReconnectButton = true,
  autoHide = true,
  autoHideDelay = 5000,
}: OfflineNotificationProps) {
  const [isManuallyHidden, setIsManuallyHidden] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);

  const { isOnline, wasOffline, retry, getOfflineMessage, isReconnected } =
    useOfflineDetection({
      onOnline: () => {
        setIsReconnecting(false);
        // 재연결 시 잠시 알림 표시 후 자동 숨김
        if (autoHide) {
          setTimeout(() => {
            setIsManuallyHidden(true);
          }, autoHideDelay);
        }
      },
      onOffline: () => {
        setIsManuallyHidden(false);
        setIsReconnecting(false);
      },
    });

  const handleReconnect = async () => {
    setIsReconnecting(true);
    try {
      const success = await retry();
      if (!success) {
        setTimeout(() => setIsReconnecting(false), 2000);
      }
    } catch (error) {
      console.error("재연결 실패:", error);
      setIsReconnecting(false);
    }
  };

  const handleDismiss = () => {
    setIsManuallyHidden(true);
  };

  // 알림을 표시할 조건
  const shouldShow =
    (!isOnline || (isReconnected && wasOffline)) && !isManuallyHidden;

  if (!shouldShow) return null;

  const positionClasses = {
    top: "top-0",
    bottom: "bottom-0",
  };

  const notificationClass = isOnline
    ? "bg-green-500 border-green-600"
    : "bg-red-500 border-red-600";

  const iconColor = isOnline ? "text-green-100" : "text-red-100";

  return (
    <div
      className={`
        fixed left-0 right-0 ${positionClasses[position]} z-50
        ${notificationClass} border-b text-white shadow-lg
        transform transition-transform duration-300 ease-in-out
        ${className}
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* 상태 아이콘 및 메시지 */}
          <div className="flex items-center">
            {/* 상태 아이콘 */}
            <div className="flex-shrink-0">
              {isOnline ? (
                // 온라인 아이콘 (연결됨)
                <svg
                  className={`w-5 h-5 ${iconColor}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                // 오프라인 아이콘 (연결 끊김)
                <svg
                  className={`w-5 h-5 ${iconColor}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </div>

            {/* 메시지 */}
            <div className="ml-3">
              <p className="text-sm font-medium">
                {isOnline ? "연결이 복구되었습니다!" : "인터넷 연결 없음"}
              </p>
              <p className="text-xs opacity-90">
                {isOnline
                  ? "정상적으로 서비스를 이용할 수 있습니다."
                  : getOfflineMessage()}
              </p>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex items-center space-x-2">
            {/* 재연결 버튼 (오프라인일 때만) */}
            {!isOnline && showReconnectButton && (
              <button
                onClick={handleReconnect}
                disabled={isReconnecting}
                className="
                  bg-white bg-opacity-20 hover:bg-opacity-30 
                  px-3 py-1 rounded text-sm font-medium
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50
                "
              >
                {isReconnecting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-3 w-3"
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
                    재연결 중...
                  </span>
                ) : (
                  "다시 시도"
                )}
              </button>
            )}

            {/* 닫기 버튼 */}
            <button
              onClick={handleDismiss}
              className="
                bg-white bg-opacity-20 hover:bg-opacity-30 
                p-1 rounded text-sm
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50
              "
              aria-label="알림 닫기"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 간단한 오프라인 배너 (최소한의 UI)
 */
export function OfflineBanner({
  className = "",
}: Pick<OfflineNotificationProps, "className">) {
  const { isOnline } = useOfflineDetection();

  if (isOnline) return null;

  return (
    <div
      className={`
        bg-yellow-500 text-yellow-900 px-4 py-2 text-center text-sm font-medium
        ${className}
      `}
      role="alert"
    >
      ⚠️ 오프라인 상태입니다. 일부 기능이 제한될 수 있습니다.
    </div>
  );
}

/**
 * 네트워크 상태 인디케이터 (작은 아이콘)
 */
export function NetworkStatusIndicator({
  className = "",
}: Pick<OfflineNotificationProps, "className">) {
  const { isOnline, isReconnected } = useOfflineDetection();

  return (
    <div
      className={`
        inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
        ${
          isOnline
            ? isReconnected
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-600"
            : "bg-red-100 text-red-800"
        }
        ${className}
      `}
      title={isOnline ? "온라인" : "오프라인"}
    >
      <div
        className={`
          w-2 h-2 rounded-full mr-1
          ${
            isOnline
              ? isReconnected
                ? "bg-green-500"
                : "bg-gray-400"
              : "bg-red-500"
          }
        `}
      />
      {isOnline ? "온라인" : "오프라인"}
    </div>
  );
}
