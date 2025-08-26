/**
 * 상권 분석 엔진
 * 위치 기반 상권 분석 및 투자 가치 평가를 수행
 */

import { 
  EnhancedVacantShop, 
  ShopType, 
  MarketAnalysis,
  ComprehensiveRecommendation,
  BusinessTypeRecommendation,
  RentRecommendation,
  AnalysisMetrics,
  RiskAssessment,
  SeasonalAnalysis,
  SHOP_TYPE_GROUPS
} from "@/types";

/**
 * 상권 분석 엔진 클래스
 */
export class MarketAnalysisEngine {
  private shops: EnhancedVacantShop[];
  
  constructor(shops: EnhancedVacantShop[]) {
    this.shops = shops;
  }

  /**
   * 특정 위치의 상권 분석 수행
   */
  analyzeLocation(
    latitude: number, 
    longitude: number, 
    radius: number = 1000
  ): MarketAnalysis | null {
    const nearbyShops = this.findNearbyShops(latitude, longitude, radius);
    if (nearbyShops.length === 0) return null;

    return this.performMarketAnalysis(nearbyShops, latitude, longitude);
  }

  /**
   * 업종 추천 알고리즘
   */
  recommendBusinessTypes(
    marketAnalysis: MarketAnalysis,
    excludeTypes: ShopType[] = []
  ): BusinessTypeRecommendation[] {
    const allBusinessTypes = Object.keys(SHOP_TYPE_GROUPS).flatMap(
      group => SHOP_TYPE_GROUPS[group as keyof typeof SHOP_TYPE_GROUPS]
    ) as ShopType[];

    const recommendations = allBusinessTypes
      .filter(type => !excludeTypes.includes(type))
      .map(type => this.calculateBusinessRecommendation(marketAnalysis, type))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    return recommendations;
  }

  /**
   * 월세 추천 알고리즘
   */
  recommendRent(
    marketAnalysis: MarketAnalysis,
    area: number,
    targetBusinessType?: ShopType
  ): RentRecommendation {
    const marketPrice = marketAnalysis.marketPrice;
    const baseRent = marketPrice.averageRentPerPyeong * area;
    
    // 상권 점수 기반 보정
    const locationMultiplier = Math.max(0.7, Math.min(1.5, marketAnalysis.overallScore / 70));
    
    // 업종별 보정 (지정된 경우)
    const businessMultiplier = targetBusinessType ? 
      (marketPrice.priceByType[targetBusinessType] / marketPrice.averageRentPerPyeong) : 1.0;
    
    const recommendedRent = Math.round(baseRent * locationMultiplier * businessMultiplier);
    
    return {
      recommendedRent,
      recommendedRange: {
        min: Math.round(recommendedRent * 0.85),
        max: Math.round(recommendedRent * 1.15)
      },
      marketComparison: Math.round((recommendedRent / baseRent) * 100),
      reasons: this.generateRentReasons(marketAnalysis, recommendedRent, baseRent),
      rentalSuccessProbability: this.calculateRentalSuccessProbability(marketAnalysis, recommendedRent, baseRent),
      expectedROI: this.calculateExpectedROI(recommendedRent, marketAnalysis)
    };
  }

  /**
   * 종합 투자 분석
   */
  performComprehensiveAnalysis(
    latitude: number,
    longitude: number,
    area: number,
    currentRent?: number
  ): ComprehensiveRecommendation | null {
    const marketAnalysis = this.analyzeLocation(latitude, longitude);
    if (!marketAnalysis) return null;

    const businessRecommendations = this.recommendBusinessTypes(marketAnalysis);
    const rentRecommendation = this.recommendRent(marketAnalysis, area);
    
    const investmentScore = this.calculateInvestmentScore(
      marketAnalysis,
      businessRecommendations,
      rentRecommendation
    );

    return {
      location: marketAnalysis.location,
      marketAnalysis,
      businessRecommendations,
      rentRecommendation,
      investmentAttractiveness: investmentScore,
      strengths: this.identifyStrengths(marketAnalysis),
      weaknesses: this.identifyWeaknesses(marketAnalysis),
      targetCustomers: this.identifyTargetCustomers(marketAnalysis),
      generatedAt: new Date()
    };
  }

  /**
   * 위험도 분석
   */
  assessRisk(marketAnalysis: MarketAnalysis, businessType: ShopType): RiskAssessment {
    const competitionRisk = this.calculateCompetitionRisk(marketAnalysis, businessType);
    const marketRisk = this.calculateMarketRisk(marketAnalysis);
    const rentIncreaseRisk = this.calculateRentIncreaseRisk(marketAnalysis);
    const footTrafficRisk = this.calculateFootTrafficRisk(marketAnalysis);
    
    const overallRisk = Math.round(
      (competitionRisk * 0.3) + 
      (marketRisk * 0.25) + 
      (rentIncreaseRisk * 0.25) + 
      (footTrafficRisk * 0.2)
    );

    return {
      overallRisk,
      riskFactors: {
        competitionRisk,
        marketRisk,
        rentIncreaseRisk,
        footTrafficRisk
      },
      mitigationStrategies: this.generateMitigationStrategies(overallRisk, {
        competitionRisk,
        marketRisk,
        rentIncreaseRisk,
        footTrafficRisk
      })
    };
  }

  /**
   * 계절성 분석
   */
  analyzeSeasonality(businessType: ShopType, marketAnalysis: MarketAnalysis): SeasonalAnalysis {
    // 업종별 계절성 패턴 정의
    const seasonalPatterns: Record<string, { spring: number; summer: number; autumn: number; winter: number }> = {
      cafe: { spring: 105, summer: 95, autumn: 100, winter: 100 },
      korean_restaurant: { spring: 100, summer: 105, autumn: 100, winter: 95 },
      fastfood: { spring: 100, summer: 110, autumn: 95, winter: 95 },
      clothing: { spring: 110, summer: 95, autumn: 105, winter: 90 },
      fitness: { spring: 120, summer: 90, autumn: 95, winter: 95 },
      // 기본값
      default: { spring: 100, summer: 100, autumn: 100, winter: 100 }
    };

    const pattern = seasonalPatterns[businessType] || seasonalPatterns.default;
    
    // 지역 특성 반영
    const locationMultiplier = marketAnalysis.characteristics.areaType === 'tourist' ? 1.2 : 1.0;
    
    return {
      seasonalVariation: {
        spring: Math.round(pattern.spring * locationMultiplier),
        summer: Math.round(pattern.summer * locationMultiplier),
        autumn: Math.round(pattern.autumn * locationMultiplier),
        winter: Math.round(pattern.winter * locationMultiplier)
      },
      peakSeasons: this.identifyPeakSeasons(pattern),
      lowSeasons: this.identifyLowSeasons(pattern)
    };
  }

  // ========== Private Methods ==========

  /**
   * 주변 상가 찾기 (반경 내)
   */
  private findNearbyShops(latitude: number, longitude: number, radius: number): EnhancedVacantShop[] {
    return this.shops.filter(shop => {
      const distance = this.calculateDistance(latitude, longitude, shop.latitude, shop.longitude);
      return distance <= radius;
    });
  }

  /**
   * 두 좌표 간 거리 계산 (미터)
   */
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371e3; // 지구 반지름 (미터)
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lng2-lng1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  /**
   * 상권 분석 수행
   */
  private performMarketAnalysis(
    nearbyShops: EnhancedVacantShop[],
    latitude: number,
    longitude: number
  ): MarketAnalysis {
    // 기존 상가들의 marketAnalysis를 활용하여 종합 분석
    const validAnalyses = nearbyShops
      .map(shop => shop.marketAnalysis)
      .filter((analysis): analysis is MarketAnalysis => analysis !== undefined);

    if (validAnalyses.length === 0) {
      throw new Error("분석할 수 있는 상권 데이터가 없습니다.");
    }

    // 평균값 기반 상권 분석 생성
    const avgFootTraffic = Math.round(
      validAnalyses.reduce((sum, analysis) => sum + analysis.footTraffic.dailyAverage, 0) / validAnalyses.length
    );

    const avgAccessibility = Math.round(
      validAnalyses.reduce((sum, analysis) => sum + analysis.characteristics.accessibilityScore, 0) / validAnalyses.length
    );

    const avgRentPerPyeong = Math.round(
      validAnalyses.reduce((sum, analysis) => sum + analysis.marketPrice.averageRentPerPyeong, 0) / validAnalyses.length
    );

    // 첫 번째 분석을 베이스로 사용하고 계산된 평균값들로 업데이트
    const baseAnalysis = validAnalyses[0];
    
    return {
      ...baseAnalysis,
      location: {
        latitude,
        longitude,
        address: `위도 ${latitude.toFixed(4)}, 경도 ${longitude.toFixed(4)}`
      },
      footTraffic: {
        ...baseAnalysis.footTraffic,
        dailyAverage: avgFootTraffic
      },
      characteristics: {
        ...baseAnalysis.characteristics,
        accessibilityScore: avgAccessibility
      },
      marketPrice: {
        ...baseAnalysis.marketPrice,
        averageRentPerPyeong: avgRentPerPyeong
      },
      overallScore: this.calculateOverallScore(avgFootTraffic, avgAccessibility, avgRentPerPyeong),
      analyzedAt: new Date()
    };
  }

  /**
   * 업종별 추천 점수 계산
   */
  private calculateBusinessRecommendation(
    marketAnalysis: MarketAnalysis,
    businessType: ShopType
  ): BusinessTypeRecommendation {
    const businessStats = marketAnalysis.businessStats[businessType];
    if (!businessStats) {
      // 기본 통계가 없는 경우 기본값 사용
      return this.getDefaultBusinessRecommendation(businessType);
    }

    // 다양한 요소 고려한 점수 계산
    const successRateScore = businessStats.successRate * 0.4;
    const footTrafficScore = Math.min(40, marketAnalysis.footTraffic.dailyAverage / 1000);
    const competitionScore = Math.max(0, 30 - this.getCompetitionLevel(marketAnalysis, businessType));
    const accessibilityScore = marketAnalysis.characteristics.accessibilityScore * 2;
    
    const totalScore = Math.min(100, Math.max(1, 
      successRateScore + footTrafficScore + competitionScore + accessibilityScore
    ));

    return {
      type: businessType,
      score: Math.round(totalScore),
      reasons: [
        `이 지역 ${businessType} 업종 평균 성공률: ${businessStats.successRate}%`,
        `일일 유동인구: ${marketAnalysis.footTraffic.dailyAverage.toLocaleString()}명`,
        `교통 접근성: ${marketAnalysis.characteristics.accessibilityScore}/10점`
      ],
      expectedSuccessRate: businessStats.successRate,
      estimatedMonthlyRevenue: {
        min: Math.round(businessStats.averageRevenue * 0.7),
        max: Math.round(businessStats.averageRevenue * 1.3),
        average: businessStats.averageRevenue
      },
      competitionLevel: this.getCompetitionLevel(marketAnalysis, businessType),
      entryDifficulty: Math.ceil(this.getCompetitionLevel(marketAnalysis, businessType) * 1.2)
    };
  }

  /**
   * 기본 업종 추천 (통계가 없는 경우)
   */
  private getDefaultBusinessRecommendation(businessType: ShopType): BusinessTypeRecommendation {
    return {
      type: businessType,
      score: 50,
      reasons: ["기본 분석 결과"],
      expectedSuccessRate: 60,
      estimatedMonthlyRevenue: { min: 200, max: 400, average: 300 },
      competitionLevel: 5,
      entryDifficulty: 6
    };
  }

  /**
   * 경쟁 강도 계산
   */
  private getCompetitionLevel(marketAnalysis: MarketAnalysis, businessType: ShopType): number {
    const nearbyBusinesses = marketAnalysis.nearbyBusinesses;
    const total500m = nearbyBusinesses.radius500m[businessType] || 0;
    const total1km = nearbyBusinesses.radius1km[businessType] || 0;
    
    // 반경별 가중치를 적용한 경쟁 점수
    return Math.min(10, Math.round((total500m * 2 + total1km) / 3));
  }

  /**
   * 전체 점수 계산
   */
  private calculateOverallScore(footTraffic: number, accessibility: number, rentPerPyeong: number): number {
    const footTrafficScore = Math.min(40, footTraffic / 1000);
    const accessibilityScore = accessibility * 4;
    const affordabilityScore = Math.max(0, 30 - rentPerPyeong / 10); // 임대료가 낮을수록 높은 점수
    
    return Math.round(footTrafficScore + accessibilityScore + affordabilityScore);
  }

  /**
   * 월세 추천 근거 생성
   */
  private generateRentReasons(
    marketAnalysis: MarketAnalysis, 
    recommendedRent: number, 
    marketRent: number
  ): string[] {
    const reasons = [];
    
    if (recommendedRent > marketRent) {
      reasons.push("프리미엄 위치로 시장가 대비 높은 임대료 책정 가능");
    } else if (recommendedRent < marketRent) {
      reasons.push("빠른 임대를 위한 경쟁력 있는 가격 책정");
    } else {
      reasons.push("시장 평균 임대료와 동일한 적정 가격");
    }
    
    if (marketAnalysis.footTraffic.dailyAverage > 30000) {
      reasons.push("높은 유동인구로 인한 입지 프리미엄");
    }
    
    if (marketAnalysis.characteristics.accessibilityScore >= 8) {
      reasons.push("우수한 교통 접근성");
    }
    
    return reasons;
  }

  /**
   * 임대 성공 확률 계산
   */
  private calculateRentalSuccessProbability(
    marketAnalysis: MarketAnalysis,
    recommendedRent: number,
    marketRent: number
  ): number {
    const priceRatio = recommendedRent / marketRent;
    let baseProbability = 75;
    
    // 가격 경쟁력에 따른 확률 조정
    if (priceRatio < 0.9) {
      baseProbability += 15;
    } else if (priceRatio > 1.1) {
      baseProbability -= 15;
    }
    
    // 상권 점수에 따른 조정
    if (marketAnalysis.overallScore > 80) {
      baseProbability += 10;
    } else if (marketAnalysis.overallScore < 60) {
      baseProbability -= 10;
    }
    
    return Math.max(30, Math.min(95, baseProbability));
  }

  /**
   * 예상 ROI 계산
   */
  private calculateExpectedROI(recommendedRent: number, marketAnalysis: MarketAnalysis): number {
    // 단순한 ROI 계산 (월세 × 12 / (보증금 + 초기 투자비용))
    const annualRent = recommendedRent * 12;
    const estimatedDeposit = recommendedRent * 10; // 월세의 10배로 가정
    const initialInvestment = recommendedRent * 2; // 초기 인테리어 비용 등
    
    const roi = (annualRent / (estimatedDeposit + initialInvestment)) * 100;
    return Math.round(roi * 10) / 10;
  }

  /**
   * 투자 점수 계산
   */
  private calculateInvestmentScore(
    marketAnalysis: MarketAnalysis,
    businessRecommendations: BusinessTypeRecommendation[],
    rentRecommendation: RentRecommendation
  ): number {
    const marketScore = marketAnalysis.overallScore * 0.4;
    const businessScore = (businessRecommendations[0]?.score || 50) * 0.35;
    const rentScore = rentRecommendation.rentalSuccessProbability * 0.25;
    
    return Math.round(marketScore + businessScore + rentScore);
  }

  /**
   * 강점 식별
   */
  private identifyStrengths(marketAnalysis: MarketAnalysis): string[] {
    const strengths = [];
    
    if (marketAnalysis.footTraffic.dailyAverage > 25000) {
      strengths.push("높은 유동인구");
    }
    
    if (marketAnalysis.characteristics.accessibilityScore >= 8) {
      strengths.push("우수한 교통 접근성");
    }
    
    if (marketAnalysis.characteristics.nearbyFacilities.officeBuildings > 8) {
      strengths.push("다양한 오피스 건물 인근");
    }
    
    if (marketAnalysis.overallScore > 80) {
      strengths.push("프리미엄 상권");
    }
    
    return strengths.length > 0 ? strengths : ["안정적인 상권"];
  }

  /**
   * 약점 식별
   */
  private identifyWeaknesses(marketAnalysis: MarketAnalysis): string[] {
    const weaknesses = [];
    
    if (marketAnalysis.marketPrice.averageRentPerPyeong > 15) {
      weaknesses.push("높은 임대료");
    }
    
    if (marketAnalysis.characteristics.transportation.parkingSpots < 30) {
      weaknesses.push("부족한 주차공간");
    }
    
    if (marketAnalysis.footTraffic.dailyAverage < 15000) {
      weaknesses.push("상대적으로 낮은 유동인구");
    }
    
    return weaknesses.length > 0 ? weaknesses : ["특별한 약점 없음"];
  }

  /**
   * 타겟 고객 식별
   */
  private identifyTargetCustomers(marketAnalysis: MarketAnalysis): { primary: string; secondary: string[] } {
    const ageGroups = marketAnalysis.footTraffic.ageGroups;
    
    let primary = "일반 직장인";
    const secondary = [];
    
    if (ageGroups.twenties > ageGroups.thirties) {
      primary = "20대 직장인/대학생";
      secondary.push("30대 직장인");
    } else if (ageGroups.thirties > ageGroups.twenties) {
      primary = "30대 직장인";
      secondary.push("20대 직장인");
    }
    
    if (marketAnalysis.characteristics.areaType === 'tourist') {
      secondary.push("관광객");
    }
    
    if (marketAnalysis.characteristics.nearbyFacilities.apartments > 10) {
      secondary.push("인근 거주민");
    }
    
    return { primary, secondary };
  }

  // 위험도 계산 메서드들
  private calculateCompetitionRisk(marketAnalysis: MarketAnalysis, businessType: ShopType): number {
    return this.getCompetitionLevel(marketAnalysis, businessType);
  }

  private calculateMarketRisk(marketAnalysis: MarketAnalysis): number {
    // 시장 변동성을 기반으로 위험도 계산
    if (marketAnalysis.characteristics.areaType === 'tourist') return 7;
    if (marketAnalysis.characteristics.areaType === 'commercial') return 4;
    return 5;
  }

  private calculateRentIncreaseRisk(marketAnalysis: MarketAnalysis): number {
    // 임대료 상승 추세 분석
    const priceHistory = marketAnalysis.marketPrice.priceHistory;
    const recentTrend = priceHistory[0].averageRent - priceHistory[priceHistory.length - 1].averageRent;
    return Math.max(1, Math.min(10, Math.round(recentTrend / 10) + 5));
  }

  private calculateFootTrafficRisk(marketAnalysis: MarketAnalysis): number {
    // 유동인구 안정성 평가
    if (marketAnalysis.footTraffic.dailyAverage > 30000) return 2;
    if (marketAnalysis.footTraffic.dailyAverage > 20000) return 4;
    if (marketAnalysis.footTraffic.dailyAverage > 10000) return 6;
    return 8;
  }

  private generateMitigationStrategies(overallRisk: number, risks: any): string[] {
    const strategies = [];
    
    if (risks.competitionRisk > 7) {
      strategies.push("차별화된 컨셉으로 경쟁력 확보");
    }
    
    if (risks.marketRisk > 6) {
      strategies.push("다양한 수익 모델 구축");
    }
    
    if (risks.rentIncreaseRisk > 6) {
      strategies.push("장기 임대 계약 체결");
    }
    
    return strategies;
  }

  private identifyPeakSeasons(pattern: any): string[] {
    const seasons = [];
    const threshold = 105;
    
    if (pattern.spring >= threshold) seasons.push("봄");
    if (pattern.summer >= threshold) seasons.push("여름");
    if (pattern.autumn >= threshold) seasons.push("가을");
    if (pattern.winter >= threshold) seasons.push("겨울");
    
    return seasons;
  }

  private identifyLowSeasons(pattern: any): string[] {
    const seasons = [];
    const threshold = 95;
    
    if (pattern.spring <= threshold) seasons.push("봄");
    if (pattern.summer <= threshold) seasons.push("여름");
    if (pattern.autumn <= threshold) seasons.push("가을");
    if (pattern.winter <= threshold) seasons.push("겨울");
    
    return seasons;
  }
}

/**
 * 전역 상권 분석 엔진 인스턴스 생성 함수
 */
export function createMarketAnalysisEngine(shops: EnhancedVacantShop[]): MarketAnalysisEngine {
  return new MarketAnalysisEngine(shops);
}