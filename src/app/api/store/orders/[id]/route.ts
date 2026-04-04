import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const isUpstreamReady = process.env.UPSTREAM_BACKEND_READY === "true";

  if (isUpstreamReady) {
    try {
      const res = await fetch(`${backendUrl}/store/orders/${id}`, { cache: "no-store" });
      if (!res.ok) {
        return NextResponse.json({ error: "Upstream request failed" }, { status: res.status });
      }
      return NextResponse.json(await res.json());
    } catch {
      return NextResponse.json({ error: "Upstream unavailable" }, { status: 502 });
    }
  }

  return NextResponse.json({
    id,
    date: "2026-04-03",
    status: "processing",
    total: 8700,
    deliveryFee: 500,
    subtotal: 8200,
    paymentMethod: "cash_on_delivery",
    items: [
      {
        productId: "prod-001",
        name: "EDTA Vacutainer Tubes (100 pcs)",
        nameAr: "أنابيب سحب دم EDTA (100 قطعة)",
        quantity: 1,
        unitPrice: 4500,
        total: 4050,
        discount: 10,
      },
      {
        productId: "prod-003",
        name: "Latex Examination Gloves (M)",
        nameAr: "قفازات فحص لاتكس (وسط)",
        quantity: 1,
        unitPrice: 3800,
        total: 3610,
        discount: 5,
      },
    ],
    tracking: [
      { status: "pending", date: "2026-04-03T10:00:00Z", label: "Order placed" },
      { status: "confirmed", date: "2026-04-03T10:30:00Z", label: "Order confirmed" },
      { status: "processing", date: "2026-04-03T14:00:00Z", label: "Preparing your order" },
    ],
  });
}
