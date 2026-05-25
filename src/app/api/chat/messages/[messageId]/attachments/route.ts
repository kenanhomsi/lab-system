import { type NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";

function backendBase(): string {
  return (process.env.BACKEND_URL?.trim() || "http://localhost:4000").replace(
    /\/+$/,
    "",
  );
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ messageId: string }> },
) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }

    const { messageId } = await params;
    const formData = await req.formData();
    const url = `${backendBase()}/api/chat/messages/${encodeURIComponent(messageId)}/attachments`;

    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
      cache: "no-store",
    });

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(payload, { status: res.status });
    }
    return NextResponse.json(payload);
  } catch (error: unknown) {
    return jsonError(error);
  }
}
