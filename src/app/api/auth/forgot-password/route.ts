import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { identifier } = await request.json();
    const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
    const isUpstreamReady = process.env.UPSTREAM_BACKEND_READY === "true";

    if (isUpstreamReady) {
      const res = await fetch(`${backendUrl}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        return NextResponse.json(
          { error: error.message || "Request failed" },
          { status: res.status },
        );
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true, message: "Verification code sent (mock)" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
