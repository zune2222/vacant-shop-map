"use client";

import { useRef, useEffect, ReactNode, useState, useCallback } from "react";
import { motion, PanInfo, useAnimation, AnimatePresence } from "framer-motion";
import {
  useBottomSheetStore,
  BottomSheetHeight,
} from "@/store/bottomSheetStore";

/**
 * 스냅 포인트 구성
 */
interface SnapPoints {
  collapsed: number;
  partial: number;
  full: number;
}

/**
 * 바텀시트 프로퍼티
 */
interface BottomSheetProps {
  children: ReactNode;
  snapPoints?: SnapPoints;
  minHeight?: number;
  className?: string;
  backdrop?: boolean;
  closeOnBackdropClick?: boolean;
  dragHandle?: boolean;
}

export default function BottomSheet({
  children,
  minHeight = 80,
  className = "",
  backdrop = true,
  closeOnBackdropClick = true,
  dragHandle = true,
}: BottomSheetProps) {
  const {
    isOpen,
    height,
    closeSheet,
    setHeight,
    setAnimating,
    isAnimating,
    clearShopId,
  } = useBottomSheetStore();
  const controls = useAnimation();
  const sheetRef = useRef<HTMLDivElement>(null);
  const [windowHeight, setWindowHeight] = useState(800);
  const [snapPoints, setSnapPoints] = useState<SnapPoints>({
    collapsed: 0,
    partial: 320,
    full: 680,
  });

  // 클라이언트에서만 window 값 설정
  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateDimensions = () => {
        const height = window.innerHeight;
        setWindowHeight(height);
        setSnapPoints({
          collapsed: 0,
          partial: 320,
          full: Math.floor(height * 0.85),
        });
        console.log("📐 Window height updated:", height);
      };

      updateDimensions();
      window.addEventListener("resize", updateDimensions);
      return () => window.removeEventListener("resize", updateDimensions);
    }
  }, []);

  /**
   * 높이별 transform 값 계산 (translateY) - 메모화로 무한 루프 방지
   */
  const getTransformForHeight = useCallback(
    (targetHeight: BottomSheetHeight): string => {
      switch (targetHeight) {
        case "collapsed":
          return "translateY(100%)"; // 완전히 숨김
        case "partial":
          return `translateY(calc(100% - ${snapPoints.partial}px))`; // 부분적으로 표시
        case "full":
          return `translateY(calc(100% - ${snapPoints.full}px))`; // 거의 전체 화면
        default:
          return `translateY(calc(100% - ${snapPoints.partial}px))`;
      }
    },
    [snapPoints.partial, snapPoints.full]
  ); // snapPoints 의존성 추가

  /**
   * 드래그 종료 핸들러
   */
  const handleDragEnd = (_: any, info: PanInfo) => {
    const { offset, velocity } = info;

    console.log("🎯 Drag ended - offset:", offset.y, "velocity:", velocity.y);

    // 빠른 제스처인지 확인
    const isQuickGesture = Math.abs(velocity.y) > 500;

    let targetHeight: BottomSheetHeight;

    if (isQuickGesture) {
      if (velocity.y > 0) {
        // 아래로 빠르게 드래그 -> 닫기 또는 낮은 높이로
        targetHeight = height === "full" ? "partial" : "collapsed";
      } else {
        // 위로 빠르게 드래그 -> 높은 높이로
        targetHeight = height === "partial" ? "full" : "partial";
      }
    } else {
      // 드래그 거리에 따라 결정
      if (offset.y > 100) {
        targetHeight = height === "full" ? "partial" : "collapsed";
      } else if (offset.y < -100) {
        targetHeight = height === "partial" ? "full" : "partial";
      } else {
        targetHeight = height; // 현재 상태 유지
      }
    }

    console.log("🎯 Target height:", targetHeight);

    // collapsed 상태면 시트 닫기
    if (targetHeight === "collapsed") {
      closeSheet();
    } else {
      setHeight(targetHeight);
    }
  };

  /**
   * 백드롭 클릭 핸들러
   */
  const handleBackdropClick = () => {
    if (closeOnBackdropClick) {
      console.log("🎭 Backdrop clicked - closing sheet");
      closeSheet();
    }
  };

  /**
   * 바텀시트 열기/닫기 애니메이션
   */
  useEffect(() => {
    if (isOpen) {
      console.log("📋 Opening bottom sheet - height:", height);
      const transform = getTransformForHeight(height);
      console.log("📋 Target transform:", transform);

      setAnimating(true);
      controls
        .start({
          transform,
          transition: { duration: 0.4, ease: [0.4, 0.0, 0.2, 1] },
        })
        .then(() => {
          setAnimating(false);
        });
    } else {
      console.log("📋 Closing bottom sheet");
      setAnimating(true);
      controls
        .start({
          transform: "translateY(100%)", // 완전히 숨김
          transition: { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] },
        })
        .then(() => {
          console.log("📋 Close animation completed");
          setAnimating(false);
          clearShopId(); // 애니메이션 완료 후 shopId 초기화
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isOpen,
    height,
    controls,
    getTransformForHeight,
    // snapPoints 제거 - getTransformForHeight의 의존성으로 관리됨
    // setAnimating, clearShopId 제거 - Zustand 스토어 함수들은 안정적 (무한 루프 방지)
  ]); // 무한 루프 방지를 위한 최소한의 의존성만 유지

  // 높이를 최대값으로 고정 (transform으로만 위치 조절)
  const fixedHeight = Math.max(snapPoints.full, windowHeight * 0.9);

  return (
    <AnimatePresence mode="wait">
      {(isOpen || isAnimating) && (
        <>
          {/* 백드롭 */}
          {backdrop && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: isOpen ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleBackdropClick}
            />
          )}

          {/* 바텀시트 */}
          <motion.div
            key="bottom-sheet"
            ref={sheetRef}
            className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 overflow-hidden shadow-2xl ${className}`}
            initial={{ transform: "translateY(100%)" }} // 초기에는 완전히 숨겨짐
            animate={controls}
            exit={{
              transform: "translateY(100%)",
              transition: { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] },
            }}
            drag="y"
            dragConstraints={{
              top: -(snapPoints.full - snapPoints.partial), // 위쪽 제한
              bottom: fixedHeight - snapPoints.partial, // 아래쪽 제한
            }}
            dragElastic={{ top: 0.1, bottom: 0.2 }}
            onDragEnd={handleDragEnd}
            style={{
              height: fixedHeight, // 높이 고정
              minHeight: minHeight,
            }}
          >
            {/* 드래그 핸들 */}
            {dragHandle && (
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full cursor-grab active:cursor-grabbing" />
              </div>
            )}

            {/* 콘텐츠 영역 - 현재 높이에 맞게 제한 */}
            <div
              className="flex-1 overflow-y-auto px-4 pb-4"
              style={{
                maxHeight:
                  height === "full"
                    ? snapPoints.full - 40
                    : snapPoints.partial - 40,
              }}
            >
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
