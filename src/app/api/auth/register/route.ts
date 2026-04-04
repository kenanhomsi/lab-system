import { NextResponse } from "next/server";
import type { RegisterPayload } from "@/types/user";

export async function POST(request: Request) {
  try {
    const body: RegisterPayload = await request.json();
    const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
    const isUpstreamReady = process.env.UPSTREAM_BACKEND_READY === "true";

    if (isUpstreamReady) {
      const res = await fetch(`${backendUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        return NextResponse.json(
          { error: error.message || "Registration failed" },
          { status: res.status },
        );
      }

      const data = await res.json();
      return NextResponse.json(data, { status: 201 });
    }

    return NextResponse.json(
      {
        id: `mock-${body.role}-${Date.now()}`,
        ...body,
        password: undefined,
        createdAt: new Date().toISOString(),
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
