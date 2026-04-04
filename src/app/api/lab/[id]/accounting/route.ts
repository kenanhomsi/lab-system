import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const isUpstreamReady = process.env.UPSTREAM_BACKEND_READY === "true";

  if (isUpstreamReady) {
    try {
      const target = new URL(`${backendUrl}/lab/${id}/accounting`);
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
    entries: [
      {
        id: "acc-001",
        patientName: "Ahmad Hassan",
        tests: ["CBC", "FBS"],
        pricePerTest: [85, 50],
        totalPrice: 135,
        payments: 135,
      },
      {
        id: "acc-002",
        patientName: "Fatima Ali",
        tests: ["TSH", "T3", "T4"],
        pricePerTest: [120, 100, 100],
        totalPrice: 320,
        payments: 200,
      },
      {
        id: "acc-003",
        patientName: "Omar Khalid",
        tests: ["CBC", "CRP", "ESR"],
        pricePerTest: [85, 75, 60],
        totalPrice: 220,
        payments: 220,
      },
      {
        id: "acc-004",
        patientName: "Sara Mohammed",
        tests: ["Vitamin D"],
        pricePerTest: [150],
        totalPrice: 150,
        payments: 0,
      },
    ],
    summary: {
      totalTestsAmount: 825,
      totalPayments: 555,
      balanceDue: 270,
    },
  });
}
