import { type NextRequest, NextResponse } from "next/server";
import { filterMockTests } from "@/lib/api/bff-public-mock-data";
import { unwrapUpstreamPayload } from "@/lib/api/unwrap-upstream-payload";

export async function GET(request: NextRequest) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const isUpstreamReady = process.env.UPSTREAM_BACKEND_READY === "true";

  if (isUpstreamReady) {
    try {
      const target = new URL(`${backendUrl}/api/medical-tests`);
      request.nextUrl.searchParams.forEach((value, key) => {
        target.searchParams.set(key, value);
      });
      const res = await fetch(target.toString(), { cache: "no-store" });
      if (!res.ok) {
        return NextResponse.json(
          { error: "Upstream request failed" },
          { status: res.status },
        );
      }
      const payload = unwrapUpstreamPayload(await res.json()) as { items?: unknown };
      return NextResponse.json(Array.isArray(payload) ? payload : payload.items ?? []);
    } catch {
      return NextResponse.json({ error: "Upstream unavailable" }, { status: 502 });
    }
  }

  const search = request.nextUrl.searchParams.get("search");
  const category = request.nextUrl.searchParams.get("category");
  return NextResponse.json(filterMockTests(search, category));
}
