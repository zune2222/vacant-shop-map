import { NextRequest, NextResponse } from "next/server";
import { SAMPLE_VACANT_SHOPS, filterVacantShops } from "@/lib/sampleData";
import { MapFilter } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // 쿼리 파라미터에서 필터 옵션 추출
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const sortBy = searchParams.get("sortBy") as
      | "rent"
      | "area"
      | "createdAt"
      | null;
    const sortOrder =
      (searchParams.get("sortOrder") as "asc" | "desc") || "asc";

    // 필터 파라미터 처리
    const filter: MapFilter = {
      rentRange: [
        parseInt(searchParams.get("rentMin") || "0"),
        parseInt(searchParams.get("rentMax") || "1000"),
      ],
      areaRange: [
        parseInt(searchParams.get("areaMin") || "0"),
        parseInt(searchParams.get("areaMax") || "100"),
      ],
      shopTypes: (searchParams.get("shopTypes")?.split(",") as any) || [
        "restaurant",
        "retail",
        "office",
        "etc",
      ],
      region: searchParams.get("region") || undefined,
    };

    // 데이터 필터링
    let shops = filterVacantShops(SAMPLE_VACANT_SHOPS, filter);

    // 정렬 적용
    if (sortBy) {
      shops.sort((a, b) => {
        let aVal: any, bVal: any;

        switch (sortBy) {
          case "rent":
            aVal = a.monthlyRent;
            bVal = b.monthlyRent;
            break;
          case "area":
            aVal = a.area;
            bVal = b.area;
            break;
          case "createdAt":
            aVal = a.createdAt.getTime();
            bVal = b.createdAt.getTime();
            break;
          default:
            return 0;
        }

        if (sortOrder === "desc") {
          return aVal < bVal ? 1 : -1;
        }
        return aVal > bVal ? 1 : -1;
      });
    }

    // 페이지네이션 적용
    const paginatedShops = shops.slice(offset, offset + limit);

    // API 응답 형태로 반환
    const response = {
      success: true,
      data: {
        items: paginatedShops,
        total: shops.length,
        limit,
        offset,
        hasMore: offset + limit < shops.length,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("API Error in /api/shops:", error);

    return NextResponse.json(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "공실 상가 데이터를 불러오는데 실패했습니다.",
      },
      { status: 500 }
    );
  }
}
