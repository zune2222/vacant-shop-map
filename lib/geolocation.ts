/**
 * 지오로케이션 에러 타입
 */
export enum GeolocationErrorType {
  PERMISSION_DENIED = "PERMISSION_DENIED",
  POSITION_UNAVAILABLE = "POSITION_UNAVAILABLE",
  TIMEOUT = "TIMEOUT",
  NOT_SUPPORTED = "NOT_SUPPORTED",
}

/**
 * 지오로케이션 에러 클래스
 */
export class GeolocationError extends Error {
  constructor(
    public type: GeolocationErrorType,
    message: string,
    public code?: number
  ) {
    super(message);
    this.name = "GeolocationError";
  }
}

/**
 * 지오로케이션 옵션 인터페이스
 */
export interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

/**
 * 기본 지오로케이션 설정
 */
export const DEFAULT_GEOLOCATION_OPTIONS: GeolocationOptions = {
  enableHighAccuracy: true, // 높은 정확도 사용 (GPS)
  timeout: 10000, // 10초 타임아웃
  maximumAge: 60000, // 1분간 캐시된 위치 정보 허용
};

/**
 * 지오로케이션 지원 여부 확인
 */
export const isGeolocationSupported = (): boolean => {
  return typeof navigator !== "undefined" && "geolocation" in navigator;
};

/**
 * 지오로케이션 권한 상태 확인 (지원되는 브라우저에서만)
 */
export const checkGeolocationPermission = async (): Promise<
  PermissionState | "unsupported"
> => {
  if (typeof navigator === "undefined" || !navigator.permissions) {
    return "unsupported";
  }

  try {
    const permission = await navigator.permissions.query({
      name: "geolocation",
    });
    return permission.state;
  } catch {
    return "unsupported";
  }
};

/**
 * 사용자의 현재 위치 가져오기
 */
export const getCurrentPosition = (
  options: GeolocationOptions = DEFAULT_GEOLOCATION_OPTIONS
): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    // 브라우저 지원 확인
    if (!isGeolocationSupported()) {
      reject(
        new GeolocationError(
          GeolocationErrorType.NOT_SUPPORTED,
          "이 브라우저는 위치 서비스를 지원하지 않습니다."
        )
      );
      return;
    }

    // 위치 정보 요청
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("📍 현재 위치 획득:", {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        resolve(position);
      },
      (error) => {
        console.error("❌ 위치 정보 획득 실패:", error);

        let errorType: GeolocationErrorType;
        let message: string;

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorType = GeolocationErrorType.PERMISSION_DENIED;
            message =
              "위치 정보 접근이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorType = GeolocationErrorType.POSITION_UNAVAILABLE;
            message =
              "위치 정보를 사용할 수 없습니다. GPS나 네트워크 연결을 확인해주세요.";
            break;
          case error.TIMEOUT:
            errorType = GeolocationErrorType.TIMEOUT;
            message =
              "위치 정보 요청이 시간 초과되었습니다. 다시 시도해주세요.";
            break;
          default:
            errorType = GeolocationErrorType.POSITION_UNAVAILABLE;
            message = "위치 정보를 가져올 수 없습니다.";
        }

        reject(new GeolocationError(errorType, message, error.code));
      },
      options
    );
  });
};

/**
 * 위치 변화 감지 (실시간 위치 추적)
 */
export const watchPosition = (
  successCallback: (position: GeolocationPosition) => void,
  errorCallback: (error: GeolocationError) => void,
  options: GeolocationOptions = DEFAULT_GEOLOCATION_OPTIONS
): number | null => {
  if (!isGeolocationSupported()) {
    errorCallback(
      new GeolocationError(
        GeolocationErrorType.NOT_SUPPORTED,
        "이 브라우저는 위치 서비스를 지원하지 않습니다."
      )
    );
    return null;
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      console.log("📍 위치 업데이트:", {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date(position.timestamp).toISOString(),
      });
      successCallback(position);
    },
    (error) => {
      console.error("❌ 위치 추적 실패:", error);

      let errorType: GeolocationErrorType;
      let message: string;

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorType = GeolocationErrorType.PERMISSION_DENIED;
          message = "위치 정보 접근이 거부되었습니다.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorType = GeolocationErrorType.POSITION_UNAVAILABLE;
          message = "위치 정보를 사용할 수 없습니다.";
          break;
        case error.TIMEOUT:
          errorType = GeolocationErrorType.TIMEOUT;
          message = "위치 정보 요청이 시간 초과되었습니다.";
          break;
        default:
          errorType = GeolocationErrorType.POSITION_UNAVAILABLE;
          message = "위치 정보를 가져올 수 없습니다.";
      }

      errorCallback(new GeolocationError(errorType, message, error.code));
    },
    options
  );
};

/**
 * 위치 추적 중단
 */
export const clearWatch = (watchId: number): void => {
  if (isGeolocationSupported()) {
    navigator.geolocation.clearWatch(watchId);
    console.log("📍 위치 추적 중단:", watchId);
  }
};

/**
 * 두 지점 간의 거리 계산 (Haversine 공식)
 */
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // 지구 반지름 (km)
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * 도를 라디안으로 변환
 */
const toRad = (value: number): number => {
  return (value * Math.PI) / 180;
};

/**
 * 위치 정확도 수준 확인
 */
export const getAccuracyLevel = (
  accuracy: number
): "high" | "medium" | "low" => {
  if (accuracy <= 10) return "high";
  if (accuracy <= 100) return "medium";
  return "low";
};

/**
 * 위치 정보 포맷팅
 */
export const formatPosition = (position: GeolocationPosition): string => {
  const { latitude, longitude, accuracy } = position.coords;
  const accuracyLevel = getAccuracyLevel(accuracy);

  return `위도: ${latitude.toFixed(6)}, 경도: ${longitude.toFixed(
    6
  )} (정확도: ${accuracy}m - ${accuracyLevel})`;
};
