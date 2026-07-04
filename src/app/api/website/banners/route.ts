import { type NextRequest, NextResponse } from "next/server";
import { fetchUpstreamGet } from "@/lib/api/bff-proxy";
import { normalizePublicBannerPayload } from "@/lib/banners/public-banner-payload";

const PUBLIC_CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300",
};

export async function GET(request: NextRequest) {
  const upstream = await fetchUpstreamGet(request, "/api/website/banners");

  if (upstream.ok) {
    const res = upstream.response;
    if (!res.ok) {
      return NextResponse.json([], { headers: PUBLIC_CACHE_HEADERS });
    }
    const payload: unknown = await res.json().catch(() => []);
    return NextResponse.json(normalizePublicBannerPayload(payload), {
      headers: PUBLIC_CACHE_HEADERS,
    });
  }

  return NextResponse.json([], { headers: PUBLIC_CACHE_HEADERS });
}
