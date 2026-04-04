import { NextResponse } from "next/server";

export async function GET() {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const isUpstreamReady = process.env.UPSTREAM_BACKEND_READY === "true";

  if (isUpstreamReady) {
    try {
      const res = await fetch(`${backendUrl}/banners/active`);
      if (!res.ok) return new NextResponse(null, { status: 204 });
      const data = await res.json();
      return NextResponse.json(data);
    } catch {
      return new NextResponse(null, { status: 204 });
    }
  }

  return new NextResponse(null, { status: 204 });
}
