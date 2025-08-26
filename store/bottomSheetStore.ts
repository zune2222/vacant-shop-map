import { create } from "zustand";

/**
 * 상점 모달 상태 인터페이스
 */
interface ShopModalState {
  isOpen: boolean;
  shopId: string | null;
}

/**
 * 상점 모달 액션 인터페이스
 */
interface ShopModalActions {
  openModal: (shopId: string) => void;
  closeModal: () => void;
  clearShopId: () => void;
}

/**
 * 상점 모달 스토어 타입
 */
type ShopModalStore = ShopModalState & ShopModalActions;

/**
 * 상점 모달 Zustand 스토어
 */
export const useShopModalStore = create<ShopModalStore>((set) => ({
  // 초기 상태
  isOpen: false,
  shopId: null,

  // 액션들
  openModal: (shopId: string) => {
    console.log("📋 Opening shop modal for shop:", shopId);
    set({
      isOpen: true,
      shopId,
    });
  },

  closeModal: () => {
    console.log("📋 Closing shop modal");
    set({
      isOpen: false,
      shopId: null,
    });
  },

  clearShopId: () => {
    console.log("📋 Clearing shopId");
    set({
      shopId: null,
    });
  },
}));

// 기존 API와의 호환성을 위한 별칭 (점진적 마이그레이션용)
export const useBottomSheetStore = useShopModalStore;
