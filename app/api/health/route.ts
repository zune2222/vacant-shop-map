import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 기본 헬스체크 정보
    const healthInfo = {
      success: true,
      data: {
        status: "healthy",
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || "0.1.0",
        environment: process.env.NODE_ENV || "development",
        uptime: process.uptime(),
        services: {
          api: "healthy",
          database: "mocked", // 실제 DB 연결시 상태 확인 로직 추가
          maps: "healthy",
        },
      },
    };

    return NextResponse.json(healthInfo);
  } catch (error) {
    console.error("Health check error:", error);

    return NextResponse.json(
      {
        success: false,
        data: {
          status: "unhealthy",
          timestamp: new Date().toISOString(),
          error: "서비스 상태 확인에 실패했습니다.",
        },
      },
      { status: 500 }
    );
  }
}
