import { type NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";

function backendBase(): string {
  return (process.env.BACKEND_URL?.trim() || "http://localhost:4000").replace(
    /\/+$/,
    "",
  );
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }

    const { conversationId } = await params;
    const search = new URLSearchParams();
    const take = req.nextUrl.searchParams.get("take");
    const beforeUtc = req.nextUrl.searchParams.get("beforeUtc");
    if (take) search.set("take", take);
    if (beforeUtc) search.set("beforeUtc", beforeUtc);
    const qs = search.toString();
    const url = `${backendBase()}/api/chat/conversations/${encodeURIComponent(conversationId)}/messages${qs ? `?${qs}` : ""}`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
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
