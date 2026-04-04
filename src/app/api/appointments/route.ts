import { NextResponse } from "next/server";
import type { AppointmentPayload, DrawLocation } from "@/types/appointment";

function isDrawLocation(v: unknown): v is DrawLocation {
  return v === "lab" || v === "home" || v === "work";
}

function isGender(v: unknown): v is "male" | "female" {
  return v === "male" || v === "female";
}

function parsePayload(body: unknown): AppointmentPayload | null {
  if (!body || typeof body !== "object") return null;
  const o = body as Record<string, unknown>;

  const patientName = typeof o.patientName === "string" ? o.patientName.trim() : "";
  const age = typeof o.age === "number" ? o.age : Number(o.age);
  const mobile = typeof o.mobile === "string" ? o.mobile.trim() : "";
  const dateTime = typeof o.dateTime === "string" ? o.dateTime.trim() : "";
  const requiredTests = typeof o.requiredTests === "string" ? o.requiredTests.trim() : "";
  const address = typeof o.address === "string" ? o.address.trim() : "";

  if (!patientName || !Number.isFinite(age) || age < 0 || age > 150) return null;
  const genderRaw = o.gender;
  if (!isGender(genderRaw)) return null;
  const drawRaw = o.drawLocation;
  if (!mobile || !isDrawLocation(drawRaw)) return null;
  if (!dateTime || !requiredTests || !address) return null;

  const prescriptionImage =
    typeof o.prescriptionImage === "string" && o.prescriptionImage.length > 0
      ? o.prescriptionImage
      : undefined;
  const medicalCondition =
    typeof o.medicalCondition === "string" && o.medicalCondition.trim().length > 0
      ? o.medicalCondition.trim()
      : undefined;
  const referredByDoctorId =
    typeof o.referredByDoctorId === "string" && o.referredByDoctorId.trim().length > 0
      ? o.referredByDoctorId.trim()
      : undefined;

  return {
    patientName,
    age,
    gender: genderRaw,
    mobile,
    drawLocation: drawRaw,
    dateTime,
    requiredTests,
    address,
    prescriptionImage,
    medicalCondition,
    referredByDoctorId,
    ...(typeof o.lat === "number" && typeof o.lng === "number"
      ? { lat: o.lat, lng: o.lng }
      : {}),
    ...(typeof o.savedAddressId === "string" ? { savedAddressId: o.savedAddressId } : {}),
  };
}

export async function POST(request: Request) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const isUpstreamReady = process.env.UPSTREAM_BACKEND_READY === "true";

  try {
    const json = await request.json();
    const payload = parsePayload(json);
    if (!payload) {
      return NextResponse.json({ error: "Invalid appointment payload" }, { status: 400 });
    }

    if (isUpstreamReady) {
      const res = await fetch(`${backendUrl}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        return NextResponse.json(
          { error: (body as { message?: string }).message || "Appointment creation failed" },
          { status: res.status },
        );
      }
      return NextResponse.json(body, { status: res.status === 201 ? 201 : res.status });
    }

    return NextResponse.json(
      {
        ok: true,
        id: `mock-appt-${Date.now()}`,
        createdAt: new Date().toISOString(),
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
