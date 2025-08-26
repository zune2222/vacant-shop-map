import { MarketAnalysis } from './MarketAnalysis';
import { ComprehensiveRecommendation } from './Recommendation';

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
 * 상권 분석이 포함된 확장 공실 상가 정보
 */
export interface EnhancedVacantShop extends VacantShop {
  /** 상권 분석 데이터 */
  marketAnalysis?: MarketAnalysis;
  /** 종합 추천 결과 */
  recommendation?: ComprehensiveRecommendation;
  /** 투자 매력도 점수 (1-100) */
  investmentScore?: number;
  /** 추천 업종 (상위 3개) */
  recommendedTypes?: Array<{
    type: ShopType;
    score: number;
    reason: string;
  }>;
  /** 적정 월세 추천 */
  recommendedRent?: {
    amount: number;
    range: { min: number; max: number };
    confidence: number; // 신뢰도 (%)
  };
}

/**
 * 상가 유형 (확장된 분류)
 */
export type ShopType = 
  // 음식점 카테고리
  | "korean_restaurant" | "chinese_restaurant" | "japanese_restaurant" | "western_restaurant" 
  | "fastfood" | "cafe" | "bakery" | "chicken" | "pizza" | "pub"
  
  // 소매업 카테고리  
  | "convenience_store" | "clothing" | "cosmetics" | "electronics" | "pharmacy"
  | "supermarket" | "bookstore" | "toy_store" | "flower_shop"
  
  // 서비스업 카테고리
  | "hair_salon" | "nail_salon" | "fitness" | "laundry" | "repair_shop"
  | "real_estate" | "insurance" | "bank" | "clinic"
  
  // 사무실/업무공간
  | "office" | "coworking" | "academy" | "consulting"
  
  // 기타
  | "etc";

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
  // 음식점
  korean_restaurant: "한식당",
  chinese_restaurant: "중식당", 
  japanese_restaurant: "일식당",
  western_restaurant: "양식당",
  fastfood: "패스트푸드",
  cafe: "카페",
  bakery: "베이커리",
  chicken: "치킨점",
  pizza: "피자점",
  pub: "주점",
  
  // 소매업
  convenience_store: "편의점",
  clothing: "의류점",
  cosmetics: "화장품점",
  electronics: "전자제품",
  pharmacy: "약국",
  supermarket: "마트",
  bookstore: "서점",
  toy_store: "장난감점",
  flower_shop: "꽃집",
  
  // 서비스업
  hair_salon: "미용실",
  nail_salon: "네일샵",
  fitness: "헬스장",
  laundry: "세탁소",
  repair_shop: "수리점",
  real_estate: "부동산",
  insurance: "보험",
  bank: "은행",
  clinic: "병원",
  
  // 업무공간
  office: "사무실",
  coworking: "공유오피스",
  academy: "학원",
  consulting: "컨설팅",
  
  // 기타
  etc: "기타"
};

/**
 * 상가 유형 그룹
 */
export const SHOP_TYPE_GROUPS = {
  restaurant: ["korean_restaurant", "chinese_restaurant", "japanese_restaurant", "western_restaurant", "fastfood", "cafe", "bakery", "chicken", "pizza", "pub"],
  retail: ["convenience_store", "clothing", "cosmetics", "electronics", "pharmacy", "supermarket", "bookstore", "toy_store", "flower_shop"],
  service: ["hair_salon", "nail_salon", "fitness", "laundry", "repair_shop", "real_estate", "insurance", "bank", "clinic"],
  office: ["office", "coworking", "academy", "consulting"],
  etc: ["etc"]
} as const;

/**
 * 상가 유형 색상 매핑 (지도 마커용)
 */
export const SHOP_TYPE_COLORS: Record<ShopType, string> = {
  // 음식점 - 빨간색 계열
  korean_restaurant: "#dc2626",
  chinese_restaurant: "#ef4444",
  japanese_restaurant: "#f87171", 
  western_restaurant: "#fca5a5",
  fastfood: "#fed7d7",
  cafe: "#92400e",
  bakery: "#d97706",
  chicken: "#f59e0b",
  pizza: "#fbbf24",
  pub: "#7c2d12",
  
  // 소매업 - 파란색 계열
  convenience_store: "#1e40af",
  clothing: "#2563eb",
  cosmetics: "#3b82f6",
  electronics: "#60a5fa",
  pharmacy: "#93c5fd",
  supermarket: "#1e3a8a",
  bookstore: "#312e81",
  toy_store: "#4338ca",
  flower_shop: "#6366f1",
  
  // 서비스업 - 초록색 계열
  hair_salon: "#047857",
  nail_salon: "#059669", 
  fitness: "#0d9488",
  laundry: "#14b8a6",
  repair_shop: "#06b6d4",
  real_estate: "#0891b2",
  insurance: "#0e7490",
  bank: "#155e75",
  clinic: "#164e63",
  
  // 업무공간 - 보라색 계열
  office: "#7c3aed",
  coworking: "#8b5cf6",
  academy: "#a78bfa",
  consulting: "#c4b5fd",
  
  // 기타 - 회색
  etc: "#6b7280"
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
