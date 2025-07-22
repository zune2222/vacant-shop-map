"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * 이미지 갤러리 컴포넌트 프로퍼티
 */
interface ImageGalleryProps {
  images: string[];
  shopName?: string;
}

/**
 * 이미지 갤러리 컴포넌트
 * 메인 이미지와 썸네일 리스트를 제공합니다.
 */
export default function ImageGallery({
  images,
  shopName = "상점",
}: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // 이미지가 없는 경우 플레이스홀더 표시
  if (!images || images.length === 0) {
    return (
      <div className="h-48 bg-gray-200 flex items-center justify-center rounded-lg">
        <div className="text-center text-gray-500">
          <div className="text-2xl mb-2">🏪</div>
          <span>이미지가 없습니다</span>
        </div>
      </div>
    );
  }

  /**
   * 썸네일 클릭 핸들러
   */
  const handleThumbnailClick = (index: number) => {
    setActiveIndex(index);
  };

  /**
   * 이미지 로드 에러 핸들러
   */
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    // 플레이스홀더 이미지로 대체 (영어 텍스트로 btoa 인코딩 오류 방지)
    const img = e.target as HTMLImageElement;
    img.src = `data:image/svg+xml;base64,${btoa(`
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="system-ui" font-size="16" fill="#9ca3af">
          Image Load Failed
        </text>
      </svg>
    `)}`;
  };

  return (
    <div className="space-y-3">
      {/* 메인 이미지 */}
      <div className="relative h-48 rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={images[activeIndex]}
          alt={`${shopName} 메인 이미지`}
          fill
          className="object-cover transition-all duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={activeIndex === 0} // 첫 번째 이미지는 우선 로드
          onError={handleImageError}
        />

        {/* 이미지 번호 표시 */}
        {images.length > 1 && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* 썸네일 리스트 (이미지가 2개 이상인 경우만 표시) */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto py-1">
          {images.map((image, index) => (
            <button
              key={index}
              className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                index === activeIndex
                  ? "border-blue-500 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleThumbnailClick(index)}
              aria-label={`${shopName} 이미지 ${index + 1} 보기`}
            >
              <Image
                src={image}
                alt={`${shopName} 썸네일 ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
                onError={handleImageError}
              />

              {/* 선택된 썸네일 표시 */}
              {index === activeIndex && (
                <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* 이미지 정보 텍스트 (옵션) */}
      {images.length > 0 && (
        <p className="text-xs text-gray-500 text-center">
          {images.length === 1
            ? "상점 이미지"
            : `총 ${images.length}장의 이미지 • 썸네일을 클릭하여 확대 보기`}
        </p>
      )}
    </div>
  );
}
