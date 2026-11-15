import { type NextRequest, NextResponse } from "next/server";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";

export async function GET(request: NextRequest) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const isUpstreamReady = process.env.UPSTREAM_BACKEND_READY === "true";

  if (isUpstreamReady) {
    const token = await resolveAccessToken(request);
    const res = await fetch(`${backendUrl}/api/subscriptions/my`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      cache: "no-store",
    });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { error: (payload as { message?: string }).message || "Failed to fetch subscriptions" },
        { status: res.status },
      );
    }
    const data = payload && typeof payload === "object" && "data" in payload
      ? (payload as { data: unknown }).data
      : payload;
    return NextResponse.json(data);
  }

  return NextResponse.json([
    {
      id: "sub-1",
      packageName: "باقة العائلة الذهبية",
      status: "active",
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      remainingTests: 15,
      totalTests: 24,
    },
  ]);
}
