"use client";

import { Component, ErrorInfo, ReactNode } from "react";

/**
 * ErrorBoundary Props 인터페이스
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  isolate?: boolean; // 에러를 격리하여 전체 앱 크래시 방지
}

/**
 * ErrorBoundary State 인터페이스
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

/**
 * React ErrorBoundary 컴포넌트
 * 자식 컴포넌트에서 발생하는 JavaScript 에러를 포착하고 폴백 UI를 표시
 */
export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  /**
   * 에러 발생시 상태 업데이트
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = `error_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    return {
      hasError: true,
      error,
      errorId,
    };
  }

  /**
   * 에러 정보 수집 및 로깅
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.group("🚨 ErrorBoundary에서 에러 포착");
    console.error("Error:", error);
    console.error("Component Stack:", errorInfo.componentStack);
    console.error("Error Boundary Props:", this.props);
    console.groupEnd();

    // 에러 정보를 상태에 저장
    this.setState({
      errorInfo,
    });

    // 외부 에러 핸들러 실행
    this.props.onError?.(error, errorInfo);

    // 프로덕션에서는 에러 리포팅 서비스로 전송
    if (process.env.NODE_ENV === "production") {
      this.reportError(error, errorInfo);
    }
  }

  /**
   * 에러 리포팅 서비스로 전송 (프로덕션)
   */
  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    try {
      // 여기에 Sentry, LogRocket 등의 에러 리포팅 서비스 연동
      console.log("📊 에러 리포팅 서비스로 전송:", {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        errorId: this.state.errorId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      });
    } catch (reportingError) {
      console.error("에러 리포팅 실패:", reportingError);
    }
  };

  /**
   * 에러 상태 리셋 및 재시도
   */
  private handleRetry = () => {
    console.log("🔄 ErrorBoundary 재시도");

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });
  };

  /**
   * 페이지 새로고침
   */
  private handleReload = () => {
    console.log("🔄 페이지 새로고침");
    window.location.reload();
  };

  /**
   * 에러 세부 정보 토글
   */
  private toggleErrorDetails = () => {
    const errorDetails = document.getElementById("error-details");
    if (errorDetails) {
      errorDetails.style.display =
        errorDetails.style.display === "none" ? "block" : "none";
    }
  };

  render() {
    if (this.state.hasError) {
      // 사용자 정의 폴백 UI가 제공된 경우
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 기본 에러 UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            {/* 에러 아이콘 */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
            </div>

            {/* 에러 메시지 */}
            <h2 className="text-xl font-bold text-center text-gray-900 mb-2">
              앗! 문제가 발생했습니다
            </h2>

            <p className="text-gray-600 text-center mb-6">
              예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
            </p>

            {/* 개발 환경에서만 에러 상세 정보 표시 */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  개발 정보:
                </div>
                <div className="text-xs text-red-600 font-mono break-all">
                  {this.state.error.message}
                </div>
                <button
                  onClick={this.toggleErrorDetails}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                >
                  상세 정보 보기
                </button>
                <div
                  id="error-details"
                  style={{ display: "none" }}
                  className="mt-2"
                >
                  <pre className="text-xs text-gray-600 whitespace-pre-wrap max-h-40 overflow-y-auto">
                    {this.state.error.stack}
                  </pre>
                </div>
              </div>
            )}

            {/* 액션 버튼들 */}
            <div className="flex flex-col space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                다시 시도
              </button>

              <button
                onClick={this.handleReload}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                페이지 새로고침
              </button>

              <button
                onClick={() => window.history.back()}
                className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-200"
              >
                이전 페이지로
              </button>
            </div>

            {/* 에러 ID (고객 지원용) */}
            {this.state.errorId && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  에러 ID: {this.state.errorId}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * 특정 컴포넌트에 대한 간단한 에러 래퍼
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback} onError={onError} isolate>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
}
