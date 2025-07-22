"use client";

import { useEffect, useState } from "react";
import { VacantShop } from "@/types";
import { useBottomSheetStore } from "@/store/bottomSheetStore";
import { ShopDetailSkeleton } from "@/components/Shop";
import { ApiErrorState } from "@/components/common";
import ImageGallery from "./ImageGallery";

/**
 * 빈 상점 상세 정보 컴포넌트
 */
export default function ShopDetail() {
  const { shopId, setHeight } = useBottomSheetStore();
  const [shop, setShop] = useState<VacantShop | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 상가 유형별 라벨 반환
   */
  const getShopTypeLabel = (type: string): string => {
    switch (type) {
      case "restaurant":
        return "음식점";
      case "retail":
        return "소매";
      case "office":
        return "사무실";
      case "etc":
      default:
        return "기타";
    }
  };

  /**
   * 상점 데이터 로드 (임시 목 데이터)
   */
  useEffect(() => {
    if (!shopId) return;

    setLoading(true);
    setError(null);

    // 임시 목 데이터 (API 호출로 대체 예정)
    setTimeout(() => {
      const mockShop: VacantShop = {
        id: shopId,
        name: `상점 ${shopId}`,
        address: "부산광역시 해운대구 센텀동로 99",
        latitude: 35.22889,
        longitude: 129.0813095,
        monthlyRent: 1500000,
        deposit: 10000000,
        area: 45.5,
        shopType: "restaurant",
        description:
          "접객이 좋고 유동인구가 많은 번화가 위치의 상점입니다. 대중교통 접근성이 뛰어나며 주변 상권이 잘 발달되어 있습니다.",
        images: [
          "/images/shop-placeholder-1.jpg",
          "/images/shop-placeholder-2.jpg",
          "/images/shop-placeholder-3.jpg",
        ],
        contact: {
          phone: "051-123-4567",
          email: "contact@example.com",
          agent: "김중개",
        },
        features: ["주차 가능", "화장실 별도", "에어컨 완비", "인터넷 설치"],
        availableFrom: "2024-02-01",
        createdAt: new Date("2024-01-15T09:00:00Z"),
        updatedAt: new Date("2024-01-15T09:00:00Z"),
      };

      setShop(mockShop);
      setLoading(false);
    }, 800); // 로딩 시간을 약간 줄임

    return () => {
      setShop(null);
      setError(null);
    };
  }, [shopId]);

  /**
   * 전체 보기 버튼 클릭
   */
  const handleViewFull = () => {
    setHeight("full");
  };

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

  if (loading) {
    return (
      <div className="p-4">
        <ShopDetailSkeleton />
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  if (!shop) {
    return (
      <div className="p-4">
        <ApiErrorState
          title="상점 정보 없음"
          message="상점 정보를 찾을 수 없습니다."
          size="medium"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      {/* 헤더 정보 */}
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{shop.name}</h2>
        <p className="text-sm text-gray-600 mb-3">{shop.address}</p>

        {/* 가격 정보 */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-lg font-bold text-blue-600">
              월세 {shop.monthlyRent.toLocaleString()}만원
            </span>
            <span className="text-sm text-gray-500 ml-2">
              / 보증금 {shop.deposit.toLocaleString()}만원
            </span>
          </div>
          <span className="text-sm bg-gray-100 px-2 py-1 rounded">
            {shop.area}평
          </span>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex gap-2">
          <button
            onClick={() => handleCallPhone(shop.contact.phone)}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            📞 전화하기
          </button>
          <button
            onClick={handleViewFull}
            className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            📋 자세히 보기
          </button>
        </div>
      </div>

      {/* 상점 이미지 갤러리 - 새로운 ImageGallery 컴포넌트 사용 */}
      <div>
        <h3 className="text-md font-semibold text-gray-900 mb-3">사진</h3>
        <ImageGallery images={shop.images} shopName={shop.name} />
      </div>

      {/* 기본 정보 */}
      <div className="space-y-2">
        <h3 className="text-md font-semibold text-gray-900 mb-2">기본 정보</h3>
        <div className="flex justify-between">
          <span className="text-gray-500">업종</span>
          <span>{getShopTypeLabel(shop.shopType)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">면적</span>
          <span>{shop.area}평</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">월 임대료</span>
          <span>{shop.monthlyRent.toLocaleString()}만원</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">보증금</span>
          <span>{shop.deposit.toLocaleString()}만원</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">입주 가능일</span>
          <span>{shop.availableFrom || "문의"}</span>
        </div>
      </div>

      {/* 상세 설명 */}
      <div>
        <h3 className="text-md font-semibold text-gray-900 mb-2">설명</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {shop.description}
        </p>
      </div>

      {/* 특징 태그들 */}
      <div>
        <h3 className="text-md font-semibold text-gray-900 mb-2">특징</h3>
        <div className="flex flex-wrap gap-2">
          {shop.features?.map((feature, index) => (
            <span
              key={index}
              className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full"
            >
              {feature}
            </span>
          )) || (
            <span className="text-sm text-gray-500">특징 정보가 없습니다.</span>
          )}
        </div>
      </div>

      {/* 연락처 정보 */}
      <div className="border-t pt-4">
        <h3 className="text-md font-semibold text-gray-900 mb-2">연락처</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                {shop.contact.agent || "담당자 정보 없음"}
              </p>
              <p className="text-sm text-gray-600">{shop.contact.phone}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleCallPhone(shop.contact.phone)}
                className="bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700 transition-colors"
              >
                📞 전화
              </button>
              {shop.contact.email && (
                <button
                  onClick={() => handleSendEmail(shop.contact.email!)}
                  className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  ✉️ 메일
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
