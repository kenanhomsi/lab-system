import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { identifier, code, newPassword } = await request.json();
    const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
    const isUpstreamReady = process.env.UPSTREAM_BACKEND_READY === "true";

    if (isUpstreamReady) {
      const res = await fetch(`${backendUrl}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, code, newPassword }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        return NextResponse.json(
          { error: error.message || "Reset failed" },
          { status: res.status },
        );
      }

      return NextResponse.json({ success: true });
    }

    if (code === "123456") {
      return NextResponse.json({ success: true, message: "Password reset (mock)" });
    }
    return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
