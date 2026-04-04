import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: Request) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const isUpstreamReady = process.env.UPSTREAM_BACKEND_READY === "true";

  try {
    const json = await request.json();

    if (isUpstreamReady) {
      const res = await fetch(`${backendUrl}/store/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        return NextResponse.json(
          { error: (body as { message?: string }).message || "Order placement failed" },
          { status: res.status },
        );
      }
      return NextResponse.json(body, { status: 201 });
    }

    return NextResponse.json(
      {
        ok: true,
        orderId: `mock-store-order-${Date.now()}`,
        createdAt: new Date().toISOString(),
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const isUpstreamReady = process.env.UPSTREAM_BACKEND_READY === "true";

  if (isUpstreamReady) {
    try {
      const target = new URL(`${backendUrl}/store/orders`);
      request.nextUrl.searchParams.forEach((value, key) => {
        target.searchParams.set(key, value);
      });
      const res = await fetch(target.toString(), { cache: "no-store" });
      if (!res.ok) {
        return NextResponse.json({ error: "Upstream request failed" }, { status: res.status });
      }
      return NextResponse.json(await res.json());
    } catch {
      return NextResponse.json({ error: "Upstream unavailable" }, { status: 502 });
    }
  }

  return NextResponse.json({
    orders: [
      {
        id: "so-001",
        date: "2026-04-01",
        status: "delivered",
        total: 13500,
        itemCount: 3,
      },
      {
        id: "so-002",
        date: "2026-04-03",
        status: "processing",
        total: 8700,
        itemCount: 2,
      },
      {
        id: "so-003",
        date: "2026-04-04",
        status: "pending",
        total: 4500,
        itemCount: 1,
      },
    ],
  });
}
