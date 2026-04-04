import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const isUpstreamReady = process.env.UPSTREAM_BACKEND_READY === "true";
  const { searchParams } = new URL(request.url);

  if (isUpstreamReady) {
    const qs = searchParams.toString();
    const res = await fetch(`${backendUrl}/results?${qs}`);
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { error: (payload as { message?: string }).message || "Failed to fetch results" },
        { status: res.status },
      );
    }
    return NextResponse.json(payload);
  }

  const mockResults = [
    {
      id: "res-1",
      testName: "CBC - تعداد دم شامل",
      result: "14.2",
      normalRange: "12.0-17.5",
      unit: "g/dL",
      note: "ضمن الحدود الطبيعية",
      patientId: "p-1",
      patientName: "أحمد محمد",
      patientAge: 35,
      patientSex: "male",
      doctorId: "d-1",
      labId: "lab-1",
      date: "2026-04-01",
    },
    {
      id: "res-2",
      testName: "Glucose - سكر الدم",
      result: "110",
      normalRange: "70-100",
      unit: "mg/dL",
      note: "مرتفع قليلاً",
      patientId: "p-1",
      patientName: "أحمد محمد",
      patientAge: 35,
      patientSex: "male",
      doctorId: "d-1",
      labId: "lab-1",
      date: "2026-04-01",
    },
    {
      id: "res-3",
      testName: "Cholesterol - كوليسترول",
      result: "195",
      normalRange: "< 200",
      unit: "mg/dL",
      note: "",
      patientId: "p-2",
      patientName: "سارة علي",
      patientAge: 28,
      patientSex: "female",
      doctorId: "d-2",
      labId: "lab-1",
      date: "2026-03-28",
    },
    {
      id: "res-4",
      testName: "TSH - هرمون الغدة الدرقية",
      result: "3.5",
      normalRange: "0.4-4.0",
      unit: "mIU/L",
      note: "طبيعي",
      patientId: "p-2",
      patientName: "سارة علي",
      patientAge: 28,
      patientSex: "female",
      doctorId: "d-2",
      labId: "lab-1",
      date: "2026-03-28",
    },
  ];

  const patientId = searchParams.get("patientId");
  const doctorId = searchParams.get("doctorId");
  const testName = searchParams.get("testName");

  let filtered = mockResults;
  if (patientId) filtered = filtered.filter((r) => r.patientId === patientId);
  if (doctorId) filtered = filtered.filter((r) => r.doctorId === doctorId);
  if (testName) filtered = filtered.filter((r) => r.testName.toLowerCase().includes(testName.toLowerCase()));

  return NextResponse.json(filtered);
}
