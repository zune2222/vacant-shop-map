/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 14 최적화
  experimental: {
    // optimizeCss: true, // critters 모듈 의존성 문제로 임시 비활성화
    optimizePackageImports: ["@headlessui/react", "framer-motion"],
  },

  // 이미지 최적화 (Vercel 배포용)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // 모든 HTTPS 이미지 허용
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
    unoptimized: process.env.NODE_ENV === "development", // 개발 시에만 최적화 해제
  },

  // 컴파일러 최적화
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
    reactRemoveProperties: process.env.NODE_ENV === "production",
  },

  // 번들 최적화
  webpack: (config, { isServer }) => {
    // 번들 사이즈 분석 (환경변수로 활성화)
    if (process.env.ANALYZE === "true") {
      const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "static",
          openAnalyzer: false,
          reportFilename: `${isServer ? "server" : "client"}.html`,
        })
      );
    }

    // 성능 최적화
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            priority: 10,
            reuseExistingChunk: true,
          },
          common: {
            name: "commons",
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      },
    };

    return config;
  },

  // 보안 헤더 설정
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
      {
        // 정적 에셋 캐싱
        source: "/(_next/static|favicon|icon|apple|android)/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // 리다이렉트 설정
  async redirects() {
    return [
      // 필요한 경우 리다이렉트 추가
    ];
  },

  // 환경 변수 설정
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY || "default-value",
  },

  // PWA 지원을 위한 설정
  async rewrites() {
    return [
      {
        source: "/sw.js",
        destination: "/_next/static/sw.js",
      },
    ];
  },

  // 성능 최적화
  poweredByHeader: false, // X-Powered-By 헤더 제거
  compress: true, // gzip 압축 활성화
  generateEtags: true, // ETag 헤더 생성

  // Vercel 최적화
  trailingSlash: false,
  cleanDistDir: true,
};

module.exports = nextConfig;
