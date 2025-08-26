"use client";

import { useEffect, useState } from "react";
import { EnhancedVacantShop, SHOP_TYPE_LABELS } from "@/types";
import { useShopModalStore } from "@/store/bottomSheetStore";
import { ShopDetailSkeleton } from "@/components/Shop";
import { ApiErrorState } from "@/components/common";
import {
  MarketAnalysisCard,
  DetailedAnalysisModal,
} from "@/components/MarketAnalysis";
import { ENHANCED_SAMPLE_SHOPS } from "@/lib/enhancedSampleData";
import ImageGallery from "./ImageGallery";

/**
 * 빈 상점 상세 정보 모달 컴포넌트
 */
export default function ShopDetail() {
  const { shopId, isOpen, closeModal } = useShopModalStore();
  const [shop, setShop] = useState<EnhancedVacantShop | null>(null);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 상가 유형별 라벨 반환
   */
  const getShopTypeLabel = (type: string): string => {
    return SHOP_TYPE_LABELS[type as keyof typeof SHOP_TYPE_LABELS] || "기타";
  };

  /**
   * 상점 데이터 로드 (확장된 샘플 데이터 사용)
   */
  useEffect(() => {
    if (!shopId) return;

    setLoading(true);
    setError(null);

    // 확장된 샘플 데이터에서 해당 ID의 상점 찾기
    setTimeout(() => {
      const foundShop = ENHANCED_SAMPLE_SHOPS.find((s) => s.id === shopId);

      if (foundShop) {
        setShop(foundShop);
      } else {
        // ID를 찾을 수 없는 경우 첫 번째 샘플 상점 사용
        setShop(ENHANCED_SAMPLE_SHOPS[0]);
      }
      setLoading(false);
    }, 800);

    return () => {
      setShop(null);
      setError(null);
    };
  }, [shopId]);

  /**
   * 전화걸기
   */
  const handleCallPhone = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  /**
   * 이메일 보내기
   */
  const handleSendEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  /**
   * 백드롭 클릭 핸들러
   */
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // 모달이 닫혀있으면 렌더링하지 않음
  if (!isOpen) {
    return null;
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="p-4">
            <ShopDetailSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="p-4">
            <ApiErrorState
              title="상점 정보 로딩 실패"
              message={error}
              onRetry={() => {
                setError(null);
                // 재시도 로직
              }}
              size="medium"
            />
          </div>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="p-4">
            <ApiErrorState
              title="상점 정보 없음"
              message="상점 정보를 찾을 수 없습니다."
              size="medium"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50"
      onClick={handleBackdropClick}
    >
      <div className="min-h-full flex items-end justify-center p-4 sm:items-center sm:p-0">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in">
          {/* 헤더 */}
          <div className="bg-gradient-to-r from-[#6E62F6] to-[#8B77FF] text-white p-4 relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200"
              aria-label="닫기"
            >
              <svg
                className="w-5 h-5"
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
              <h2 className="text-xl font-bold mb-2">{shop.name}</h2>
              <p className="text-sm text-white/90">{shop.address}</p>

              {/* 가격 정보 */}
              <div className="flex items-center justify-between mt-3 bg-white/20 rounded-lg p-3">
                <div>
                  <span className="text-lg font-bold">
                    월세 {Math.round(shop.monthlyRent / 10000)}만원
                  </span>
                  <span className="text-sm text-white/80 ml-2">
                    / 보증금 {Math.round(shop.deposit / 10000)}만원
                  </span>
                  {shop.recommendedRent && (
                    <div className="text-xs text-green-200 mt-1">
                      추천 월세:{" "}
                      {Math.round(shop.recommendedRent.amount / 10000)}만원
                      (신뢰도 {Math.round(shop.recommendedRent.confidence)}%)
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-sm bg-white/20 px-2 py-1 rounded mb-1 block">
                    {Math.round(shop.area)}평
                  </span>
                  {shop.investmentScore && (
                    <span className="text-xs bg-white/30 text-white px-2 py-1 rounded">
                      투자점수 {Math.round(shop.investmentScore)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 콘텐츠 영역 */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="flex flex-col space-y-6">
              {/* 액션 버튼들 */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleCallPhone(shop.contact.phone)}
                  className="flex-1 btn-primary py-3 px-4 rounded-xl font-medium transition-colors"
                >
                  <svg
                    className="w-5 h-5 inline mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                  전화하기
                </button>

                {/* 상권 분석 버튼 */}
                {shop.recommendation && (
                  <button
                    onClick={() => {
                      setShowDetailedAnalysis(true);
                    }}
                    className="flex-1 bg-gradient-to-r from-[#6E62F6] to-[#8B77FF] text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                  >
                    <svg
                      className="w-5 h-5 inline mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                    </svg>
                    상권 분석 보기
                  </button>
                )}
              </div>

              {/* 상점 이미지 갤러리 */}
              <div>
                <h3 className="text-md font-semibold text-gray-900 mb-3">
                  사진
                </h3>
                <ImageGallery images={shop.images} shopName={shop.name} />
              </div>

              {/* 기본 정보 */}
              <div className="space-y-2">
                <h3 className="text-md font-semibold text-gray-900 mb-2">
                  기본 정보
                </h3>
                <div className="flex justify-between">
                  <span className="text-gray-500">업종</span>
                  <span>{getShopTypeLabel(shop.shopType)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">면적</span>
                  <span>{Math.round(shop.area)}평</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">월 임대료</span>
                  <span>{Math.round(shop.monthlyRent / 10000)}만원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">보증금</span>
                  <span>{Math.round(shop.deposit / 10000)}만원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">입주 가능일</span>
                  <span>{shop.availableFrom || "문의"}</span>
                </div>
              </div>

              {/* 추천 업종 */}
              {shop.recommendedTypes && shop.recommendedTypes.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-md font-semibold text-gray-900">
                    추천 업종
                  </h3>
                  <div className="space-y-2">
                    {shop.recommendedTypes.slice(0, 3).map((rec, index) => (
                      <div
                        key={rec.type}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
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
                            <div className="text-sm font-medium text-gray-900">
                              {getShopTypeLabel(rec.type)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {rec.reason}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-bold text-[#6E62F6]">
                          {Math.round(rec.score)}점
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 상권 분석 요약 (있는 경우) */}
              {shop.marketAnalysis && (
                <div className="space-y-3">
                  <h3 className="text-md font-semibold text-gray-900">
                    상권 정보
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 p-3 rounded-lg text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {Math.round(
                          shop.marketAnalysis.footTraffic.dailyAverage / 1000
                        )}
                        k명
                      </div>
                      <div className="text-xs text-blue-600">일일 유동인구</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg text-center">
                      <div className="text-lg font-bold text-green-600">
                        {Math.round(
                          shop.marketAnalysis.characteristics.accessibilityScore
                        )}
                        /10
                      </div>
                      <div className="text-xs text-green-600">접근성 점수</div>
                    </div>
                  </div>

                  {shop.marketAnalysis.characteristics.nearbyFacilities && (
                    <div className="text-sm text-gray-600">
                      <strong>주변 시설:</strong>
                      학교{" "}
                      {Math.round(
                        shop.marketAnalysis.characteristics.nearbyFacilities
                          .schools
                      )}
                      개, 병원{" "}
                      {Math.round(
                        shop.marketAnalysis.characteristics.nearbyFacilities
                          .hospitals
                      )}
                      개, 상가{" "}
                      {Math.round(
                        shop.marketAnalysis.characteristics.nearbyFacilities
                          .shoppingMalls
                      )}
                      개
                    </div>
                  )}
                </div>
              )}

              {/* 상세 설명 */}
              <div>
                <h3 className="text-md font-semibold text-gray-900 mb-2">
                  설명
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {shop.description}
                </p>
              </div>

              {/* 특징 태그들 */}
              <div>
                <h3 className="text-md font-semibold text-gray-900 mb-2">
                  특징
                </h3>
                <div className="flex flex-wrap gap-2">
                  {shop.features?.map((feature, index) => (
                    <span
                      key={index}
                      className="text-xs bg-[#6E62F6]/10 text-[#6E62F6] px-2 py-1 rounded-full border border-[#6E62F6]/20"
                    >
                      {feature}
                    </span>
                  )) || (
                    <span className="text-sm text-gray-500">
                      특징 정보가 없습니다.
                    </span>
                  )}
                </div>
              </div>

              {/* 연락처 정보 */}
              <div className="border-t pt-4">
                <h3 className="text-md font-semibold text-gray-900 mb-2">
                  연락처
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {shop.contact.agent || "담당자 정보 없음"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {shop.contact.phone}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCallPhone(shop.contact.phone)}
                        className="bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700 transition-colors"
                      >
                        <svg
                          className="w-3 h-3 inline mr-1"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                        </svg>
                        전화
                      </button>
                      {shop.contact.email && (
                        <button
                          onClick={() => handleSendEmail(shop.contact.email!)}
                          className="bg-[#6E62F6] text-white px-3 py-1 text-sm rounded hover:bg-[#5A4EE8] transition-colors"
                        >
                          <svg
                            className="w-3 h-3 inline mr-1"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                          </svg>
                          메일
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 상세 분석 모달 */}
      {shop.recommendation && (
        <DetailedAnalysisModal
          isOpen={showDetailedAnalysis}
          onClose={() => setShowDetailedAnalysis(false)}
          recommendation={shop.recommendation}
          currentRent={shop.monthlyRent}
          area={shop.area}
          shopName={shop.name}
        />
      )}
    </div>
  );
}
