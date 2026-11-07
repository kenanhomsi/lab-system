import { type NextRequest, NextResponse } from "next/server";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";

export async function GET(request: NextRequest) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const isUpstreamReady = process.env.UPSTREAM_BACKEND_READY === "true";

  if (isUpstreamReady) {
    const token = await resolveAccessToken(request);
    const res = await fetch(`${backendUrl}/api/addresses`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      cache: "no-store",
    });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { error: (payload as { message?: string }).message || "Failed to fetch addresses" },
        { status: res.status },
      );
    }
    const data = payload && typeof payload === "object" && "data" in payload
      ? (payload as { data: unknown }).data
      : payload;
    return NextResponse.json(data);
  }

  return NextResponse.json([
    { id: "addr-1", label: "المنزل", address: "دمشق، المزة، شارع الجلاء", lat: 33.513, lng: 36.276 },
    { id: "addr-2", label: "العمل", address: "دمشق، المالكي، بناء 12", lat: 33.518, lng: 36.285 },
    { id: "addr-3", label: "المختبر", address: "دمشق، أبو رمانة، بجانب مشفى الشامي", lat: 33.511, lng: 36.282 },
  ]);
}

export async function POST(request: NextRequest) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const token = await resolveAccessToken(request);
  const body = await request.json();
  const res = await fetch(`${backendUrl}/api/addresses`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const payload = await res.json().catch(() => ({}));
  return NextResponse.json(payload, { status: res.status });
}
