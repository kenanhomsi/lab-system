import { type NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";

function backendBase(): string {
  return (process.env.BACKEND_URL?.trim() || "http://localhost:4000").replace(
    /\/+$/,
    "",
  );
}

export async function POST(req: NextRequest) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }

    const body = await req.json();
    const res = await fetch(`${backendBase()}/api/chat/conversations/direct`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(payload, { status: res.status });
    }
    return NextResponse.json(payload);
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
