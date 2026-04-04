import { NextResponse } from "next/server";

export async function GET() {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const isUpstreamReady = process.env.UPSTREAM_BACKEND_READY === "true";

  if (isUpstreamReady) {
    const res = await fetch(`${backendUrl}/subscriptions/my`);
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { error: (payload as { message?: string }).message || "Failed to fetch subscriptions" },
        { status: res.status },
      );
    }
    return NextResponse.json(payload);
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
