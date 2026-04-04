import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const isUpstreamReady = process.env.UPSTREAM_BACKEND_READY === "true";
  const { id } = await params;

  if (isUpstreamReady) {
    const res = await fetch(`${backendUrl}/appointments/${id}/tracking`);
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { error: (payload as { message?: string }).message || "Failed to fetch tracking" },
        { status: res.status },
      );
    }
    return NextResponse.json(payload);
  }

  return NextResponse.json({
    appointmentId: id,
    patientName: "أحمد محمد",
    steps: [
      { key: "received", label: "تم استلام الطلب", icon: "inbox", completed: true, completedAt: "2026-04-04T08:00:00Z" },
      { key: "sampled", label: "تم سحب العينة", icon: "bloodtype", completed: true, completedAt: "2026-04-04T09:30:00Z" },
      { key: "analyzing", label: "قيد التحليل", icon: "science", completed: false, completedAt: null },
      { key: "ready", label: "النتائج جاهزة", icon: "task_alt", completed: false, completedAt: null },
    ],
  });
}
