import { NextResponse } from "next/server";

export async function GET() {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const isUpstreamReady = process.env.UPSTREAM_BACKEND_READY === "true";

  if (isUpstreamReady) {
    const res = await fetch(`${backendUrl}/addresses`);
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { error: (payload as { message?: string }).message || "Failed to fetch addresses" },
        { status: res.status },
      );
    }
    return NextResponse.json(payload);
  }

  return NextResponse.json([
    { id: "addr-1", label: "المنزل", address: "دمشق، المزة، شارع الجلاء", lat: 33.513, lng: 36.276 },
    { id: "addr-2", label: "العمل", address: "دمشق، المالكي، بناء 12", lat: 33.518, lng: 36.285 },
    { id: "addr-3", label: "المختبر", address: "دمشق، أبو رمانة، بجانب مشفى الشامي", lat: 33.511, lng: 36.282 },
  ]);
}
