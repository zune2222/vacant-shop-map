"use client";

import { MarketAnalysis, ComprehensiveRecommendation } from "@/types";

interface MarketAnalysisCardProps {
  analysis: MarketAnalysis;
  recommendation?: ComprehensiveRecommendation;
  className?: string;
}

export default function MarketAnalysisCard({
  analysis,
  recommendation,
  className = "",
}: MarketAnalysisCardProps) {
  const footTraffic = analysis.footTraffic;
  const characteristics = analysis.characteristics;

  return (
    <div className={`card space-y-6 animate-fade-in ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">상권 분석</h3>
            <p className="text-sm text-gray-500">{analysis.location.address}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-[#6E62F6]">
            {analysis.overallScore}
          </div>
          <div className="text-xs text-gray-500">상권 점수</div>
        </div>
      </div>

      {/* 주요 지표 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-gray-900">
            {(footTraffic.dailyAverage / 1000).toFixed(1)}K
          </div>
          <div className="text-xs text-gray-600 mt-1">일일 유동인구</div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-gray-900">
            {characteristics.accessibilityScore}/10
          </div>
          <div className="text-xs text-gray-600 mt-1">교통 접근성</div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-gray-900">
            {analysis.marketPrice.averageRentPerPyeong}
          </div>
          <div className="text-xs text-gray-600 mt-1">평균 임대료/평</div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-gray-900">
            {characteristics.transportation.subwayStations.length}
          </div>
          <div className="text-xs text-gray-600 mt-1">지하철역</div>
        </div>
      </div>

      {/* 시간대별 유동인구 (간단한 차트) */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900 flex items-center">
          <svg
            className="w-5 h-5 text-[#6E62F6] mr-2"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
          </svg>
          시간대별 유동인구
        </h4>
        <div className="grid grid-cols-12 gap-1 h-16">
          {footTraffic.hourlyData.map((value, index) => {
            const maxValue = Math.max(...footTraffic.hourlyData);
            const height = (value / maxValue) * 100;

            return (
              <div
                key={index}
                className="flex flex-col justify-end"
                title={`${index}시: ${value.toLocaleString()}명`}
              >
                <div
                  className="bg-gradient-to-t from-[#6E62F6] to-[#8B77FF] rounded-sm transition-all duration-300 hover:opacity-80"
                  style={{ height: `${height}%` }}
                />
                <div className="text-xs text-gray-500 text-center mt-1">
                  {index}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 연령대별 분포 */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900 flex items-center">
          <svg
            className="w-5 h-5 text-[#6E62F6] mr-2"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63c-.34-1.02-1.31-1.73-2.46-1.73s-2.12.71-2.46 1.73L12.5 16H15v6h5zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-7H9.5l-2.54-7.63A2.49 2.49 0 004.5 5.64c-1.15 0-2.12.71-2.46 1.73L-.46 15H2v7h5.5z" />
          </svg>
          연령대별 분포
        </h4>
        <div className="flex space-x-2">
          {Object.entries({
            "10대": footTraffic.ageGroups.teens,
            "20대": footTraffic.ageGroups.twenties,
            "30대": footTraffic.ageGroups.thirties,
            "40대": footTraffic.ageGroups.forties,
            "50대": footTraffic.ageGroups.fifties,
            "60+": footTraffic.ageGroups.seniors,
          }).map(([age, count], index) => {
            const percentage = (count / footTraffic.dailyAverage) * 100;
            const colors = [
              "#FEF3C7",
              "#FDE68A",
              "#FCD34D",
              "#F59E0B",
              "#D97706",
              "#92400E",
            ];

            return (
              <div key={age} className="flex-1 text-center">
                <div
                  className="h-8 rounded-lg mb-2 transition-all duration-300 hover:opacity-80"
                  style={{
                    backgroundColor: colors[index],
                    height: `${Math.max(8, percentage * 2)}px`,
                  }}
                  title={`${age}: ${count.toLocaleString()}명 (${percentage.toFixed(
                    1
                  )}%)`}
                />
                <div className="text-xs text-gray-600">{age}</div>
                <div className="text-xs font-medium text-gray-900">
                  {percentage.toFixed(0)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 추천 업종 (있는 경우) */}
      {recommendation && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 flex items-center">
            <svg
              className="w-5 h-5 text-[#6E62F6] mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            추천 업종 Top 3
          </h4>
          <div className="space-y-2">
            {recommendation.businessRecommendations
              .slice(0, 3)
              .map((rec, index) => (
                <div
                  key={rec.type}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
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
                      <div className="font-medium text-gray-900">
                        {rec.type
                          .replace(/_/g, " ")
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                      </div>
                      <div className="text-xs text-gray-500">
                        성공률 {rec.expectedSuccessRate}%
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-[#6E62F6]">
                      {rec.score}
                    </div>
                    <div className="text-xs text-gray-500">점수</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 월세 추천 (있는 경우) */}
      {recommendation && (
        <div className="bg-[#6E62F6]/5 p-4 rounded-xl border border-[#6E62F6]/20">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">추천 월세</h4>
              <p className="text-sm text-gray-600">
                시장 분석 기반 적정 임대료
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#6E62F6]">
                {recommendation.rentRecommendation.recommendedRent.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">만원/월</div>
              <div className="text-xs text-[#6E62F6] mt-1">
                신뢰도
                {Math.round(
                  recommendation.rentRecommendation.rentalSuccessProbability
                )}
                %
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 분석 일시 */}
      <div className="text-xs text-gray-500 text-center pt-4 border-t border-gray-100">
        분석 일시: {analysis.analyzedAt.toLocaleString("ko-KR")}
      </div>
    </div>
  );
}
