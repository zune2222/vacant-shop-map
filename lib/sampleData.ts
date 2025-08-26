import { VacantShop, MapMarker, MapFilter } from "@/types";

/**
 * 샘플 공실 상가 데이터 (부산 지역 - 초기 지도 위치 근처)
 */
export const SAMPLE_VACANT_SHOPS: VacantShop[] = [
  {
    id: "shop-001",
    name: "부산진구 카페 공실",
    address: "부산광역시 부산진구 중앙대로 708",
    latitude: 35.2289, // 초기 위치 근처
    longitude: 129.0813,
    area: 15,
    monthlyRent: 180,
    deposit: 1000,
    shopType: "cafe",
    images: [
      "https://via.placeholder.com/400x300/f0f0f0/333333?text=카페+전경",
      "https://via.placeholder.com/400x300/f8f8f8/333333?text=내부+모습",
    ],
    contact: {
      phone: "051-1234-5678",
      email: "info@sample-cafe.com",
    },
    description:
      "부산진구 중심가 근처의 좋은 접근성을 가진 카페 공실입니다. 직장인들이 많은 지역으로 매출이 안정적입니다.",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "shop-002",
    name: "서면역 소매점 공실",
    address: "부산광역시 부산진구 서면로 38",
    latitude: 35.225, // 초기 위치에서 약간 남쪽
    longitude: 129.085,
    area: 25,
    monthlyRent: 250,
    deposit: 1500,
    shopType: "clothing",
    images: [
      "https://via.placeholder.com/400x300/e0e0e0/333333?text=매장+외관",
    ],
    contact: {
      phone: "051-2345-6789",
    },
    description: "서면역 근처의 소매점 공실로 유동인구가 많은 위치입니다.",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "shop-003",
    name: "부산진구 사무실",
    address: "부산광역시 부산진구 동천로 109",
    latitude: 35.232, // 초기 위치에서 약간 북쪽
    longitude: 129.078,
    area: 40,
    monthlyRent: 120,
    deposit: 800,
    shopType: "office",
    images: [],
    contact: {
      phone: "051-3456-7890",
      email: "office@busanjin.com",
    },
    description:
      "부산진구 중심가의 사무실 공간입니다. 조용한 업무 환경을 제공합니다.",
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-22"),
  },
  {
    id: "shop-004",
    name: "전포동 음식점 공실",
    address: "부산광역시 부산진구 전포대로 175",
    latitude: 35.226, // 초기 위치 근처 추가 마커
    longitude: 129.079,
    area: 20,
    monthlyRent: 200,
    deposit: 1200,
    shopType: "korean_restaurant",
    images: [
      "https://via.placeholder.com/400x300/f5f5f5/333333?text=음식점+내부",
    ],
    contact: {
      phone: "051-4567-8901",
    },
    description:
      "전포카페거리 근처의 음식점 공실입니다. 젊은층 고객이 많은 지역입니다.",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-25"),
  },
  {
    id: "shop-005",
    name: "부전동 기타 상가",
    address: "부산광역시 부산진구 중앙대로 668",
    latitude: 35.231, // 초기 위치 근처 추가 마커
    longitude: 129.084,
    area: 30,
    monthlyRent: 150,
    deposit: 900,
    shopType: "convenience_store",
    images: [],
    contact: {
      phone: "051-5678-9012",
      email: "info@bujeon.com",
    },
    description: "부전동 상업지구의 다목적 상가 공간입니다.",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-28"),
  },
];

/**
 * 샘플 지도 마커 데이터
 */
export const SAMPLE_MAP_MARKERS: MapMarker[] = SAMPLE_VACANT_SHOPS.map(
  (shop) => ({
    id: shop.id,
    position: {
      lat: shop.latitude,
      lng: shop.longitude,
    },
    shopType: shop.shopType,
    isActive: true,
    name: shop.name,
    monthlyRent: shop.monthlyRent,
  })
);

/**
 * 샘플 필터 데이터
 */
export const SAMPLE_FILTERS: MapFilter[] = [
  {
    rentRange: [0, 200],
    areaRange: [10, 30],
    shopTypes: ["cafe", "korean_restaurant", "clothing"],
    region: "부산진구",
  },
  {
    rentRange: [100, 300],
    areaRange: [20, 50],
    shopTypes: ["office", "convenience_store"],
    region: undefined,
  },
];

/**
 * 필터링 유틸리티 함수
 */
export const filterVacantShops = (
  shops: VacantShop[],
  filter: MapFilter
): VacantShop[] => {
  return shops.filter((shop) => {
    // 임대료 필터
    const rentInRange =
      shop.monthlyRent >= filter.rentRange[0] &&
      shop.monthlyRent <= filter.rentRange[1];

    // 면적 필터
    const areaInRange =
      shop.area >= filter.areaRange[0] && shop.area <= filter.areaRange[1];

    // 상가 유형 필터
    const typeMatches = filter.shopTypes.includes(shop.shopType);

    // 지역 필터 (선택사항)
    const regionMatches =
      !filter.region || shop.address.includes(filter.region);

    return rentInRange && areaInRange && typeMatches && regionMatches;
  });
};

/**
 * 마커로 변환하는 유틸리티 함수
 */
export const convertShopsToMarkers = (shops: VacantShop[]): MapMarker[] => {
  return shops.map((shop) => ({
    id: shop.id,
    position: {
      lat: shop.latitude,
      lng: shop.longitude,
    },
    shopType: shop.shopType,
    isActive: true,
    name: shop.name,
    monthlyRent: shop.monthlyRent,
  }));
};
