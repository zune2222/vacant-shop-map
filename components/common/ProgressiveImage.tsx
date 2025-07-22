"use client";

import { useState, useEffect, useRef, SyntheticEvent } from "react";
import Image from "next/image";

interface ProgressiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
  blurDataURL?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  onLoad?: () => void;
  onError?: (error: SyntheticEvent<HTMLImageElement, Event>) => void;
  fallbackSrc?: string;
}

export default function ProgressiveImage({
  src,
  alt,
  width,
  height,
  className = "",
  placeholder,
  blurDataURL,
  priority = false,
  fill = false,
  sizes,
  onLoad,
  onError,
  fallbackSrc = "/images/placeholder.png",
}: ProgressiveImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const imageRef = useRef<HTMLImageElement>(null);

  // 이미지가 변경될 때 상태 리셋
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
    setCurrentSrc(src);
  }, [src]);

  const handleLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleError = (error: SyntheticEvent<HTMLImageElement, Event>) => {
    setImageError(true);
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setImageError(false); // 폴백 이미지 시도를 위해 에러 상태 리셋
    }
    onError?.(error);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* 스켈레톤/로딩 상태 */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}

      {/* 에러 상태 */}
      {imageError && currentSrc === fallbackSrc && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <svg
              className="w-8 h-8 text-gray-400 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-xs text-gray-500">이미지를 불러올 수 없습니다</p>
          </div>
        </div>
      )}

      {/* 실제 이미지 */}
      <div
        className={`transition-opacity duration-500 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        {fill ? (
          <Image
            ref={imageRef}
            src={currentSrc}
            alt={alt}
            fill
            className="object-cover"
            sizes={sizes}
            placeholder={placeholder ? "blur" : "empty"}
            blurDataURL={blurDataURL}
            priority={priority}
            onLoad={handleLoad}
            onError={handleError}
          />
        ) : (
          <Image
            ref={imageRef}
            src={currentSrc}
            alt={alt}
            width={width}
            height={height}
            className="object-cover"
            placeholder={placeholder ? "blur" : "empty"}
            blurDataURL={blurDataURL}
            priority={priority}
            onLoad={handleLoad}
            onError={handleError}
          />
        )}
      </div>
    </div>
  );
}

/**
 * 이미지 갤러리용 점진적 로딩 컴포넌트
 */
export function ProgressiveImageGallery({
  images,
  className = "",
  onImageClick,
}: {
  images: { src: string; alt: string }[];
  className?: string;
  onImageClick?: (index: number) => void;
}) {
  return (
    <div className={`grid gap-2 ${className}`}>
      {images.map((image, index) => (
        <div
          key={index}
          className="relative aspect-video cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => onImageClick?.(index)}
        >
          <ProgressiveImage
            src={image.src}
            alt={image.alt}
            fill
            className="rounded-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ))}
    </div>
  );
}

/**
 * 썸네일 이미지 컴포넌트
 */
export function ProgressiveThumbnail({
  src,
  alt,
  size = 64,
  className = "",
  onClick,
}: {
  src: string;
  alt: string;
  size?: number;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={`relative cursor-pointer ${className}`}
      style={{ width: size, height: size }}
      onClick={onClick}
    >
      <ProgressiveImage
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="rounded-md"
      />
    </div>
  );
}

/**
 * 아바타 이미지 컴포넌트
 */
export function ProgressiveAvatar({
  src,
  alt,
  size = 40,
  className = "",
  fallback,
}: {
  src?: string;
  alt: string;
  size?: number;
  className?: string;
  fallback?: string;
}) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-300 rounded-full text-gray-600 font-medium ${className}`}
        style={{ width: size, height: size }}
      >
        {fallback || alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      <ProgressiveImage
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="rounded-full"
      />
    </div>
  );
}
