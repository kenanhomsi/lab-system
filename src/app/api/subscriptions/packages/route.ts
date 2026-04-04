import { NextResponse } from "next/server";

export async function GET() {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const isUpstreamReady = process.env.UPSTREAM_BACKEND_READY === "true";

  if (isUpstreamReady) {
    const res = await fetch(`${backendUrl}/subscriptions/packages`);
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { error: (payload as { message?: string }).message || "Failed to fetch packages" },
        { status: res.status },
      );
    }
    return NextResponse.json(payload);
  }

  return NextResponse.json([
    {
      id: "pkg-1",
      name: "الباقة الفضية",
      price: 150000,
      currency: "SYP",
      testsIncluded: 12,
      duration: "6 أشهر",
      features: ["تحاليل دم شاملة", "فحص سكر", "فحص غدة درقية"],
    },
    {
      id: "pkg-2",
      name: "الباقة الذهبية",
      price: 250000,
      currency: "SYP",
      testsIncluded: 24,
      duration: "12 شهر",
      features: ["جميع التحاليل", "سحب منزلي مجاني", "تقرير طبي شامل", "استشارة مجانية"],
    },
    {
      id: "pkg-3",
      name: "باقة الشركات",
      price: 500000,
      currency: "SYP",
      testsIncluded: 50,
      duration: "12 شهر",
      features: ["تحاليل غير محدودة", "سحب من الموقع", "تقارير دورية", "مدير حساب مخصص"],
    },
  ]);
}
