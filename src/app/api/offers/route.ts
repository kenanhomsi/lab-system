import { type NextRequest, NextResponse } from "next/server";
import { MOCK_OFFERS } from "@/lib/api/bff-public-mock-data";
import { mapMockOffersToList } from "@/lib/api/offers-map";
import { fetchUpstreamGet } from "@/lib/api/bff-proxy";

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale") ?? "en";
  const upstream = await fetchUpstreamGet(request, "/offers", {
    omitRequestParams: ["locale"],
  });

  if (upstream.ok) {
    const res = upstream.response;
    if (!res.ok) {
      return NextResponse.json(
        { error: "Upstream request failed" },
        { status: res.status },
      );
    }
    return NextResponse.json(await res.json());
  }

  if (upstream.reason === "network") {
    return NextResponse.json({ error: "Upstream unavailable" }, { status: 502 });
  }

  return NextResponse.json(mapMockOffersToList(MOCK_OFFERS, locale));
}
