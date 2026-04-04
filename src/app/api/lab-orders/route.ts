import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const isUpstreamReady = process.env.UPSTREAM_BACKEND_READY === "true";

  try {
    const json = await request.json();

    if (isUpstreamReady) {
      const res = await fetch(`${backendUrl}/lab-orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        return NextResponse.json(
          { error: (body as { message?: string }).message || "Lab order creation failed" },
          { status: res.status },
        );
      }
      return NextResponse.json(body, { status: 201 });
    }

    return NextResponse.json(
      {
        ok: true,
        id: `mock-lab-order-${Date.now()}`,
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
      const target = new URL(`${backendUrl}/lab-orders`);
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
        id: "lo-001",
        date: new Date().toISOString().split("T")[0],
        patients: [
          {
            name: "Ahmad Hassan",
            age: 35,
            gender: "male",
            tests: [
              { id: "test-cbc-001", nameEn: "CBC", nameAr: "تعداد الدم الكامل", price: 85, sample: "Venous blood" },
              { id: "test-fbs-002", nameEn: "FBS", nameAr: "سكر الدم الصيامي", price: 50, sample: "Venous blood" },
            ],
          },
        ],
      },
      {
        id: "lo-002",
        date: new Date().toISOString().split("T")[0],
        patients: [
          {
            name: "Fatima Ali",
            age: 28,
            gender: "female",
            tests: [
              { id: "test-tsh-003", nameEn: "TSH", nameAr: "هرمون الغدة الدرقية", price: 120, sample: "Venous blood" },
            ],
          },
        ],
      },
    ],
  });
}
