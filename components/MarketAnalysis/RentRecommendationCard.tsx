"use client";

import { RentRecommendation, MarketPrice } from "@/types";

interface RentRecommendationCardProps {
  recommendation: RentRecommendation;
  marketPrice: MarketPrice;
  currentRent?: number;
  area?: number;
  className?: string;
}

export default function RentRecommendationCard({
  recommendation,
  marketPrice,
  currentRent,
  area = 20,
  className = "",
}: RentRecommendationCardProps) {
  const {
    recommendedRent,
    recommendedRange,
    marketComparison,
    reasons,
    rentalSuccessProbability,
    expectedROI,
  } = recommendation;

  // 시세 비교 데이터
  const comparisonData = [
    {
      label: "추천 임대료",
      amount: recommendedRent,
      color: "#6E62F6",
      isRecommended: true,
    },
    {
      label: "시장 평균",
      amount: marketPrice.averageRentPerPyeong * area,
      color: "#10b981",
      isRecommended: false,
    },
    ...(currentRent
      ? [
          {
            label: "현재 임대료",
            amount: currentRent,
            color: "#f59e0b",
            isRecommended: false,
          },
        ]
      : []),
  ];

  const maxAmount = Math.max(...comparisonData.map((d) => d.amount));

  return (
    <div className={`card space-y-6 ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">월세 추천</h3>
            <p className="text-sm text-gray-500">시장 분석 기반 적정 임대료</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">신뢰도</div>
          <div className="text-2xl font-bold text-[#6E62F6]">
            {Math.round(rentalSuccessProbability)}%
          </div>
        </div>
      </div>

      {/* 추천 임대료 */}
      <div className="bg-gradient-to-r from-[#6E62F6]/10 to-[#8B77FF]/10 p-6 rounded-2xl border border-[#6E62F6]/20">
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-2">추천 월세</div>
          <div className="text-4xl font-bold text-[#6E62F6] mb-2">
            {recommendedRent.toLocaleString()}
          </div>
          <div className="text-lg text-gray-700 mb-4">만원</div>

          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className="text-center">
              <div className="text-gray-500">최소</div>
              <div className="font-semibold text-gray-900">
                {recommendedRange.min.toLocaleString()}만원
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-500">최대</div>
              <div className="font-semibold text-gray-900">
                {recommendedRange.max.toLocaleString()}만원
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 시세 비교 차트 */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900 flex items-center">
          <svg
            className="w-5 h-5 text-[#6E62F6] mr-2"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
          </svg>
          시세 비교
        </h4>

        <div className="space-y-3">
          {comparisonData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span
                    className={`text-sm font-medium ${
                      item.isRecommended ? "text-[#6E62F6]" : "text-gray-700"
                    }`}
                  >
                    {item.label}
                  </span>
                  {item.isRecommended && (
                    <span className="badge-info text-xs">추천</span>
                  )}
                </div>
                <span className="font-semibold text-gray-900">
                  {item.amount.toLocaleString()}만원
                </span>
              </div>

              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-500"
                    style={{
                      backgroundColor: item.color,
                      width: `${(item.amount / maxAmount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 핵심 지표 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-[#10b981]">
            {marketComparison}%
          </div>
          <div className="text-xs text-gray-600 mt-1">시장 대비</div>
          <div className="text-xs text-gray-500 mt-1">
            {marketComparison > 100
              ? "프리미엄"
              : marketComparison < 100
              ? "할인"
              : "동일"}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-[#f59e0b]">
            {expectedROI}%
          </div>
          <div className="text-xs text-gray-600 mt-1">예상 ROI</div>
          <div className="text-xs text-gray-500 mt-1">연간 수익률</div>
        </div>
      </div>

      {/* 추천 근거 */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900 flex items-center">
          <svg
            className="w-5 h-5 text-[#6E62F6] mr-2"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          추천 근거
        </h4>

        <div className="space-y-2">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="w-5 h-5 rounded-full bg-[#6E62F6] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">
                  {index + 1}
                </span>
              </div>
              <p className="text-sm text-gray-700">{reason}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 성공 확률 시각화 */}
      <div className="bg-gray-50 p-4 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900">임대 성공 가능성</h4>
          <span className="text-2xl font-bold text-[#6E62F6]">
            {rentalSuccessProbability}%
          </span>
        </div>

        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={`h-4 rounded-full transition-all duration-1000 ${
                rentalSuccessProbability >= 80
                  ? "bg-gradient-to-r from-green-400 to-green-500"
                  : rentalSuccessProbability >= 60
                  ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                  : "bg-gradient-to-r from-red-400 to-red-500"
              }`}
              style={{ width: `${rentalSuccessProbability}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>낮음</span>
            <span>보통</span>
            <span>높음</span>
          </div>
        </div>

        <div className="mt-3 text-sm text-gray-600">
          {rentalSuccessProbability >= 80 ? (
            <span className="text-green-600 font-medium flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              매우 높은 성공 가능성으로 빠른 임대가 예상됩니다
            </span>
          ) : rentalSuccessProbability >= 60 ? (
            <span className="text-yellow-600 font-medium flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              적절한 성공 가능성이지만 마케팅이 필요할 수 있습니다
            </span>
          ) : (
            <span className="text-red-600 font-medium flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              임대료 재검토 또는 추가 마케팅 전략이 필요합니다
            </span>
          )}
        </div>
      </div>

      {/* 면적별 시세 참고 (있는 경우) */}
      {marketPrice.priceByArea && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">면적별 시세 참고</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries({
              "10평 미만": marketPrice.priceByArea.under10,
              "10-20평": marketPrice.priceByArea.from10to20,
              "20-30평": marketPrice.priceByArea.from20to30,
              "30평 이상": marketPrice.priceByArea.over30,
            }).map(([areaRange, price]) => (
              <div
                key={areaRange}
                className="bg-gray-50 p-3 rounded-lg text-center"
              >
                <div className="text-sm font-medium text-gray-900">
                  {price.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">{areaRange}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
