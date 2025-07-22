let isLoading = false;
let isLoaded = false;

export const loadNaverMapsScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 이미 로드되었으면 바로 resolve
    if (isLoaded && window.naver && window.naver.maps) {
      resolve();
      return;
    }

    // 이미 로딩 중이면 기다리기
    if (isLoading) {
      const checkLoaded = () => {
        if (isLoaded && window.naver && window.naver.maps) {
          resolve();
        } else {
          setTimeout(checkLoaded, 100);
        }
      };
      checkLoaded();
      return;
    }

    isLoading = true;

    // 기존 스크립트가 있는지 확인
    const existingScript = document.querySelector(
      'script[src*="oapi.map.naver.com"]'
    );
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.type = "text/javascript";

    // API 키 디버깅
    const ncpKeyId = process.env.NEXT_PUBLIC_NAVER_MAP_KEY_ID || "YOUR_KEY_ID";
    console.log(
      "🗝️ Naver Maps API Key:",
      ncpKeyId ? `${ncpKeyId.substring(0, 10)}...` : "NOT_SET"
    );

    if (ncpKeyId === "YOUR_KEY_ID" || !ncpKeyId) {
      const errorMsg =
        "Naver Maps API 키가 설정되지 않았습니다. .env.local 파일을 확인해주세요.";
      console.error("❌", errorMsg);
      isLoading = false;
      reject(new Error(errorMsg));
      return;
    }

    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${ncpKeyId}`;
    console.log("🌐 Loading Naver Maps from:", script.src);

    script.onload = () => {
      isLoaded = true;
      isLoading = false;
      console.log("✅ Naver Maps API loaded successfully");
      resolve();
    };

    script.onerror = (event) => {
      isLoading = false;
      console.error("❌ Failed to load Naver Maps API script:", event);
      reject(new Error("Failed to load Naver Maps API script"));
    };

    // 인증 실패 핸들러 추가
    if (typeof window !== "undefined") {
      (window as any).navermap_authFailure = function () {
        console.error(
          "❌ Naver Maps API authentication failed - 401 Unauthorized"
        );
        console.error("🔧 해결 방법:");
        console.error("1. API 키가 올바른지 확인");
        console.error("2. Naver Cloud Platform에서 Maps API 서비스 활성화");
        console.error("3. 허용 도메인에 localhost:3000, localhost:3001 추가");
        console.error("4. API 사용량 한도 확인");
        isLoading = false;
        reject(new Error("Naver Maps API authentication failed"));
      };
    }

    document.head.appendChild(script);
  });
};

// 글로벌 타입 확장
declare global {
  interface Window {
    naver: any;
    navermap_authFailure?: () => void;
  }
}
