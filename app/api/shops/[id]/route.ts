import { NextRequest, NextResponse } from "next/server";
import { SAMPLE_VACANT_SHOPS } from "@/lib/sampleData";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const shopId = params.id;

    // Mock 데이터에서 해당 ID의 상가 찾기
    const shop = SAMPLE_VACANT_SHOPS.find((s) => s.id === shopId);

    if (!shop) {
      return NextResponse.json(
        {
          success: false,
          error: "NOT_FOUND",
          message: "해당 상가를 찾을 수 없습니다.",
        },
        { status: 404 }
      );
    }

    // API 응답 형태로 반환
    const response = {
      success: true,
      data: shop,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(`API Error in /api/shops/${params?.id}:`, error);

    return NextResponse.json(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "상가 정보를 불러오는데 실패했습니다.",
      },
      { status: 500 }
    );
  }
}
