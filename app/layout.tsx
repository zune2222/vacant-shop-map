import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "공실 상가 지도 | 빈 상가 정보 검색",
  description:
    "전국의 공실 상가 정보를 지도에서 쉽게 찾아보세요. 임대료, 면적, 업종별 필터링 지원",
  keywords: "공실상가, 빈상가, 상가임대, 상가정보, 지도검색, 상가검색, 부동산",
  authors: [{ name: "Vacant Shop Map Team" }],
  creator: "Vacant Shop Map",
  publisher: "Vacant Shop Map",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
  ),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/logo.png",
    shortcut: "/logo.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "공실 상가 지도",
    description: "전국의 공실 상가 정보를 지도에서 쉽게 찾아보세요",
    url: "/",
    siteName: "Vacant Shop Map",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "공실 상가 지도 - 상가와 돋보기 로고",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "공실 상가 지도",
    description: "전국의 공실 상가 정보를 지도에서 쉽게 찾아보세요",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <meta name="theme-color" content="#1f2937" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="공실 상가 지도" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          {/* 메인 애플리케이션 콘텐츠 */}
          <div className="min-h-screen">{children}</div>
        </ErrorBoundary>
      </body>
    </html>
  );
}
