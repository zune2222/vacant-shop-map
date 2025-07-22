interface ApiErrorStateProps {
  title?: string;
  message?: string;
  errorCode?: string | number;
  onRetry?: () => void;
  showDetails?: boolean;
  className?: string;
  size?: "small" | "medium" | "large";
}

export default function ApiErrorState({
  title = "데이터 로딩 실패",
  message = "데이터를 불러오는 중 오류가 발생했습니다.",
  errorCode,
  onRetry,
  showDetails = false,
  className = "",
  size = "medium",
}: ApiErrorStateProps) {
  const sizeClasses = {
    small: {
      container: "p-3",
      icon: "w-8 h-8",
      title: "text-sm font-medium",
      message: "text-xs",
      button: "px-3 py-1 text-sm",
    },
    medium: {
      container: "p-4",
      icon: "w-12 h-12",
      title: "text-lg font-semibold",
      message: "text-sm",
      button: "px-4 py-2",
    },
    large: {
      container: "p-6",
      icon: "w-16 h-16",
      title: "text-xl font-bold",
      message: "text-base",
      button: "px-6 py-3 text-lg",
    },
  };

  const classes = sizeClasses[size];

  return (
    <div className={`text-center ${classes.container} ${className}`}>
      {/* 에러 아이콘 */}
      <div className="flex justify-center mb-4">
        <svg
          className={`${classes.icon} mx-auto text-red-500`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      {/* 제목 */}
      <h3 className={`${classes.title} text-gray-900 mb-2`}>{title}</h3>

      {/* 메시지 */}
      <p className={`${classes.message} text-gray-600 mb-4`}>{message}</p>

      {/* 에러 코드 */}
      {errorCode && (
        <div className="mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            오류 코드: {errorCode}
          </span>
        </div>
      )}

      {/* 재시도 버튼 */}
      {onRetry && (
        <button
          onClick={onRetry}
          className={`
            ${classes.button}
            bg-blue-500 text-white rounded-lg font-medium
            hover:bg-blue-600 active:bg-blue-700
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          `}
        >
          다시 시도
        </button>
      )}

      {/* 상세 정보 (개발 환경) */}
      {showDetails && process.env.NODE_ENV === "development" && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-left">
          <details>
            <summary className="cursor-pointer text-sm font-medium text-gray-700">
              개발자 정보
            </summary>
            <div className="mt-2 text-xs text-gray-600">
              <div>
                <strong>시간:</strong> {new Date().toLocaleString()}
              </div>
              <div>
                <strong>URL:</strong>{" "}
                {typeof window !== "undefined" ? window.location.href : "N/A"}
              </div>
              {errorCode && (
                <div>
                  <strong>코드:</strong> {errorCode}
                </div>
              )}
            </div>
          </details>
        </div>
      )}
    </div>
  );
}

/**
 * 네트워크 연결 에러 전용 컴포넌트
 */
export function NetworkErrorState({
  onRetry,
  className = "",
}: Pick<ApiErrorStateProps, "onRetry" | "className">) {
  return (
    <ApiErrorState
      title="연결 실패"
      message="네트워크 연결을 확인하고 다시 시도해주세요."
      onRetry={onRetry}
      className={className}
      size="medium"
    />
  );
}

/**
 * 서버 에러 전용 컴포넌트
 */
export function ServerErrorState({
  onRetry,
  errorCode,
  className = "",
}: Pick<ApiErrorStateProps, "onRetry" | "errorCode" | "className">) {
  return (
    <ApiErrorState
      title="서버 오류"
      message="서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
      errorCode={errorCode}
      onRetry={onRetry}
      className={className}
      size="medium"
    />
  );
}

/**
 * 권한 없음 에러 전용 컴포넌트
 */
export function UnauthorizedErrorState({
  className = "",
}: Pick<ApiErrorStateProps, "className">) {
  return (
    <ApiErrorState
      title="접근 권한 없음"
      message="이 데이터에 접근할 권한이 없습니다."
      errorCode="401"
      className={className}
      size="medium"
    />
  );
}

/**
 * 데이터 없음 상태 (에러는 아니지만 관련 컴포넌트)
 */
export function NoDataState({
  title = "데이터 없음",
  message = "표시할 데이터가 없습니다.",
  className = "",
}: Pick<ApiErrorStateProps, "title" | "message" | "className">) {
  return (
    <div className={`text-center p-6 ${className}`}>
      {/* 빈 데이터 아이콘 */}
      <div className="flex justify-center mb-4">
        <svg
          className="w-16 h-16 mx-auto text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>

      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>

      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}
