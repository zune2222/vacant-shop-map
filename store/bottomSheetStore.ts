import { create } from "zustand";

/**
 * 바텀시트 높이 단계
 */
export type BottomSheetHeight = "collapsed" | "partial" | "full";

/**
 * 바텀시트 상태 인터페이스
 */
interface BottomSheetState {
  isOpen: boolean;
  shopId: string | null;
  height: BottomSheetHeight;
  isAnimating: boolean;
}

/**
 * 바텀시트 액션 인터페이스
 */
interface BottomSheetActions {
  openSheet: (shopId: string) => void;
  closeSheet: () => void;
  clearShopId: () => void; // 애니메이션 완료 후 shopId 초기화용
  setHeight: (height: BottomSheetHeight) => void;
  setAnimating: (isAnimating: boolean) => void;
}

/**
 * 바텀시트 스토어 타입
 */
type BottomSheetStore = BottomSheetState & BottomSheetActions;

/**
 * 바텀시트 Zustand 스토어
 */
export const useBottomSheetStore = create<BottomSheetStore>((set, get) => ({
  // 초기 상태
  isOpen: false,
  shopId: null,
  height: "partial",
  isAnimating: false,

  // 액션들
  openSheet: (shopId: string) => {
    console.log("📋 Opening bottom sheet for shop:", shopId);
    set({
      isOpen: true,
      shopId,
      height: "partial",
      isAnimating: true,
    });
  },

  closeSheet: () => {
    console.log("📋 Closing bottom sheet");
    set({
      isOpen: false,
      // shopId는 즉시 초기화하지 않음 (애니메이션 완료 후에 초기화)
      height: "partial",
      isAnimating: true,
    });
  },

  clearShopId: () => {
    console.log("📋 Clearing shopId after animation");
    set({
      shopId: null,
    });
  },

  setHeight: (height: BottomSheetHeight) => {
    const currentHeight = get().height;
    if (currentHeight !== height) {
      console.log(
        "📋 Changing bottom sheet height from",
        currentHeight,
        "to",
        height
      );
      set({ height, isAnimating: true });
    }
  },

  setAnimating: (isAnimating: boolean) => {
    set({ isAnimating });
  },
}));
