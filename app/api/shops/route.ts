import { NextRequest, NextResponse } from "next/server";
import { ENHANCED_SAMPLE_SHOPS } from "@/lib/enhancedSampleData";
import { MapFilter, EnhancedVacantShop, ShopType } from "@/types";

// 동적 라우트 설정 (searchParams 사용으로 인한 prerender 에러 해결)
export const dynamic = "force-dynamic";

/**
 * 확장된 공실 상가 데이터 필터링
 */
function filterEnhancedVacantShops(
  shops: EnhancedVacantShop[],
  filter: MapFilter
): EnhancedVacantShop[] {
  return shops.filter((shop) => {
    // 임대료 범위 필터
    if (
      shop.monthlyRent < filter.rentRange[0] * 10000 ||
      shop.monthlyRent > filter.rentRange[1] * 10000
    ) {
      return false;
    }

    // 면적 범위 필터
    if (shop.area < filter.areaRange[0] || shop.area > filter.areaRange[1]) {
      return false;
    }

    // 상가 유형 필터
    if (!filter.shopTypes.includes(shop.shopType as any)) {
      return false;
    }

    return true;
  });
}

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
      shopTypes: (searchParams.get("shopTypes")?.split(",") as ShopType[]) || [
        "korean_restaurant",
        "chinese_restaurant", 
        "japanese_restaurant",
        "western_restaurant",
        "fastfood",
        "cafe",
        "bakery",
        "chicken",
        "pizza",
        "pub",
        "convenience_store",
        "clothing",
        "cosmetics",
        "electronics",
        "pharmacy",
        "supermarket",
        "bookstore",
        "toy_store",
        "flower_shop",
        "hair_salon",
        "nail_salon",
        "fitness",
        "laundry",
        "repair_shop",
        "real_estate",
        "insurance",
        "bank",
        "clinic",
        "office",
        "coworking",
        "academy",
        "consulting",
        "etc"
      ],
      region: searchParams.get("region") || undefined,
    };

    // 데이터 필터링
    let shops = filterEnhancedVacantShops(ENHANCED_SAMPLE_SHOPS, filter);

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
