"use client";

import { BusinessSuccessStats, SHOP_TYPE_LABELS, ShopType } from "@/types";

interface BusinessSuccessChartProps {
  businessStats: BusinessSuccessStats;
  selectedType?: ShopType;
  onTypeSelect?: (type: ShopType) => void;
  className?: string;
}

export default function BusinessSuccessChart({
  businessStats,
  selectedType,
  onTypeSelect,
  className = ""
}: BusinessSuccessChartProps) {
  const stats = Object.entries(businessStats).map(([key, stat]) => ({
    type: stat.type,
    label: SHOP_TYPE_LABELS[stat.type] || stat.type,
    successRate: stat.successRate,
    averageRevenue: stat.averageRevenue,
    operationPeriod: stat.averageOperationPeriod,
    revenueToRentRatio: stat.revenueToRentRatio
  })).sort((a, b) => b.successRate - a.successRate);

  const maxSuccessRate = Math.max(...stats.map(s => s.successRate));
  const maxRevenue = Math.max(...stats.map(s => s.averageRevenue));

  return (
    <div className={`card space-y-6 ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z"/>
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">업종별 성공 지표</h3>
          <p className="text-sm text-gray-500">
            성공률 및 수익성 분석
          </p>
        </div>
      </div>

      {/* 차트 범례 */}
      <div className="flex flex-wrap gap-4 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-[#6E62F6] rounded"></div>
          <span className="text-gray-600">성공률 (%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-[#10b981] rounded"></div>
          <span className="text-gray-600">월평균 매출 (만원)</span>
        </div>
      </div>

      {/* 성공률 차트 */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">성공률 순위</h4>
        <div className="space-y-3">
          {stats.slice(0, 8).map((stat, index) => (
            <div
              key={stat.type}
              className={`p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                selectedType === stat.type
                  ? "border-[#6E62F6] bg-[#6E62F6]/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => onTypeSelect?.(stat.type)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    index < 3 ? 'bg-[#6E62F6]' : 'bg-gray-400'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{stat.label}</div>
                    <div className="text-xs text-gray-500">
                      평균 운영기간: {stat.operationPeriod}개월
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-[#6E62F6]">
                    {stat.successRate}%
                  </div>
                  <div className="text-xs text-gray-500">성공률</div>
                </div>
              </div>
              
              {/* 성공률 바 */}
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-[#6E62F6] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(stat.successRate / 100) * 100}%` }}
                  />
                </div>
                
                {/* 매출 정보 */}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">
                    월평균 매출: {stat.averageRevenue.toLocaleString()}만원
                  </span>
                  <span className="text-[#10b981] font-medium">
                    임대료 대비: {stat.revenueToRentRatio}배
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 매출 vs 성공률 산점도 (시각적 표현) */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">매출 vs 성공률 분포</h4>
        <div className="relative bg-gray-50 p-6 rounded-xl min-h-[300px]">
          {/* 축 라벨 */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
            월평균 매출 (만원)
          </div>
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs text-gray-500">
            성공률 (%)
          </div>
          
          {/* 격자 */}
          <svg className="absolute inset-6 w-full h-full" style={{ width: 'calc(100% - 3rem)', height: 'calc(100% - 3rem)' }}>
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          
          {/* 데이터 포인트 */}
          <div className="absolute inset-6" style={{ width: 'calc(100% - 3rem)', height: 'calc(100% - 3rem)' }}>
            {stats.slice(0, 10).map((stat) => {
              const x = (stat.averageRevenue / maxRevenue) * 100;
              const y = 100 - (stat.successRate / 100) * 100;
              
              return (
                <div
                  key={stat.type}
                  className={`absolute w-3 h-3 rounded-full transition-all duration-200 cursor-pointer hover:scale-150 ${
                    selectedType === stat.type ? 'bg-[#6E62F6] scale-125' : 'bg-[#8B77FF]'
                  }`}
                  style={{
                    left: `${Math.max(0, Math.min(95, x))}%`,
                    top: `${Math.max(0, Math.min(95, y))}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  title={`${stat.label}: 매출 ${stat.averageRevenue}만원, 성공률 ${stat.successRate}%`}
                  onClick={() => onTypeSelect?.(stat.type)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* 선택된 업종 상세 정보 */}
      {selectedType && businessStats[selectedType] && (
        <div className="bg-gradient-to-r from-[#6E62F6]/10 to-[#8B77FF]/10 p-4 rounded-xl border border-[#6E62F6]/20">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-[#6E62F6] rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900">
              {SHOP_TYPE_LABELS[selectedType]} 상세 분석
            </h4>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#6E62F6]">
                {businessStats[selectedType].successRate}%
              </div>
              <div className="text-xs text-gray-600">성공률</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-[#10b981]">
                {businessStats[selectedType].averageRevenue.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">월평균 매출</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-[#f59e0b]">
                {businessStats[selectedType].averageOperationPeriod}
              </div>
              <div className="text-xs text-gray-600">평균 운영기간</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-[#ef4444]">
                {businessStats[selectedType].closureRate}%
              </div>
              <div className="text-xs text-gray-600">폐업률</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}