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
  { params }: { params: Promise<{ conversationId: string }> },
) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }

    const { conversationId } = await params;
    const res = await fetch(
      `${backendBase()}/api/chat/conversations/${encodeURIComponent(conversationId)}/leave`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      return NextResponse.json(payload, { status: res.status });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    return jsonError(error);
  }
}
