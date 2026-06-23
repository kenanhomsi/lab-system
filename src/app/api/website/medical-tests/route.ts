import { type NextRequest, NextResponse } from "next/server";
import {
  emptyMedicalTestsResponse,
  fetchUpstreamMedicalTestsList,
  parsePublicMedicalTestsList,
} from "@/lib/api/public-medical-tests";

export async function GET(req: NextRequest) {
  const page = Math.max(
    1,
    Number(req.nextUrl.searchParams.get("Page") ?? req.nextUrl.searchParams.get("page") ?? 1),
  );
  const pageSize = Math.min(
    100,
    Math.max(
      1,
      Number(req.nextUrl.searchParams.get("PageSize") ?? req.nextUrl.searchParams.get("pageSize") ?? 24),
    ),
  );
  const search =
    req.nextUrl.searchParams.get("Search") ??
    req.nextUrl.searchParams.get("search") ??
    "";

  const upstream = await fetchUpstreamMedicalTestsList({
    Page: String(page),
    PageSize: String(pageSize),
    ...(search.trim() ? { Search: search.trim() } : {}),
  });

  if (!upstream.ok) {
    return NextResponse.json(
      {
        ...emptyMedicalTestsResponse(pageSize),
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

  const list = parsePublicMedicalTestsList(upstream.payload, { pageNumber: page, pageSize });
  return NextResponse.json(list);
}
