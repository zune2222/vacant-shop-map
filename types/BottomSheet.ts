/**
 * 바텀시트 높이 상태
 */
export type BottomSheetHeight = "collapsed" | "partial" | "full";

/**
 * 바텀시트 상태 인터페이스
 */
export interface BottomSheetState {
  isOpen: boolean; // 바텀시트 열림/닫힘 상태
  shopId: string | null; // 현재 선택된 상가 ID
  height: BottomSheetHeight; // 바텀시트 높이 상태
  isAnimating: boolean; // 애니메이션 진행 중 여부
}

/**
 * 바텀시트 초기 상태
 */
export const INITIAL_BOTTOM_SHEET_STATE: BottomSheetState = {
  isOpen: false,
  shopId: null,
  height: "collapsed",
  isAnimating: false,
};

/**
 * 바텀시트 높이별 클래스 매핑
 */
export const BOTTOM_SHEET_HEIGHT_CLASSES: Record<BottomSheetHeight, string> = {
  collapsed: "translate-y-[calc(100%-120px)]", // 120px만 보이도록
  partial: "translate-y-[40%]", // 60% 높이
  full: "translate-y-0", // 전체 높이
};

/**
 * 바텀시트 높이별 실제 높이 값 (백분율)
 */
export const BOTTOM_SHEET_HEIGHT_VALUES: Record<BottomSheetHeight, number> = {
  collapsed: 15, // 15%
  partial: 60, // 60%
  full: 90, // 90%
};

/**
 * 바텀시트 액션 타입
 */
export interface BottomSheetActions {
  openSheet: (shopId: string, height?: BottomSheetHeight) => void;
  closeSheet: () => void;
  setHeight: (height: BottomSheetHeight) => void;
  setAnimating: (isAnimating: boolean) => void;
}

/**
 * 바텀시트 제스처 관련 타입
 */
export interface BottomSheetGesture {
  isDragging: boolean;
  startY: number;
  currentY: number;
  velocityY: number;
}

/**
 * 바텀시트 제스처 임계값
 */
export const BOTTOM_SHEET_THRESHOLDS = {
  SWIPE_VELOCITY: 300, // 스와이프 속도 임계값 (px/s)
  DRAG_THRESHOLD: 50, // 드래그 거리 임계값 (px)
  ANIMATION_DURATION: 300, // 애니메이션 지속 시간 (ms)
};
