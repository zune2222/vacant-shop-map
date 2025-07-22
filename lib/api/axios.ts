import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

/**
 * API 응답 기본 형태
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * API 에러 형태
 */
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

/**
 * 기본 API 클라이언트 설정
 */
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10초
});

/**
 * 요청 인터셉터 - 모든 요청에 공통 로직 적용
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 요청 시작 시간 기록 (성능 측정용)
    (config as any).metadata = { startTime: Date.now() };

    // 개발 환경에서 요청 로깅
    if (process.env.NODE_ENV === "development") {
      console.log("🚀 API Request:", {
        method: config.method?.toUpperCase(),
        url: config.url,
        params: config.params,
        data: config.data,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

/**
 * 응답 인터셉터 - 모든 응답에 공통 에러 처리 적용
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 응답 시간 계산
    const config = response.config as any;
    if (config.metadata?.startTime) {
      const responseTime = Date.now() - config.metadata.startTime;

      // 개발 환경에서 응답 로깅
      if (process.env.NODE_ENV === "development") {
        console.log("✅ API Response:", {
          method: config.method?.toUpperCase(),
          url: config.url,
          status: response.status,
          responseTime: `${responseTime}ms`,
        });
      }
    }

    return response;
  },
  (error: AxiosError) => {
    // 에러 정보 추출
    const config = error.config as any;
    const responseTime = config?.metadata?.startTime
      ? Date.now() - config.metadata.startTime
      : 0;

    console.error("❌ API Error:", {
      method: config?.method?.toUpperCase(),
      url: config?.url,
      status: error.response?.status,
      responseTime: responseTime ? `${responseTime}ms` : "N/A",
      message: error.message,
      data: error.response?.data,
    });

    // 에러 타입별 처리
    const apiError: ApiError = {
      code: "UNKNOWN_ERROR",
      message: "알 수 없는 오류가 발생했습니다.",
    };

    if (error.response) {
      // 서버 응답이 있는 경우
      const status = error.response.status;
      const data = error.response.data as any;

      switch (status) {
        case 400:
          apiError.code = "BAD_REQUEST";
          apiError.message = "잘못된 요청입니다.";
          break;
        case 401:
          apiError.code = "UNAUTHORIZED";
          apiError.message = "인증이 필요합니다.";
          break;
        case 403:
          apiError.code = "FORBIDDEN";
          apiError.message = "접근 권한이 없습니다.";
          break;
        case 404:
          apiError.code = "NOT_FOUND";
          apiError.message = "요청한 데이터를 찾을 수 없습니다.";
          break;
        case 500:
          apiError.code = "INTERNAL_SERVER_ERROR";
          apiError.message = "서버 내부 오류가 발생했습니다.";
          break;
        default:
          apiError.code = `HTTP_${status}`;
          apiError.message =
            data?.message || `HTTP ${status} 오류가 발생했습니다.`;
      }

      apiError.details = data;
    } else if (error.request) {
      // 네트워크 에러
      apiError.code = "NETWORK_ERROR";
      apiError.message = "네트워크 연결을 확인해주세요.";
    } else if (error.code === "ECONNABORTED") {
      // 타임아웃 에러
      apiError.code = "TIMEOUT_ERROR";
      apiError.message = "요청 시간이 초과되었습니다.";
    }

    return Promise.reject(apiError);
  }
);

export default apiClient;
