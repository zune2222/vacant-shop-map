"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useFilterStore } from "@/store/filterStore";

export default function Header() {
  const [isMounted, setIsMounted] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const { openFilterPanel } = useFilterStore();

  // Hydration-safe mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* 로고 및 제목 */}
        <div className="flex items-center space-x-3">
          <div className="relative w-8 h-8 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="공실 상가 지도 로고"
              width={32}
              height={32}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          {showTitle && (
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                공실상가지도
              </h1>
              <p className="text-xs text-gray-500 leading-none">
                빈 상가를 쉽게 찾아보세요
              </p>
            </div>
          )}
        </div>

        {/* 우측 액션 버튼들 - 클라이언트에서만 렌더링 */}
        <div className="flex items-center space-x-2">
          {isMounted && (
            <>
              {/* 필터 버튼 */}
              <button
                onClick={openFilterPanel}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="필터 열기"
                data-testid="filter-button"
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
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
                  />
                </svg>
              </button>

              {/* 메뉴 토글 버튼 (모바일용) */}
              <button
                onClick={() => setShowTitle(!showTitle)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors sm:hidden"
                aria-label="제목 토글"
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
                    d={
                      showTitle
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 진행 표시바 (선택사항) */}
      <div className="h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
    </header>
  );
}

export function HeaderSpacer() {
  return <div className="h-16" />;
}
