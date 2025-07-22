# 공실 상가 지도

한국의 공실 상가 정보를 지도에서 쉽게 확인할 수 있는 웹 애플리케이션입니다.

## 🚀 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Maps**: Naver Maps API
- **HTTP Client**: Axios (API 서비스 레이어)
- **UI Components**: Headless UI, Framer Motion

## 📦 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Naver Maps API Key ID (필수)
NEXT_PUBLIC_NAVER_MAP_KEY_ID=실제_키_ID_입력

# API 서버 설정 (선택사항 - 기본값: /api)
# NEXT_PUBLIC_API_URL=https://your-api-server.com/api

# Mock 데이터 사용 설정 (개발용 - 기본값: true)
NEXT_PUBLIC_USE_MOCK_DATA=true

# 개발 환경 설정
NODE_ENV=development
```

### 3. Naver Cloud Platform API 키 발급

1. [Naver Cloud Platform](https://www.ncloud.com/) 회원가입
2. 콘솔 > AI·Application Service > Maps API 신청
3. API Key ID 발급 및 복사
4. `.env.local`에 발급받은 키 입력

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하세요.

## 📱 주요 기능

- ✅ **반응형 디자인**: 모바일 우선 접근 방식
- ✅ **Naver Maps 통합**: 한국 지역에 최적화된 지도 (부산 중심)
- ✅ **타입 안전성**: TypeScript 인터페이스로 완전한 타입 정의
- ✅ **API 서비스 레이어**: Axios 기반 HTTP 클라이언트 및 캐싱
- ✅ **Mock 데이터**: 개발용 샘플 데이터 및 Next.js API Routes
- 🔄 **공실 상가 마커**: 지도상에 상가 정보 표시 (개발 중)
- 🔄 **필터링**: 임대료, 면적, 업종별 필터링 (개발 중)
- 🔄 **상세 정보**: 바텀시트로 상가 상세 정보 (개발 중)

## 🔧 API 서비스 아키텍처

### API 클라이언트 기능

- **에러 처리**: 상태 코드별 한국어 에러 메시지
- **요청/응답 로깅**: 개발 환경에서 자동 로깅
- **타임아웃 설정**: 10초 타임아웃
- **인터셉터**: 공통 로직 처리

### 캐싱 전략

- **메모리 캐싱**: 5분 TTL로 API 응답 캐싱
- **캐시 무효화**: 특정 데이터 업데이트시 관련 캐시 삭제
- **폴백 처리**: API 실패시 Mock 데이터 자동 사용

### Mock API 엔드포인트

개발 중 다음 엔드포인트들을 사용할 수 있습니다:

- `GET /api/shops` - 공실 상가 목록 (필터링, 페이지네이션 지원)
- `GET /api/shops/[id]` - 특정 상가 상세 정보
- `GET /api/health` - API 헬스체크

### API 사용 예시

```typescript
import { getShops, getShopById } from "@/lib/api";

// 상가 목록 조회 (필터링)
const shops = await getShops({
  filter: {
    rentRange: [0, 200],
    shopTypes: ["restaurant"],
    region: "해운대구",
  },
  limit: 10,
});

// 특정 상가 조회
const shop = await getShopById("shop-001");
```

## 🛠️ 개발 진행상황

- [x] **Task 1**: Next.js 14 프로젝트 초기화
- [x] **Task 2**: 기본 레이아웃 및 반응형 디자인 구현
- [x] **Task 3**: Naver Maps API 통합 및 기본 지도 표시
- [x] **Task 4**: 데이터 모델 및 타입 인터페이스 정의
- [x] **Task 5**: API 서비스 레이어 구현
- [ ] **Task 6**: 지도에 마커 표시 기능 구현
- [ ] **Task 7**: 바텀시트 상세 정보 컴포넌트
- [ ] **Task 8**: 필터 시스템 구현
- [ ] **Task 9**: 검색 기능 구현
- [ ] **Task 10**: 성능 최적화 및 테스트

## 📋 타입 정의

프로젝트는 완전한 TypeScript 타입 정의를 포함합니다:

- `VacantShop`: 공실 상가 정보
- `MapFilter`: 필터링 조건
- `BottomSheetState`: 바텀시트 상태
- `MapMarker`: 지도 마커 정보

모든 타입은 `@/types`에서 import할 수 있습니다.

## 🧪 테스트

```bash
# 단위 테스트 실행 (준비 중)
npm test

# E2E 테스트 실행 (준비 중)
npm run test:e2e
```

## 📄 라이센스

MIT License

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. feature 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다
