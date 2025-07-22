<div align="center">
  <img src="./public/logo.png" alt="공실 상가 지도 로고" width="120" height="120" />
  
  # 🗺️ 공실 상가 지도

> 모바일 최적화된 공실 상가 정보 지도 서비스

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)

</div>

## 🌟 프로젝트 소개

사업자들이 쉽게 공실 상가를 찾을 수 있도록 도와주는 모바일 최적화 웹 애플리케이션입니다.
네이버 지도 API를 활용하여 직관적인 지도 인터페이스를 제공하며,
다양한 필터링 옵션과 상세 정보를 통해 최적의 상가를 찾을 수 있습니다.

### ✨ 주요 기능

- 🗺️ **대화형 지도**: 네이버 지도 기반 실시간 지도 서비스
- 📍 **마커 클러스터링**: 효율적인 마커 표시 및 성능 최적화
- 📱 **모바일 최적화**: 반응형 디자인으로 모든 기기 지원
- 🔍 **스마트 필터**: 임대료, 면적, 업종별 상세 필터링
- 📋 **상세 정보**: 드래그 가능한 바텀시트로 상가 정보 확인
- 🌍 **현재 위치**: GPS를 통한 현재 위치 기반 검색
- ⚡ **고성능**: 코드 분할, 캐싱, 디바운싱으로 최적화
- 🛡️ **에러 핸들링**: 네트워크 오류, 오프라인 상태 감지
- 💀 **스켈레톤 UI**: 로딩 상태 개선으로 사용자 경험 향상

## 🛠️ 기술 스택

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.0+
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animation**: Framer Motion
- **HTTP Client**: Axios
- **Map Service**: 네이버 지도 API

### Development & Deployment

- **Package Manager**: npm
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions
- **Code Quality**: ESLint, TypeScript
- **Performance**: Lighthouse CI

### Performance Optimizations

- 🚀 **코드 분할**: Dynamic imports로 필요한 시점에 로딩
- 💾 **데이터 캐싱**: LRU 캐시로 API 응답 최적화
- ⏱️ **디바운싱**: 사용자 입력 및 API 호출 최적화
- 🖼️ **이미지 최적화**: Next.js Image 컴포넌트 활용
- 📱 **뷰포트 렌더링**: 화면에 보이는 마커만 렌더링

## 🚀 빠른 시작

### 사전 요구사항

- Node.js 18.0 이상
- npm 또는 yarn
- Git

### 로컬 개발 환경 설정

1. **저장소 클론**

```bash
git clone https://github.com/your-username/vacant-shop-map.git
cd vacant-shop-map
```

2. **의존성 설치**

```bash
npm install
```

3. **환경 변수 설정**

```bash
# .env.local 파일 생성
cp .env.example .env.local

# 환경 변수 수정 (.env.local)
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=your_client_id_here
NEXT_PUBLIC_NAVER_MAP_API_KEY=your_api_key_here
NEXT_PUBLIC_USE_MOCK_DATA=true
NEXT_PUBLIC_APP_ENV=development
```

4. **개발 서버 실행**

```bash
npm run dev
```

5. **브라우저에서 확인**

```
http://localhost:3000
```

## 📖 API 설정 가이드

### 네이버 지도 API 키 발급

1. [네이버 개발자 센터](https://developers.naver.com/main/) 접속
2. **Application → 애플리케이션 등록**
3. 서비스 정보 입력:
   - 서비스명: 공실 상가 지도
   - 사용 API: Maps
   - 서비스 환경: WEB
   - 서비스 URL: `http://localhost:3000` (개발), `https://your-domain.com` (프로덕션)

자세한 설정 방법은 [환경 변수 가이드](./deployment/env-setup.md)를 참고하세요.

## 🏗️ 빌드 및 배포

### 로컬 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview

# 타입 검사
npm run type-check

# 코드 품질 검사
npm run lint

# 번들 사이즈 분석
npm run build:analyze
```

### Vercel 배포

#### 방법 1: Vercel Dashboard (권장)

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. **New Project** → GitHub 저장소 연결
3. 환경 변수 설정 (프로덕션용 API 키)
4. **Deploy** 클릭

#### 방법 2: Vercel CLI

```bash
# Vercel CLI 설치
npm install -g vercel

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

자세한 배포 가이드는 [배포 가이드](./deployment/DEPLOYMENT_GUIDE.md)를 참고하세요.

## 🧪 테스팅

### 수동 테스트 체크리스트

- [ ] 메인 페이지 로딩
- [ ] 지도 표시 및 상호작용
- [ ] 마커 클릭 → 바텀시트 열기
- [ ] 필터 기능 (임대료, 면적, 업종)
- [ ] 현재 위치 기능
- [ ] 모바일 반응형 디자인
- [ ] 오프라인 상태 처리

### 성능 테스트

```bash
# Lighthouse 성능 측정
npx lighthouse http://localhost:3000 --view

# 성능 목표
# - Performance: 90+
# - Accessibility: 95+
# - Best Practices: 95+
# - SEO: 90+
```

## 📁 프로젝트 구조

```
📦 vacant-shop-map
├── 🗂️ app/                    # Next.js App Router
│   ├── page.tsx               # 메인 페이지
│   ├── layout.tsx             # 루트 레이아웃
│   └── globals.css            # 글로벌 스타일
├── 🧩 components/             # UI 컴포넌트
│   ├── Map/                   # 지도 관련 컴포넌트
│   ├── BottomSheet/          # 바텀시트 컴포넌트
│   ├── Filter/               # 필터 컴포넌트
│   └── common/               # 공통 컴포넌트
├── 🪝 hooks/                  # 커스텀 훅
├── 📚 lib/                    # 유틸리티 라이브러리
│   ├── api/                  # API 서비스
│   ├── performance/          # 성능 최적화
│   └── utils/                # 유틸리티 함수
├── 🏪 store/                  # Zustand 스토어
├── 🔧 types/                  # TypeScript 타입 정의
├── 🚀 deployment/             # 배포 관련 문서
│   ├── DEPLOYMENT_GUIDE.md   # 배포 가이드
│   └── env-setup.md          # 환경 변수 설정
└── 📄 docs/                   # 프로젝트 문서
```

## 🤝 기여하기

1. Fork 프로젝트
2. 기능 브랜치 생성: `git checkout -b feature/AmazingFeature`
3. 변경사항 커밋: `git commit -m 'Add some AmazingFeature'`
4. 브랜치에 Push: `git push origin feature/AmazingFeature`
5. Pull Request 생성

### 개발 가이드라인

- 📝 **커밋 메시지**: [Conventional Commits](https://www.conventionalcommits.org/) 사용
- 🧪 **테스트**: 새로운 기능 추가 시 테스트 포함
- 📖 **문서화**: 주요 기능 변경 시 README 업데이트
- 🎨 **코드 스타일**: ESLint, Prettier 설정 준수

## 📱 스크린샷

### 데스크톱

![Desktop Screenshot](docs/images/desktop-screenshot.png)

### 모바일

![Mobile Screenshot](docs/images/mobile-screenshot.png)

## 📄 라이센스

이 프로젝트는 MIT 라이센스를 따릅니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참고하세요.

## 👥 개발팀

- **개발자**: [Your Name](https://github.com/your-username)
- **디자인**: UI/UX 디자인 팀
- **기획**: 제품 기획 팀

## 📞 문의 및 지원

- 📧 **이메일**: your-email@example.com
- 🐛 **버그 리포트**: [GitHub Issues](https://github.com/your-username/vacant-shop-map/issues)
- 📖 **문서**: [프로젝트 Wiki](https://github.com/your-username/vacant-shop-map/wiki)
- 💬 **토론**: [GitHub Discussions](https://github.com/your-username/vacant-shop-map/discussions)

## 🙏 감사

- [Next.js](https://nextjs.org/) - React 프레임워크
- [Vercel](https://vercel.com/) - 배포 플랫폼
- [Tailwind CSS](https://tailwindcss.com/) - CSS 프레임워크
- [네이버 지도 API](https://navermaps.github.io/maps.js.ncp/) - 지도 서비스
- [Framer Motion](https://www.framer.com/motion/) - 애니메이션 라이브러리

---

⭐ **이 프로젝트가 도움이 되었다면 스타를 눌러주세요!** ⭐
