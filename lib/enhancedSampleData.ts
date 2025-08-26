import { 
  EnhancedVacantShop, 
  ShopType, 
  MarketAnalysis,
  ComprehensiveRecommendation,
  BusinessTypeRecommendation,
  RentRecommendation
} from "@/types";

/**
 * 상권 분석이 포함된 확장 샘플 데이터 생성 함수
 */

// 부산대 근처 세부 지역 좌표 (더 많은 마커 생성을 위한 세부 위치들)
const BUSAN_DISTRICTS = [
  // 부산대역 주변
  { name: "부산대역", lat: 35.2291, lng: 129.0831 },
  { name: "부산대역 1번출구", lat: 35.2295, lng: 129.0835 },
  { name: "부산대역 2번출구", lat: 35.2287, lng: 129.0827 },
  { name: "부산대역 3번출구", lat: 35.2293, lng: 129.0825 },
  { name: "부산대역 4번출구", lat: 35.2289, lng: 129.0837 },
  
  // 온천장역 주변
  { name: "온천장역", lat: 35.2312, lng: 129.0856 },
  { name: "온천장역 1번출구", lat: 35.2316, lng: 129.0852 },
  { name: "온천장역 2번출구", lat: 35.2308, lng: 129.0860 },
  { name: "온천장역 3번출구", lat: 35.2314, lng: 129.0858 },
  
  // 부산대 캠퍼스 주변
  { name: "부산대 후문", lat: 35.2295, lng: 129.0812 },
  { name: "부산대 정문", lat: 35.2301, lng: 129.0843 },
  { name: "부산대 북문", lat: 35.2308, lng: 129.0835 },
  { name: "부산대 서문", lat: 35.2298, lng: 129.0802 },
  { name: "부산대 학생회관", lat: 35.2305, lng: 129.0825 },
  { name: "부산대 중앙도서관", lat: 35.2299, lng: 129.0838 },
  { name: "부산대 경영관", lat: 35.2303, lng: 129.0841 },
  { name: "부산대 공학관", lat: 35.2297, lng: 129.0829 },
  
  // 장전역 주변
  { name: "장전역", lat: 35.2261, lng: 129.0789 },
  { name: "장전역 1번출구", lat: 35.2265, lng: 129.0785 },
  { name: "장전역 2번출구", lat: 35.2257, lng: 129.0793 },
  { name: "장전역 3번출구", lat: 35.2263, lng: 129.0791 },
  
  // 상업지구 세분화
  { name: "부산대 상권1", lat: 35.2288, lng: 129.0815 },
  { name: "부산대 상권2", lat: 35.2285, lng: 129.0825 },
  { name: "부산대 상권3", lat: 35.2292, lng: 129.0819 },
  { name: "부산대 상권4", lat: 35.2296, lng: 129.0833 },
  { name: "부산대 상권5", lat: 35.2283, lng: 129.0839 },
  { name: "부산대 상권6", lat: 35.2299, lng: 129.0821 },
  { name: "부산대 상권7", lat: 35.2286, lng: 129.0813 },
  { name: "부산대 상권8", lat: 35.2294, lng: 129.0829 },
  
  // 온천장 상권
  { name: "온천장 상권1", lat: 35.2305, lng: 129.0849 },
  { name: "온천장 상권2", lat: 35.2318, lng: 129.0863 },
  { name: "온천장 상권3", lat: 35.2310, lng: 129.0851 },
  { name: "온천장 상권4", lat: 35.2315, lng: 129.0859 },
  
  // 구서역 주변
  { name: "구서역", lat: 35.2398, lng: 129.0821 },
  { name: "구서역 상권1", lat: 35.2395, lng: 129.0818 },
  { name: "구서역 상권2", lat: 35.2401, lng: 129.0824 },
  
  // 두실역 주변
  { name: "두실역", lat: 35.2243, lng: 129.0763 },
  { name: "두실역 상권1", lat: 35.2240, lng: 129.0760 },
  { name: "두실역 상권2", lat: 35.2246, lng: 129.0766 },
  
  // 남산역 주변
  { name: "남산역", lat: 35.2155, lng: 129.0833 },
  { name: "남산역 상권1", lat: 35.2152, lng: 129.0830 },
  { name: "남산역 상권2", lat: 35.2158, lng: 129.0836 }
];

// 업종별 기본 설정
const BUSINESS_TYPE_CONFIG: Record<ShopType, {
  avgRent: number;
  avgArea: number;
  avgRevenue: number;
  successRate: number;
  competitionLevel: number;
}> = {
  // 음식점 카테고리
  korean_restaurant: { avgRent: 220, avgArea: 25, avgRevenue: 450, successRate: 68, competitionLevel: 8 },
  chinese_restaurant: { avgRent: 180, avgArea: 22, avgRevenue: 380, successRate: 65, competitionLevel: 7 },
  japanese_restaurant: { avgRent: 250, avgArea: 18, avgRevenue: 420, successRate: 72, competitionLevel: 6 },
  western_restaurant: { avgRent: 280, avgArea: 30, avgRevenue: 520, successRate: 65, competitionLevel: 7 },
  fastfood: { avgRent: 300, avgArea: 15, avgRevenue: 380, successRate: 78, competitionLevel: 9 },
  cafe: { avgRent: 200, avgArea: 20, avgRevenue: 320, successRate: 62, competitionLevel: 9 },
  bakery: { avgRent: 180, avgArea: 15, avgRevenue: 290, successRate: 70, competitionLevel: 6 },
  chicken: { avgRent: 150, avgArea: 12, avgRevenue: 380, successRate: 75, competitionLevel: 8 },
  pizza: { avgRent: 160, avgArea: 15, avgRevenue: 420, successRate: 68, competitionLevel: 7 },
  pub: { avgRent: 200, avgArea: 25, avgRevenue: 480, successRate: 60, competitionLevel: 6 },
  
  // 소매업 카테고리
  convenience_store: { avgRent: 280, avgArea: 20, avgRevenue: 380, successRate: 82, competitionLevel: 9 },
  clothing: { avgRent: 350, avgArea: 25, avgRevenue: 420, successRate: 55, competitionLevel: 8 },
  cosmetics: { avgRent: 400, avgArea: 15, avgRevenue: 380, successRate: 68, competitionLevel: 7 },
  electronics: { avgRent: 250, avgArea: 30, avgRevenue: 520, successRate: 70, competitionLevel: 6 },
  pharmacy: { avgRent: 200, avgArea: 18, avgRevenue: 450, successRate: 85, competitionLevel: 4 },
  supermarket: { avgRent: 320, avgArea: 50, avgRevenue: 680, successRate: 75, competitionLevel: 5 },
  bookstore: { avgRent: 180, avgArea: 25, avgRevenue: 220, successRate: 48, competitionLevel: 3 },
  toy_store: { avgRent: 220, avgArea: 20, avgRevenue: 280, successRate: 62, competitionLevel: 4 },
  flower_shop: { avgRent: 150, avgArea: 12, avgRevenue: 180, successRate: 58, competitionLevel: 3 },
  
  // 서비스업 카테고리
  hair_salon: { avgRent: 180, avgArea: 15, avgRevenue: 320, successRate: 72, competitionLevel: 7 },
  nail_salon: { avgRent: 120, avgArea: 10, avgRevenue: 180, successRate: 65, competitionLevel: 6 },
  fitness: { avgRent: 400, avgArea: 80, avgRevenue: 680, successRate: 58, competitionLevel: 8 },
  laundry: { avgRent: 100, avgArea: 15, avgRevenue: 220, successRate: 78, competitionLevel: 3 },
  repair_shop: { avgRent: 120, avgArea: 20, avgRevenue: 250, successRate: 68, competitionLevel: 4 },
  real_estate: { avgRent: 200, avgArea: 15, avgRevenue: 420, successRate: 65, competitionLevel: 8 },
  insurance: { avgRent: 150, avgArea: 12, avgRevenue: 320, successRate: 70, competitionLevel: 6 },
  bank: { avgRent: 300, avgArea: 25, avgRevenue: 0, successRate: 95, competitionLevel: 2 },
  clinic: { avgRent: 250, avgArea: 30, avgRevenue: 680, successRate: 80, competitionLevel: 5 },
  
  // 업무공간 카테고리
  office: { avgRent: 180, avgArea: 40, avgRevenue: 0, successRate: 88, competitionLevel: 5 },
  coworking: { avgRent: 250, avgArea: 60, avgRevenue: 420, successRate: 62, competitionLevel: 7 },
  academy: { avgRent: 200, avgArea: 30, avgRevenue: 520, successRate: 68, competitionLevel: 8 },
  consulting: { avgRent: 220, avgArea: 25, avgRevenue: 680, successRate: 72, competitionLevel: 6 },
  
  // 기타
  etc: { avgRent: 180, avgArea: 25, avgRevenue: 320, successRate: 60, competitionLevel: 5 }
};

// 지역별 특성 (부산대 근처)
const AREA_CHARACTERISTICS: Record<string, { 
  multiplier: number; 
  areaType: 'commercial' | 'residential' | 'mixed' | 'tourist'; 
  footTraffic: number; 
  accessibilityScore: number;
  competitionBonus: number;
}> = {
  // 기본값 설정 함수
  default: { multiplier: 1.0, areaType: 'mixed', footTraffic: 20000, accessibilityScore: 7, competitionBonus: 1 }
};

// 지역별 특성을 동적으로 생성하는 함수
function getAreaCharacteristics(districtName: string) {
  // 기본 특성
  let characteristics = {
    multiplier: 1.0,
    areaType: 'mixed' as const,
    footTraffic: 20000,
    accessibilityScore: 7,
    competitionBonus: 1
  };

  // 지역별 맞춤 특성 
  if (districtName.includes("부산대역")) {
    characteristics = { multiplier: 1.4, areaType: 'commercial', footTraffic: 28000, accessibilityScore: 9, competitionBonus: 2 };
  } else if (districtName.includes("온천장역") || districtName.includes("온천장")) {
    characteristics = { multiplier: 1.2, areaType: 'mixed', footTraffic: 18000, accessibilityScore: 8, competitionBonus: 1 };
  } else if (districtName.includes("부산대") && (districtName.includes("문") || districtName.includes("관"))) {
    characteristics = { multiplier: 1.1, areaType: 'mixed', footTraffic: 24000, accessibilityScore: 7, competitionBonus: 3 };
  } else if (districtName.includes("장전역") || districtName.includes("장전")) {
    characteristics = { multiplier: 1.0, areaType: 'residential', footTraffic: 16000, accessibilityScore: 7, competitionBonus: 1 };
  } else if (districtName.includes("구서역") || districtName.includes("구서")) {
    characteristics = { multiplier: 1.1, areaType: 'residential', footTraffic: 19000, accessibilityScore: 8, competitionBonus: 1 };
  } else if (districtName.includes("두실역") || districtName.includes("두실")) {
    characteristics = { multiplier: 0.8, areaType: 'residential', footTraffic: 14000, accessibilityScore: 6, competitionBonus: 0 };
  } else if (districtName.includes("남산역") || districtName.includes("남산")) {
    characteristics = { multiplier: 1.0, areaType: 'residential', footTraffic: 17000, accessibilityScore: 7, competitionBonus: 1 };
  } else if (districtName.includes("상권")) {
    // 상권 지역들은 약간 더 높은 특성
    characteristics = { multiplier: 1.2, areaType: 'commercial', footTraffic: 22000, accessibilityScore: 8, competitionBonus: 2 };
  }

  return characteristics;
}

/**
 * 상권 분석 데이터 생성
 */
function generateMarketAnalysis(
  location: { latitude: number; longitude: number; address: string },
  district: typeof BUSAN_DISTRICTS[0],
  shopType: ShopType
): MarketAnalysis {
  const areaChar = getAreaCharacteristics(district.name);
  const businessConfig = BUSINESS_TYPE_CONFIG[shopType];
  
  return {
    location,
    footTraffic: {
      dailyAverage: areaChar.footTraffic,
      hourlyData: Array.from({ length: 24 }, (_, i) => {
        const baseValue = areaChar.footTraffic / 24;
        // 시간대별 가중치 (9-10시, 12-14시, 18-20시 피크)
        const timeWeight = [0.3, 0.2, 0.2, 0.2, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.1, 1.0, 1.5, 1.4, 1.2, 1.0, 0.9, 1.0, 1.3, 1.2, 0.9, 0.7, 0.5, 0.4][i];
        return Math.round(baseValue * timeWeight);
      }),
      weeklyData: [1.0, 1.0, 1.0, 1.0, 1.2, 1.5, 1.3].map(w => Math.round(areaChar.footTraffic * w)),
      ageGroups: {
        teens: Math.round(areaChar.footTraffic * 0.15),
        twenties: Math.round(areaChar.footTraffic * 0.25),
        thirties: Math.round(areaChar.footTraffic * 0.22),
        forties: Math.round(areaChar.footTraffic * 0.20),
        fifties: Math.round(areaChar.footTraffic * 0.13),
        seniors: Math.round(areaChar.footTraffic * 0.05)
      },
      gender: {
        male: Math.round(areaChar.footTraffic * 0.48),
        female: Math.round(areaChar.footTraffic * 0.52)
      }
    },
    characteristics: {
      areaType: areaChar.areaType,
      nearbyFacilities: {
        schools: Math.floor(Math.random() * 5) + 1,
        hospitals: Math.floor(Math.random() * 3) + 1,
        officeBuildings: Math.floor(Math.random() * 10) + 5,
        apartments: Math.floor(Math.random() * 15) + 10,
        shoppingMalls: Math.floor(Math.random() * 3) + 1,
        parks: Math.floor(Math.random() * 2) + 1
      },
      accessibilityScore: areaChar.accessibilityScore,
      transportation: {
        subwayStations: [
          {
            name: `${district.name}역`,
            line: "2호선",
            distance: Math.floor(Math.random() * 200) + 50
          }
        ],
        busStops: Math.floor(Math.random() * 5) + 3,
        parkingSpots: Math.floor(Math.random() * 50) + 20
      }
    },
    nearbyBusinesses: {
      radius100m: generateNearbyBusinessDistribution(0.3),
      radius300m: generateNearbyBusinessDistribution(1.0),
      radius500m: generateNearbyBusinessDistribution(1.5),
      radius1km: generateNearbyBusinessDistribution(3.0),
      directCompetitors: generateCompetitors(shopType, 3)
    },
    businessStats: generateBusinessStats(),
    marketPrice: {
      averageRentPerPyeong: Math.round(businessConfig.avgRent / businessConfig.avgArea * areaChar.multiplier),
      priceHistory: Array.from({ length: 6 }, (_, i) => ({
        month: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7),
        averageRent: Math.round(businessConfig.avgRent * areaChar.multiplier * (0.95 + Math.random() * 0.1))
      })),
      priceByArea: {
        under10: Math.round(businessConfig.avgRent * areaChar.multiplier * 0.8),
        from10to20: Math.round(businessConfig.avgRent * areaChar.multiplier * 0.9),
        from20to30: Math.round(businessConfig.avgRent * areaChar.multiplier * 1.0),
        over30: Math.round(businessConfig.avgRent * areaChar.multiplier * 1.2)
      },
      priceByType: Object.fromEntries(
        Object.entries(BUSINESS_TYPE_CONFIG).map(([type, config]) => [
          type,
          Math.round(config.avgRent * areaChar.multiplier)
        ])
      ) as Record<ShopType, number>
    },
    overallScore: Math.round((areaChar.accessibilityScore * 10) + (businessConfig.successRate * 0.6) + (areaChar.footTraffic / 1000)),
    analyzedAt: new Date()
  };
}

/**
 * 주변 업종 분포 생성
 */
function generateNearbyBusinessDistribution(multiplier: number): Record<ShopType, number> {
  return Object.fromEntries(
    Object.keys(BUSINESS_TYPE_CONFIG).map(type => [
      type,
      Math.floor(Math.random() * 10 * multiplier)
    ])
  ) as Record<ShopType, number>;
}

/**
 * 경쟁업체 생성
 */
function generateCompetitors(shopType: ShopType, count: number) {
  return Array.from({ length: count }, (_, i) => ({
    name: `${BUSINESS_TYPE_CONFIG[shopType]} ${i + 1}`,
    type: shopType,
    distance: Math.floor(Math.random() * 500) + 100,
    estimatedRevenue: Math.round(BUSINESS_TYPE_CONFIG[shopType].avgRevenue * (0.8 + Math.random() * 0.4)),
    rating: Math.round((Math.random() * 2 + 3) * 10) / 10
  }));
}

/**
 * 업종별 성공 통계 생성
 */
function generateBusinessStats() {
  return Object.fromEntries(
    Object.entries(BUSINESS_TYPE_CONFIG).map(([type, config]) => [
      type,
      {
        type: type as ShopType,
        successRate: config.successRate,
        averageOperationPeriod: Math.floor(Math.random() * 24) + 12,
        averageRevenue: config.avgRevenue,
        closureRate: 100 - config.successRate,
        revenueToRentRatio: Math.round((config.avgRevenue / config.avgRent) * 10) / 10
      }
    ])
  );
}

/**
 * 종합 추천 결과 생성
 */
function generateComprehensiveRecommendation(
  marketAnalysis: MarketAnalysis,
  currentShopType: ShopType,
  currentRent: number
): ComprehensiveRecommendation {
  const businessRecommendations = generateBusinessRecommendations(marketAnalysis, currentShopType);
  const rentRecommendation = generateRentRecommendation(marketAnalysis, currentRent);
  
  return {
    location: marketAnalysis.location,
    marketAnalysis,
    businessRecommendations,
    rentRecommendation,
    investmentAttractiveness: Math.round((marketAnalysis.overallScore + businessRecommendations[0].score) / 2),
    strengths: [
      "높은 유동인구",
      "우수한 교통 접근성",
      "다양한 주변 편의시설",
      "안정적인 상권"
    ],
    weaknesses: [
      "높은 임대료",
      "치열한 경쟁",
      "주차공간 부족"
    ],
    targetCustomers: {
      primary: "직장인 (20-40대)",
      secondary: ["대학생", "주민", "관광객"]
    },
    generatedAt: new Date()
  };
}

/**
 * 업종 추천 생성
 */
function generateBusinessRecommendations(marketAnalysis: MarketAnalysis, currentType: ShopType): BusinessTypeRecommendation[] {
  const recommendations: BusinessTypeRecommendation[] = [];
  
  // 현재 업종 포함해서 상위 3개 추천
  const topTypes = Object.entries(BUSINESS_TYPE_CONFIG)
    .sort((a, b) => b[1].successRate - a[1].successRate)
    .slice(0, 5);
    
  for (let i = 0; i < Math.min(3, topTypes.length); i++) {
    const [type, config] = topTypes[i];
    const footTrafficScore = Math.min(100, marketAnalysis.footTraffic.dailyAverage / 500);
    const competitionPenalty = config.competitionLevel * 5;
    const score = Math.max(1, Math.min(100, config.successRate + footTrafficScore - competitionPenalty));
    
    recommendations.push({
      type: type as ShopType,
      score: Math.round(score),
      reasons: [
        `이 지역 ${type} 업종 평균 성공률: ${config.successRate}%`,
        `일일 유동인구 ${marketAnalysis.footTraffic.dailyAverage.toLocaleString()}명`,
        `예상 월매출: ${config.avgRevenue}만원`
      ],
      expectedSuccessRate: config.successRate,
      estimatedMonthlyRevenue: {
        min: Math.round(config.avgRevenue * 0.7),
        max: Math.round(config.avgRevenue * 1.3),
        average: config.avgRevenue
      },
      competitionLevel: config.competitionLevel,
      entryDifficulty: Math.ceil(config.competitionLevel * 1.2)
    });
  }
  
  return recommendations;
}

/**
 * 월세 추천 생성
 */
function generateRentRecommendation(marketAnalysis: MarketAnalysis, currentRent: number): RentRecommendation {
  const marketAverage = marketAnalysis.marketPrice.averageRentPerPyeong * 20; // 20평 기준
  const recommendedRent = Math.round(marketAverage * 0.95); // 시장가 대비 5% 할인
  
  return {
    recommendedRent,
    recommendedRange: {
      min: Math.round(recommendedRent * 0.85),
      max: Math.round(recommendedRent * 1.1)
    },
    marketComparison: Math.round((recommendedRent / marketAverage) * 100),
    reasons: [
      "주변 시세 분석 결과",
      "빠른 임대를 위한 경쟁력 있는 가격",
      "투자 수익률 고려"
    ],
    rentalSuccessProbability: Math.min(95, Math.max(60, 100 - Math.abs(currentRent - recommendedRent) / recommendedRent * 100)),
    expectedROI: Math.round((recommendedRent * 12 / (recommendedRent * 10)) * 100) // 단순 ROI 계산
  };
}

/**
 * 확장된 샘플 데이터 생성 (150개)
 */
export function generateEnhancedSampleData(): EnhancedVacantShop[] {
  const shops: EnhancedVacantShop[] = [];
  const businessTypes = Object.keys(BUSINESS_TYPE_CONFIG) as ShopType[];
  
  for (let i = 0; i < 150; i++) {
    const district = BUSAN_DISTRICTS[i % BUSAN_DISTRICTS.length];
    const shopType = businessTypes[i % businessTypes.length];
    const config = BUSINESS_TYPE_CONFIG[shopType];
    const areaChar = getAreaCharacteristics(district.name);
    
    // 위치 좌표에 약간의 랜덤성 추가
    const latitude = district.lat + (Math.random() - 0.5) * 0.01;
    const longitude = district.lng + (Math.random() - 0.5) * 0.01;
    const address = `부산광역시 금정구 ${district.name} ${Math.floor(Math.random() * 200) + 1}번지`;
    
    const area = Math.round(config.avgArea + (Math.random() - 0.5) * 10);
    const monthlyRent = Math.round(config.avgRent * areaChar.multiplier + (Math.random() - 0.5) * 50);
    const deposit = Math.round(monthlyRent * (8 + Math.floor(Math.random() * 5)) / 10) * 10; // 10만원 단위로 반올림
    
    // 기본 상가 정보
    const baseShop: EnhancedVacantShop = {
      id: `enhanced-shop-${String(i + 1).padStart(3, '0')}`,
      name: `${district.name} ${config.avgArea}평 ${shopType} 공실`,
      address,
      latitude,
      longitude,
      area,
      monthlyRent,
      deposit,
      shopType,
      images: [
        `https://via.placeholder.com/400x300/f0f0f0/333333?text=${encodeURIComponent(shopType)}+외관`,
        `https://via.placeholder.com/400x300/f8f8f8/333333?text=${encodeURIComponent(shopType)}+내부`
      ],
      contact: {
        phone: `02-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
        email: `info@${shopType}-${i + 1}.com`,
        agent: `김${['철수', '영희', '민수', '지영', '현우'][i % 5]}`
      },
      description: `${district.name} 상권의 ${area}평 ${shopType} 공실입니다. ${areaChar.areaType === 'commercial' ? '상업지역' : areaChar.areaType === 'residential' ? '주거지역' : '복합지역'}으로 유동인구가 ${areaChar.footTraffic > 30000 ? '매우 많은' : areaChar.footTraffic > 20000 ? '많은' : '적절한'} 위치입니다.`,
      features: [
        "신축 건물",
        "엘리베이터 완비", 
        "주차 가능",
        "24시간 접근 가능"
      ],
      availableFrom: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    };
    
    // 상권 분석 데이터 추가
    const marketAnalysis = generateMarketAnalysis(
      { latitude, longitude, address },
      district,
      shopType
    );
    
    const recommendation = generateComprehensiveRecommendation(marketAnalysis, shopType, monthlyRent);
    
    const investmentScore = Math.round(
      (marketAnalysis.overallScore * 0.4) +
      (recommendation.businessRecommendations[0]?.score || 70) * 0.3 +
      (recommendation.rentRecommendation.rentalSuccessProbability * 0.3)
    );
    
    baseShop.marketAnalysis = marketAnalysis;
    baseShop.recommendation = recommendation;
    baseShop.investmentScore = investmentScore;
    baseShop.recommendedTypes = recommendation.businessRecommendations.slice(0, 3).map(rec => ({
      type: rec.type,
      score: rec.score,
      reason: rec.reasons[0]
    }));
    baseShop.recommendedRent = {
      amount: recommendation.rentRecommendation.recommendedRent,
      range: recommendation.rentRecommendation.recommendedRange,
      confidence: recommendation.rentRecommendation.rentalSuccessProbability
    };
    
    shops.push(baseShop);
  }
  
  return shops;
}

/**
 * 미리 생성된 확장 샘플 데이터
 */
export const ENHANCED_SAMPLE_SHOPS = generateEnhancedSampleData();

/**
 * 상위 투자 매력도 순으로 정렬된 샘플 데이터  
 */
export const TOP_INVESTMENT_SHOPS = ENHANCED_SAMPLE_SHOPS
  .sort((a, b) => (b.investmentScore || 0) - (a.investmentScore || 0))
  .slice(0, 20);

/**
 * 업종별 추천 매장
 */
export const getShopsByRecommendedType = (businessType: ShopType): EnhancedVacantShop[] => {
  return ENHANCED_SAMPLE_SHOPS.filter(shop => 
    shop.recommendedTypes?.some(rec => rec.type === businessType)
  ).slice(0, 10);
};

/**
 * 가격대별 매장 필터링
 */
export const getShopsByPriceRange = (minRent: number, maxRent: number): EnhancedVacantShop[] => {
  return ENHANCED_SAMPLE_SHOPS.filter(shop => 
    shop.monthlyRent >= minRent && shop.monthlyRent <= maxRent
  );
};