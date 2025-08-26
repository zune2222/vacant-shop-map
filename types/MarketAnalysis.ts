/**
 * 상권 분석 관련 타입 정의
 */

import { ShopType } from './VacantShop';

/**
 * 유동인구 데이터
 */
export interface FootTraffic {
  /** 일일 평균 유동인구 */
  dailyAverage: number;
  /** 시간대별 유동인구 (0-23시) */
  hourlyData: number[];
  /** 요일별 평균 (월-일) */
  weeklyData: number[];
  /** 연령대별 분포 */
  ageGroups: {
    teens: number;      // 10대
    twenties: number;   // 20대
    thirties: number;   // 30대
    forties: number;    // 40대
    fifties: number;    // 50대
    seniors: number;    // 60대 이상
  };
  /** 성별 분포 */
  gender: {
    male: number;
    female: number;
  };
}

/**
 * 상권 특성
 */
export interface MarketCharacteristics {
  /** 지역 유형 */
  areaType: 'commercial' | 'residential' | 'office' | 'mixed' | 'tourist';
  /** 주변 주요 시설 */
  nearbyFacilities: {
    schools: number;
    hospitals: number;
    officeBuildings: number;
    apartments: number;
    shoppingMalls: number;
    parks: number;
  };
  /** 교통 접근성 점수 (1-10) */
  accessibilityScore: number;
  /** 주변 교통 */
  transportation: {
    subwayStations: Array<{
      name: string;
      line: string;
      distance: number; // 미터
    }>;
    busStops: number;
    parkingSpots: number;
  };
}

/**
 * 주변 업종 분포
 */
export interface NearbyBusinesses {
  /** 반경별 업종 분포 */
  radius100m: Record<ShopType, number>;
  radius300m: Record<ShopType, number>;
  radius500m: Record<ShopType, number>;
  radius1km: Record<ShopType, number>;
  
  /** 직접 경쟁업체 (같은 업종) */
  directCompetitors: Array<{
    name: string;
    type: ShopType;
    distance: number;
    estimatedRevenue?: number;
    rating?: number;
  }>;
}

/**
 * 업종별 성공 통계
 */
export interface BusinessSuccessStats {
  [key: string]: {
    /** 업종 유형 */
    type: ShopType;
    /** 성공률 (%) */
    successRate: number;
    /** 평균 운영 기간 (개월) */
    averageOperationPeriod: number;
    /** 평균 매출 (만원/월) */
    averageRevenue: number;
    /** 폐업률 (%) */
    closureRate: number;
    /** 임대료 대비 매출 비율 */
    revenueToRentRatio: number;
  };
}

/**
 * 지역 시세 정보
 */
export interface MarketPrice {
  /** 평당 평균 임대료 (만원) */
  averageRentPerPyeong: number;
  /** 최근 6개월 시세 변동 */
  priceHistory: Array<{
    month: string;
    averageRent: number;
  }>;
  /** 면적대별 시세 */
  priceByArea: {
    under10: number;  // 10평 미만
    from10to20: number; // 10-20평
    from20to30: number; // 20-30평
    over30: number;     // 30평 이상
  };
  /** 업종별 평균 임대료 */
  priceByType: Record<ShopType, number>;
}

/**
 * 상권 분석 결과
 */
export interface MarketAnalysis {
  /** 위치 정보 */
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  
  /** 유동인구 데이터 */
  footTraffic: FootTraffic;
  
  /** 상권 특성 */
  characteristics: MarketCharacteristics;
  
  /** 주변 업종 분포 */
  nearbyBusinesses: NearbyBusinesses;
  
  /** 업종별 성공 통계 */
  businessStats: BusinessSuccessStats;
  
  /** 시세 정보 */
  marketPrice: MarketPrice;
  
  /** 상권 점수 (1-100) */
  overallScore: number;
  
  /** 분석 생성 일시 */
  analyzedAt: Date;
}

/**
 * 지역 유형 라벨
 */
export const AREA_TYPE_LABELS: Record<MarketCharacteristics['areaType'], string> = {
  commercial: '상업지역',
  residential: '주거지역',
  office: '업무지역',
  mixed: '복합지역',
  tourist: '관광지역'
};

/**
 * 분석 매트릭스
 */
export interface AnalysisMetrics {
  /** 경쟁 강도 (1-10) */
  competitionIntensity: number;
  /** 고객 접근성 (1-10) */
  customerAccessibility: number;
  /** 임대료 경쟁력 (1-10) */
  rentCompetitiveness: number;
  /** 성장 잠재력 (1-10) */
  growthPotential: number;
}