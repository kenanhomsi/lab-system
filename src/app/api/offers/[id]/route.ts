import { NextResponse } from "next/server";
import { getMockOfferById } from "@/lib/api/bff-public-mock-data";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const isUpstreamReady = process.env.UPSTREAM_BACKEND_READY === "true";
  const { id } = await context.params;

  if (isUpstreamReady) {
    try {
      const res = await fetch(`${backendUrl}/offers/${encodeURIComponent(id)}`, {
        cache: "no-store",
      });
      if (res.status === 404) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      if (!res.ok) {
        return NextResponse.json(
          { error: "Upstream request failed" },
          { status: res.status },
        );
      }
      return NextResponse.json(await res.json());
    } catch {
      return NextResponse.json({ error: "Upstream unavailable" }, { status: 502 });
    }
  }

  const offer = getMockOfferById(id);
  if (!offer) {
    return NextResponse.json({ error: "Offer not found" }, { status: 404 });
  }
  return NextResponse.json(offer);
}
