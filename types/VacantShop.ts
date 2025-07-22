/**
 * 공실 상가 정보 인터페이스
 */
export interface VacantShop {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  area: number; // 면적 (평)
  monthlyRent: number; // 월 임대료 (만원)
  deposit: number; // 보증금 (만원)
  shopType: ShopType;
  images: string[]; // 이미지 URL 배열
  contact: Contact;
  description: string;
  availableFrom?: string; // 입주 가능일
  features?: string[]; // 상점 특징들
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 상가 유형
 */
export type ShopType = "restaurant" | "retail" | "office" | "etc";

/**
 * 연락처 정보
 */
export interface Contact {
  phone: string;
  email?: string;
  agent?: string; // 담당자 이름
}

/**
 * 상가 유형 라벨 매핑
 */
export const SHOP_TYPE_LABELS: Record<ShopType, string> = {
  restaurant: "음식점",
  retail: "소매업",
  office: "사무실",
  etc: "기타",
};

/**
 * 상가 유형 색상 매핑 (지도 마커용)
 */
export const SHOP_TYPE_COLORS: Record<ShopType, string> = {
  restaurant: "#ef4444", // 빨간색
  retail: "#3b82f6", // 파란색
  office: "#10b981", // 초록색
  etc: "#6b7280", // 회색
};

/**
 * 공실 상가 생성 시 필요한 데이터 (ID, 날짜 제외)
 */
export type CreateVacantShopData = Omit<
  VacantShop,
  "id" | "createdAt" | "updatedAt"
>;

/**
 * 공실 상가 업데이트 시 필요한 데이터 (선택적 필드들)
 */
export type UpdateVacantShopData = Partial<
  Omit<VacantShop, "id" | "createdAt" | "updatedAt">
>;
