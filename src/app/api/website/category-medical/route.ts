import { type NextRequest, NextResponse } from "next/server";
import {
  emptyMedicalTestCategoriesResponse,
  fetchUpstreamMedicalTestCategoriesList,
  parsePublicMedicalTestCategoriesList,
} from "@/lib/api/public-medical-test-categories";

export async function GET(req: NextRequest) {
  const page = Math.max(
    1,
    Number(req.nextUrl.searchParams.get("Page") ?? req.nextUrl.searchParams.get("page") ?? 1),
  );
  const pageSize = Math.min(
    100,
    Math.max(
      1,
      Number(
        req.nextUrl.searchParams.get("PageSize") ??
          req.nextUrl.searchParams.get("pageSize") ??
          50,
      ),
    ),
  );
  const search =
    req.nextUrl.searchParams.get("Search") ?? req.nextUrl.searchParams.get("search") ?? "";
  const activeOnly = req.nextUrl.searchParams.get("activeOnly");

  const upstream = await fetchUpstreamMedicalTestCategoriesList({
    Page: String(page),
    PageSize: String(pageSize),
    SortBy: "displayOrder",
    SortDesc: "false",
    activeOnly: activeOnly ?? "true",
    ...(search.trim() ? { Search: search.trim() } : {}),
  });

  if (!upstream.ok) {
    return NextResponse.json(
      {
        ...emptyMedicalTestCategoriesResponse(pageSize),
        error:
          upstream.status === 401
            ? "upstream_unauthorized"
            : upstream.reason === "disabled"
              ? "upstream_disabled"
              : "upstream_unavailable",
      },
      { status: upstream.status === 401 ? 503 : upstream.status },
    );
  }

  const list = parsePublicMedicalTestCategoriesList(upstream.payload, {
    pageNumber: page,
    pageSize,
  });
  return NextResponse.json(list);
}
