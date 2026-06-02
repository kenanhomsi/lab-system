import { type NextRequest, NextResponse } from "next/server";
import { MOCK_VACANT_JOBS_RESPONSE } from "@/lib/api/bff-public-mock-data";

export async function GET(request: NextRequest) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const isUpstreamReady = process.env.UPSTREAM_BACKEND_READY === "true";

  if (isUpstreamReady) {
    try {
      const target = new URL(`${backendUrl}/api/vacant-jobs`);
      target.searchParams.set("page", "1");
      target.searchParams.set("pageSize", "100");
      target.searchParams.set("includeInactive", "false");
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
      const payload = (await res.json()) as Record<string, unknown>;
      const inner =
        payload.data !== null && typeof payload.data === "object"
          ? payload.data
          : payload;
      return NextResponse.json(inner);
    } catch {
      return NextResponse.json({ error: "Upstream unavailable" }, { status: 502 });
    }
  }

  return NextResponse.json(MOCK_VACANT_JOBS_RESPONSE);
}
