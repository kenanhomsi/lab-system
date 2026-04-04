import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const isUpstreamReady = process.env.UPSTREAM_BACKEND_READY === "true";

  try {
    const json = await request.json();

    if (isUpstreamReady) {
      const res = await fetch(`${backendUrl}/store/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        return NextResponse.json(
          { error: (body as { message?: string }).message || "Cart update failed" },
          { status: res.status },
        );
      }
      return NextResponse.json(body);
    }

    return NextResponse.json({ ok: true, updatedAt: new Date().toISOString() });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
