import { type NextRequest, NextResponse } from "next/server";
import { fetchUpstreamGet } from "@/lib/api/bff-proxy";
import { normalizePublicBannerPayload } from "@/lib/banners/public-banner-payload";

export async function GET(request: NextRequest) {
  const upstream = await fetchUpstreamGet(request, "/api/website/banners");

  if (upstream.ok) {
    const res = upstream.response;
    if (!res.ok) {
      return NextResponse.json([]);
    }
    const payload: unknown = await res.json().catch(() => []);
    return NextResponse.json(normalizePublicBannerPayload(payload));
  }

  return NextResponse.json([]);
}
