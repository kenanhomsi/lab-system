import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const isUpstreamReady = process.env.UPSTREAM_BACKEND_READY === "true";

  try {
    const body = await request.json();

    if (isUpstreamReady) {
      const res = await fetch(`${backendUrl}/client-applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        return NextResponse.json(
          { error: (payload as { message?: string }).message || "Submission failed" },
          { status: res.status },
        );
      }
      return NextResponse.json(payload, { status: res.status === 201 ? 201 : res.status });
    }

    return NextResponse.json(
      {
        ok: true,
        applicationId: `mock-client-${Date.now()}`,
        receivedAt: new Date().toISOString(),
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
