"use client";

import { useState } from "react";
import { ComprehensiveRecommendation, ShopType } from "@/types";
import MarketAnalysisCard from "./MarketAnalysisCard";
import BusinessSuccessChart from "./BusinessSuccessChart";
import RentRecommendationCard from "./RentRecommendationCard";

interface DetailedAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendation: ComprehensiveRecommendation;
  currentRent?: number;
  area?: number;
  shopName?: string;
}

export default function DetailedAnalysisModal({
  isOpen,
  onClose,
  recommendation,
  currentRent,
  area = 20,
  shopName = "선택된 상가",
}: DetailedAnalysisModalProps) {
  const [selectedBusinessType, setSelectedBusinessType] = useState<
    ShopType | undefined
  >(recommendation.businessRecommendations[0]?.type);
  const [activeTab, setActiveTab] = useState<
    "overview" | "business" | "rent" | "risk"
  >("overview");

  if (!isOpen) return null;

  const tabs = [
    { id: "overview" as const, label: "종합 분석", icon: "chart" },
    { id: "business" as const, label: "업종 분석", icon: "store" },
    { id: "rent" as const, label: "임대료 분석", icon: "money" },
    { id: "risk" as const, label: "위험 분석", icon: "warning" },
  ];

  const getTabIcon = (iconType: string) => {
    switch (iconType) {
      case "chart":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
          </svg>
        );
      case "store":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 2.69L18.31 12H16v6h-3v-4h-2v4H8v-6H5.69L12 5.69z" />
          </svg>
        );
      case "money":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.41 6.41L16 14.17 14.83 15.41l-4.24-4.24-2.83 2.83L6.59 12.83 10.59 8.41z" />
          </svg>
        );
      case "warning":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l-10 18h20L12 2zm-1 13h2v2h-2v-2zm0-6h2v4h-2V9z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden animate-scale-in">
        {/* 헤더 */}
        <div className="bg-gradient-primary text-white p-4 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200 z-10"
            aria-label="닫기"
          >
            <svg
              className="w-5 h-5 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="pr-12">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-xl font-bold text-black">
                  상권 분석 보고서
                </h2>
                <p className="text-sm text-black/90">{shopName}</p>
              </div>

              {/* 투자 매력도 */}
              <div className="flex items-center space-x-3">
                <div className="bg-white/30 rounded-lg px-3 py-2 text-center">
                  <div className="text-xs text-black/90">투자 매력도</div>
                  <div className="text-xl font-bold text-black">
                    {recommendation.investmentAttractiveness}
                  </div>
                </div>
                <div className="text-sm text-black/90 flex items-center">
                  {recommendation.investmentAttractiveness >= 80 ? (
                    <>
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>{" "}
                      매우 우수
                    </>
                  ) : recommendation.investmentAttractiveness >= 70 ? (
                    <>
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>{" "}
                      우수
                    </>
                  ) : recommendation.investmentAttractiveness >= 60 ? (
                    <>
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>{" "}
                      양호
                    </>
                  ) : recommendation.investmentAttractiveness >= 50 ? (
                    <>
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>{" "}
                      보통
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>{" "}
                      주의
                    </>
                  )}
                </div>
              </div>
            </div>

            <p className="text-xs text-black/80">
              {recommendation.location.address}
            </p>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="border-b border-gray-200">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "text-[#6E62F6] border-b-2 border-[#6E62F6] bg-[#6E62F6]/5"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <span className="mr-2">{getTabIcon(tab.icon)}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 콘텐츠 */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* 핵심 인사이트 */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    주요 강점
                  </h3>
                  <div className="space-y-2">
                    {recommendation.strengths.map((strength, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-sm text-gray-700">
                          {strength}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 text-orange-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    주의사항
                  </h3>
                  <div className="space-y-2">
                    {recommendation.weaknesses.map((weakness, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                        <span className="text-sm text-gray-700">
                          {weakness}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 타겟 고객 */}
              <div className="card">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 text-blue-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                  </svg>
                  추천 타겟 고객
                </h3>
                <div className="flex flex-wrap gap-3">
                  <div className="bg-[#6E62F6]/10 px-4 py-2 rounded-lg border border-[#6E62F6]/20">
                    <span className="text-sm font-medium text-[#6E62F6]">
                      메인: {recommendation.targetCustomers.primary}
                    </span>
                  </div>
                  {recommendation.targetCustomers.secondary.map(
                    (target, index) => (
                      <div
                        key={index}
                        className="bg-gray-100 px-3 py-2 rounded-lg"
                      >
                        <span className="text-sm text-gray-700">
                          서브: {target}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* 상권 분석 요약 */}
              <MarketAnalysisCard
                analysis={recommendation.marketAnalysis}
                recommendation={recommendation}
              />
            </div>
          )}

          {activeTab === "business" && (
            <div className="space-y-6">
              <BusinessSuccessChart
                businessStats={recommendation.marketAnalysis.businessStats}
                selectedType={selectedBusinessType}
                onTypeSelect={setSelectedBusinessType}
              />

              {/* 추천 업종 상세 */}
              <div className="card">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  추천 업종 상세 분석
                </h3>
                <div className="space-y-4">
                  {recommendation.businessRecommendations.map((rec, index) => (
                    <div
                      key={rec.type}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                              index === 0
                                ? "bg-[#FFD700]"
                                : index === 1
                                ? "bg-[#C0C0C0]"
                                : "bg-[#CD7F32]"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {rec.type.replace(/_/g, " ").toUpperCase()}
                            </h4>
                            <p className="text-sm text-gray-500">
                              추천 점수: {rec.score}/100
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">
                            예상 성공률
                          </div>
                          <div className="text-xl font-bold text-[#6E62F6]">
                            {rec.expectedSuccessRate}%
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div className="bg-gray-50 p-3 rounded-lg text-center">
                          <div className="text-lg font-bold text-gray-900">
                            {rec.estimatedMonthlyRevenue.average.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            평균 월매출
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg text-center">
                          <div className="text-lg font-bold text-gray-900">
                            {rec.competitionLevel}/10
                          </div>
                          <div className="text-xs text-gray-500">경쟁 강도</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg text-center">
                          <div className="text-lg font-bold text-gray-900">
                            {rec.entryDifficulty}/10
                          </div>
                          <div className="text-xs text-gray-500">
                            진입 난이도
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h5 className="font-medium text-gray-900">
                          추천 근거:
                        </h5>
                        {rec.reasons.map((reason, reasonIndex) => (
                          <p
                            key={reasonIndex}
                            className="text-sm text-gray-600 flex items-start"
                          >
                            <span className="text-[#6E62F6] mr-2">•</span>
                            {reason}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "rent" && (
            <div className="space-y-6">
              <RentRecommendationCard
                recommendation={recommendation.rentRecommendation}
                marketPrice={recommendation.marketAnalysis.marketPrice}
                currentRent={currentRent}
                area={area}
              />

              {/* 시세 변동 추이 */}
              <div className="card">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  최근 시세 변동 추이
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                    <span>최근 6개월</span>
                    <span>평균 임대료 (만원)</span>
                  </div>
                  {recommendation.marketAnalysis.marketPrice.priceHistory.map(
                    (history, index) => {
                      const maxPrice = Math.max(
                        ...recommendation.marketAnalysis.marketPrice.priceHistory.map(
                          (h) => h.averageRent
                        )
                      );
                      const width = (history.averageRent / maxPrice) * 100;

                      return (
                        <div
                          key={history.month}
                          className="flex items-center space-x-4"
                        >
                          <div className="w-16 text-sm text-gray-600">
                            {history.month}
                          </div>
                          <div className="flex-1">
                            <div className="relative">
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                  className="h-3 rounded-full bg-gradient-to-r from-[#6E62F6] to-[#8B77FF]"
                                  style={{ width: `${width}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="w-20 text-sm font-medium text-gray-900 text-right">
                            {history.averageRent.toLocaleString()}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "risk" && (
            <div className="space-y-6">
              {/* 위험 요소 분석 (예시 데이터) */}
              <div className="card">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 text-red-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  위험도 평가
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {[
                      { label: "경쟁 위험", value: 6, color: "#ef4444" },
                      { label: "시장 위험", value: 4, color: "#f59e0b" },
                      { label: "임대료 상승 위험", value: 5, color: "#10b981" },
                      {
                        label: "유동인구 감소 위험",
                        value: 3,
                        color: "#6366f1",
                      },
                    ].map((risk) => (
                      <div key={risk.label} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">
                            {risk.label}
                          </span>
                          <span className="text-sm font-bold text-gray-900">
                            {risk.value}/10
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              backgroundColor: risk.color,
                              width: `${(risk.value / 10) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      위험 완화 방안
                    </h4>
                    <div className="space-y-2">
                      {[
                        "차별화된 컨셉으로 경쟁력 확보",
                        "다양한 수익 모델 구축",
                        "장기 임대 계약 체결",
                        "지속적인 시장 모니터링",
                      ].map((strategy, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-[#6E62F6] rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">
                            {strategy}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 투자 수익률 시뮬레이션 */}
              <div className="card">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  투자 수익률 시뮬레이션
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { scenario: "낙관적", roi: "12.5%", color: "#10b981" },
                    {
                      scenario: "보통",
                      roi: `${recommendation.rentRecommendation.expectedROI}%`,
                      color: "#6366f1",
                    },
                    { scenario: "비관적", roi: "6.2%", color: "#ef4444" },
                  ].map((scenario) => (
                    <div
                      key={scenario.scenario}
                      className="bg-gray-50 p-4 rounded-lg text-center"
                    >
                      <div className="text-sm text-gray-600 mb-1">
                        {scenario.scenario} 시나리오
                      </div>
                      <div
                        className="text-2xl font-bold"
                        style={{ color: scenario.color }}
                      >
                        {scenario.roi}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        연간 수익률
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <div>
              분석 생성 일시:{" "}
              {recommendation.generatedAt.toLocaleString("ko-KR")}
            </div>
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              이 분석은 참고용이며, 실제 투자 결정 시 추가 검토가 필요합니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
