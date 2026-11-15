import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const isUpstreamReady = process.env.UPSTREAM_BACKEND_READY === "true";

  try {
    const contentType = request.headers.get("content-type") ?? "";
    const body = contentType.includes("multipart/form-data")
      ? await request.formData()
      : await request.json();

    if (isUpstreamReady) {
      const res = await fetch(`${backendUrl}/api/employment-applications`, {
        method: "POST",
        headers: body instanceof FormData ? undefined : { "Content-Type": "application/json" },
        body: body instanceof FormData ? body : JSON.stringify(body),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        return NextResponse.json(
          { error: (payload as { message?: string }).message || "Application failed" },
          { status: res.status },
        );
      }
      return NextResponse.json(payload, { status: res.status === 201 ? 201 : res.status });
    }

    return NextResponse.json(
      {
        ok: true,
        applicationId: `mock-career-${Date.now()}`,
        receivedAt: new Date().toISOString(),
        vacancyId: body instanceof FormData
          ? String(body.get("vacancyId") ?? "") || null
          : (body as { vacancyId?: string }).vacancyId ?? null,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
