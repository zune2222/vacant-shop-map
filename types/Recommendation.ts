/**
 * 추천 시스템 관련 타입 정의
 */

import { ShopType } from './VacantShop';
import { MarketAnalysis } from './MarketAnalysis';

/**
 * 업종 추천 결과
 */
export interface BusinessTypeRecommendation {
  /** 추천 업종 */
  type: ShopType;
  /** 추천 점수 (1-100) */
  score: number;
  /** 추천 근거 */
  reasons: string[];
  /** 예상 성공률 (%) */
  expectedSuccessRate: number;
  /** 예상 월 매출 (만원) */
  estimatedMonthlyRevenue: {
    min: number;
    max: number;
    average: number;
  };
  /** 경쟁 강도 (1-10) */
  competitionLevel: number;
  /** 시장 진입 난이도 (1-10) */
  entryDifficulty: number;
}

/**
 * 월세 추천 결과
 */
export interface RentRecommendation {
  /** 추천 월세 (만원) */
  recommendedRent: number;
  /** 추천 범위 */
  recommendedRange: {
    min: number;
    max: number;
  };
  /** 시장 평균 대비 비율 (%) */
  marketComparison: number;
  /** 추천 근거 */
  reasons: string[];
  /** 임대 성공 가능성 (%) */
  rentalSuccessProbability: number;
  /** 투자 수익률 예상 (%) */
  expectedROI: number;
}

/**
 * 종합 추천 결과
 */
export interface ComprehensiveRecommendation {
  /** 위치 정보 */
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  
  /** 상권 분석 데이터 */
  marketAnalysis: MarketAnalysis;
  
  /** 업종 추천 (최대 3개, 점수순) */
  businessRecommendations: BusinessTypeRecommendation[];
  
  /** 월세 추천 */
  rentRecommendation: RentRecommendation;
  
  /** 전체 투자 매력도 (1-100) */
  investmentAttractiveness: number;
  
  /** 주요 강점 */
  strengths: string[];
  
  /** 주요 약점/위험요소 */
  weaknesses: string[];
  
  /** 추천 타겟 고객 */
  targetCustomers: {
    primary: string;
    secondary: string[];
  };
  
  /** 추천 생성 일시 */
  generatedAt: Date;
}

/**
 * 추천 가중치 설정
 */
export interface RecommendationWeights {
  /** 유동인구 가중치 */
  footTraffic: number;
  /** 경쟁 강도 가중치 */
  competition: number;
  /** 접근성 가중치 */
  accessibility: number;
  /** 시세 경쟁력 가중치 */
  priceCompetitiveness: number;
  /** 상권 성장성 가중치 */
  growthPotential: number;
}

/**
 * 위험도 평가
 */
export interface RiskAssessment {
  /** 전체 위험도 (1-10, 낮을수록 안전) */
  overallRisk: number;
  /** 세부 위험 요소 */
  riskFactors: {
    /** 경쟁 위험 */
    competitionRisk: number;
    /** 시장 위험 */
    marketRisk: number;
    /** 임대료 상승 위험 */
    rentIncreaseRisk: number;
    /** 유동인구 감소 위험 */
    footTrafficRisk: number;
  };
  /** 위험 완화 방안 */
  mitigationStrategies: string[];
}

/**
 * 계절성 분석
 */
export interface SeasonalAnalysis {
  /** 계절별 매출 변동 (%) */
  seasonalVariation: {
    spring: number;
    summer: number;
    autumn: number;
    winter: number;
  };
  /** 성수기/비수기 정보 */
  peakSeasons: string[];
  lowSeasons: string[];
}

/**
 * 추천 필터 옵션
 */
export interface RecommendationFilters {
  /** 최소 기대 수익률 (%) */
  minROI?: number;
  /** 최대 허용 위험도 (1-10) */
  maxRiskLevel?: number;
  /** 선호 업종 */
  preferredTypes?: ShopType[];
  /** 제외 업종 */
  excludedTypes?: ShopType[];
  /** 최대 투자 금액 (만원) */
  maxInvestment?: number;
}

/**
 * 업종별 상세 분석
 */
export interface BusinessTypeAnalysis {
  type: ShopType;
  /** 시장 크기 */
  marketSize: number;
  /** 성장률 (연간 %) */
  growthRate: number;
  /** 평균 창업 비용 (만원) */
  averageStartupCost: number;
  /** 평균 손익분기점 (개월) */
  averageBreakEvenPeriod: number;
  /** 필요 전문성 수준 (1-10) */
  expertiseRequired: number;
  /** 계절성 영향도 (1-10) */
  seasonalImpact: number;
}