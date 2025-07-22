# 🌍 환경 변수 설정 가이드

공실 상가 지도 애플리케이션을 Vercel에 배포하기 위해 필요한 환경 변수들을 설정해주세요.

## 📋 필수 환경 변수

### 🗺️ 네이버 지도 API

```bash
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=your_naver_map_client_id_here
NEXT_PUBLIC_NAVER_MAP_API_KEY=your_naver_map_api_key_here
```

### 🌐 API 설정

```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_APP_ENV=production
```

## 🛡️ 선택적 환경 변수

### 📊 분석 도구

```bash
# Google Analytics (선택사항)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Sentry 오류 추적 (선택사항)
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn-here
```

### 🚀 Vercel 기능

```bash
# Vercel Analytics (권장)
NEXT_PUBLIC_VERCEL_ANALYTICS=true

# Vercel Speed Insights (권장)
NEXT_PUBLIC_SPEED_INSIGHTS=true
```

## 🔧 Vercel 대시보드 설정 방법

1. **Vercel 대시보드** → **프로젝트 선택** → **Settings** → **Environment Variables**
2. 위의 환경 변수들을 하나씩 추가:

   - **Name**: 환경 변수 이름 (예: `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID`)
   - **Value**: 실제 값
   - **Environment**: `Production`, `Preview`, `Development` 선택

3. **저장** 후 **Redeploy** 실행

## 📱 로컬 개발용 .env.local

로컬 개발 시에는 `.env.local` 파일을 프로젝트 루트에 생성하고 다음과 같이 설정하세요:

```bash
# .env.local (로컬 개발용)
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=your_development_client_id
NEXT_PUBLIC_NAVER_MAP_API_KEY=your_development_api_key
NEXT_PUBLIC_USE_MOCK_DATA=true
NEXT_PUBLIC_APP_ENV=development
```

## ⚠️ 보안 주의사항

- `NEXT_PUBLIC_` 접두사가 붙은 변수는 클라이언트에서 접근 가능합니다
- API 키와 같은 민감한 정보는 절대 Git에 커밋하지 마세요
- 프로덕션과 개발 환경에서 다른 API 키를 사용하는 것을 권장합니다

## 🔗 관련 문서

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [네이버 지도 API 가이드](https://navermaps.github.io/maps.js.ncp/)
