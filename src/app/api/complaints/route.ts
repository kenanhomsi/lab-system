import { type NextRequest, NextResponse } from "next/server";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";

export async function POST(request: NextRequest) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const isUpstreamReady = process.env.UPSTREAM_BACKEND_READY === "true";

  try {
    const body = await request.formData();

    if (isUpstreamReady) {
      const upstreamBody = new FormData();
      upstreamBody.set("Title", String(body.get("complaintTitle") ?? ""));
      upstreamBody.set("Description", String(body.get("text") ?? ""));
      upstreamBody.set("Note", String(body.get("name") ?? ""));
      const attachment = body.get("attachment");
      if (attachment instanceof File && attachment.size > 0) {
        upstreamBody.set("Attachment", attachment);
      }
      const token = await resolveAccessToken(request);
      const res = await fetch(`${backendUrl}/api/users/me/complaints`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: upstreamBody,
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        return NextResponse.json(
          { error: (payload as { message?: string }).message || "Complaint submission failed" },
          { status: res.status },
        );
      }
      return NextResponse.json(payload, { status: res.status === 201 ? 201 : res.status });
    }

    return NextResponse.json(
      {
        ok: true,
        ticketId: `mock-complaint-${Date.now()}`,
        receivedAt: new Date().toISOString(),
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
