# 🚀 배포 가이드 - Vercel

공실 상가 지도 애플리케이션을 Vercel에 배포하기 위한 완전한 가이드입니다.

## 📋 사전 준비

### 1. 필수 계정

- [GitHub 계정](https://github.com) (프로젝트 코드 저장용)
- [Vercel 계정](https://vercel.com) (배포용)
- [네이버 개발자 센터](https://developers.naver.com/main/) (지도 API 키 발급용)

### 2. 로컬 개발 환경

```bash
# Node.js 18 이상 설치 확인
node --version

# 프로젝트 클론
git clone https://github.com/your-username/vacant-shop-map.git
cd vacant-shop-map

# 의존성 설치
npm install

# 로컬 개발 서버 실행
npm run dev
```

## 🗺️ 네이버 지도 API 설정

### 1. 애플리케이션 등록

1. [네이버 개발자 센터](https://developers.naver.com/main/)에 로그인
2. **Application → 애플리케이션 등록** 선택
3. 애플리케이션 정보 입력:
   - **애플리케이션 이름**: 공실 상가 지도
   - **사용 API**: Maps
   - **서비스 환경**: WEB
   - **서비스 URL**:
     - 로컬: `http://localhost:3000`
     - 배포: `https://your-app-name.vercel.app`

### 2. API 키 발급 및 설정

```bash
# .env.local 파일 생성 (로컬 개발용)
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=your_client_id_here
NEXT_PUBLIC_NAVER_MAP_API_KEY=your_api_key_here
NEXT_PUBLIC_USE_MOCK_DATA=true
NEXT_PUBLIC_APP_ENV=development
```

## 🚀 Vercel 배포

### 방법 1: Vercel 대시보드 (권장)

1. **Vercel 대시보드 접속**

   - https://vercel.com/dashboard 로그인

2. **프로젝트 Import**

   - **New Project** → **Import Git Repository**
   - GitHub 계정 연결 후 프로젝트 선택

3. **환경 변수 설정**

   - **Environment Variables** 섹션에서 다음 변수들 추가:

   ```
   NEXT_PUBLIC_NAVER_MAP_CLIENT_ID = [네이버 클라이언트 ID]
   NEXT_PUBLIC_NAVER_MAP_API_KEY = [네이버 API 키]
   NEXT_PUBLIC_USE_MOCK_DATA = false
   NEXT_PUBLIC_APP_ENV = production
   ```

4. **배포 설정**

   - **Framework Preset**: Next.js 자동 선택됨
   - **Build Command**: `npm run build` (자동 설정됨)
   - **Output Directory**: `.next` (자동 설정됨)

5. **Deploy** 클릭!

### 방법 2: Vercel CLI

```bash
# Vercel CLI 설치
npm install -g vercel

# 로그인
vercel login

# 프로젝트 배포
vercel

# 프로덕션 배포
vercel --prod
```

## ⚙️ GitHub Actions CI/CD (선택사항)

자동화된 배포를 위해 GitHub Actions를 설정할 수 있습니다.

### 1. GitHub Secrets 설정

GitHub 저장소 → **Settings** → **Secrets and variables** → **Actions**:

```
VERCEL_TOKEN = [Vercel 계정 토큰]
VERCEL_ORG_ID = [Vercel 조직 ID]
VERCEL_PROJECT_ID = [Vercel 프로젝트 ID]
```

### 2. 토큰 발급 방법

- **Vercel Token**: [Vercel 설정](https://vercel.com/account/tokens)에서 생성
- **Org ID & Project ID**:
  ```bash
  npx vercel link
  cat .vercel/project.json
  ```

### 3. 자동 배포 활성화

- `.github/workflows/ci-cd.yml` 파일이 이미 설정됨
- `main` 브랜치에 Push 시 자동 배포
- PR 생성 시 Preview 배포

## 🔧 배포 후 확인사항

### 1. 기능 테스트 체크리스트

- [ ] 📱 메인 페이지 로딩
- [ ] 🗺️ 지도 정상 표시
- [ ] 📍 마커 표시 및 클릭
- [ ] 📋 바텀시트 동작
- [ ] 🔍 필터 기능
- [ ] 📱 모바일 반응형
- [ ] 🌐 현재 위치 기능

### 2. 성능 확인

```bash
# Lighthouse 스코어 확인
npx lighthouse https://your-app.vercel.app --view

# 성능 목표
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+
```

### 3. 모니터링 설정

- **Vercel Analytics**: 자동 활성화됨
- **Console 에러 확인**: DevTools → Console
- **Network 탭 확인**: API 호출 상태

## 🛠️ 배포 문제 해결

### 빌드 실패 시

```bash
# 로컬에서 빌드 테스트
npm run build

# 타입 에러 확인
npm run type-check

# ESLint 에러 확인
npm run lint
```

### 지도 표시 안됨

1. 네이버 API 키 확인
2. 도메인 화이트리스트 확인
3. CORS 설정 확인

### 환경 변수 문제

1. Vercel 대시보드에서 변수 확인
2. `NEXT_PUBLIC_` 접두사 확인
3. 재배포 실행

## 🔄 배포 업데이트

### 자동 배포 (GitHub 연결 시)

```bash
git add .
git commit -m "feat: 새로운 기능 추가"
git push origin main
# Vercel에서 자동 배포됨
```

### 수동 배포

```bash
vercel --prod
```

## 📈 성능 최적화

### 1. 번들 사이즈 분석

```bash
# 번들 분석 실행
npm run build:analyze

# 결과 확인
open .next/analyze/client.html
```

### 2. 이미지 최적화

- Next.js Image 컴포넌트 사용
- WebP/AVIF 형식 자동 변환
- Lazy loading 적용

### 3. 캐싱 전략

- CDN 캐싱 (Vercel 자동)
- 브라우저 캐싱 설정
- API 응답 캐싱

## 🌐 도메인 연결 (선택사항)

### 1. 커스텀 도메인 설정

1. Vercel 대시보드 → **프로젝트 선택** → **Settings** → **Domains**
2. **Add Domain** → 도메인 입력
3. DNS 설정:

   ```
   Type: A
   Name: @
   Value: 76.76.19.61

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### 2. SSL 인증서

- Vercel에서 자동으로 Let's Encrypt SSL 적용
- HTTPS 리다이렉트 자동 설정

## 🎉 배포 완료!

축하합니다! 🎊 공실 상가 지도 애플리케이션이 성공적으로 배포되었습니다.

### 다음 단계

- [ ] 사용자 피드백 수집
- [ ] Google Analytics 설정
- [ ] SEO 최적화
- [ ] PWA 기능 추가
- [ ] 백엔드 API 연동

### 문의 및 지원

- 배포 관련 문제: [GitHub Issues](https://github.com/your-username/vacant-shop-map/issues)
- Vercel 공식 문서: [https://vercel.com/docs](https://vercel.com/docs)
- Next.js 공식 문서: [https://nextjs.org/docs](https://nextjs.org/docs)
