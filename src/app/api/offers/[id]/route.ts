import { type NextRequest, NextResponse } from "next/server";
import { fetchUpstreamGet } from "@/lib/api/bff-proxy";
import { getMockOfferById } from "@/lib/api/bff-public-mock-data";
import { mapMockOfferToDetail } from "@/lib/api/offers-map";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const locale = request.nextUrl.searchParams.get("locale") ?? "en";
  const encoded = encodeURIComponent(id);
  const upstream = await fetchUpstreamGet(request, `/api/offers/${encoded}`, {
    omitRequestParams: ["locale"],
  });

  if (upstream.ok) {
    const res = upstream.response;
    if (res.status === 404) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (!res.ok) {
      return NextResponse.json(
        { error: "Upstream request failed" },
        { status: res.status },
      );
    }
    const payload = await res.json();
    const data = payload && typeof payload === "object" && "data" in payload
      ? (payload as { data: unknown }).data
      : payload;
    return NextResponse.json(data);
  }

  if (upstream.reason === "network") {
    return NextResponse.json({ error: "Upstream unavailable" }, { status: 502 });
  }

  const mock = getMockOfferById(id);
  if (!mock) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(mapMockOfferToDetail(mock, locale));
}
