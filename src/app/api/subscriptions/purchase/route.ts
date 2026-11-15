import { type NextRequest, NextResponse } from "next/server";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import { unwrapUpstreamPayload } from "@/lib/api/unwrap-upstream-payload";

export async function POST(request: NextRequest) {
  const token = await resolveAccessToken(request);
  if (!token) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const response = await fetch(`${backendUrl}/api/subscriptions/purchase`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(await request.json()),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "message" in payload
        ? String((payload as { message: unknown }).message)
        : "Subscription purchase failed";
    return NextResponse.json({ error: message }, { status: response.status });
  }
  return NextResponse.json(unwrapUpstreamPayload(payload), { status: response.status });
}
