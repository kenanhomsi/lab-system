import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import { unwrapUpstreamPayload } from "@/lib/api/unwrap-upstream-payload";

export async function GET(req: NextRequest) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }
    const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
    const target = new URL(`${backendUrl}/api/client-join-requests`);
    req.nextUrl.searchParams.forEach((value, key) => {
      target.searchParams.set(key, value);
    });

    const res = await fetch(target.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Upstream request failed" },
        { status: res.status },
      );
    }
    return NextResponse.json(unwrapUpstreamPayload(await res.json()));
  } catch (error: unknown) {
    return jsonError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
    const body = await req.json();

    const res = await fetch(`${backendUrl}/api/client-join-requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      const message =
        typeof payload === "object" &&
        payload !== null &&
        "message" in payload &&
        typeof (payload as { message?: string }).message === "string"
          ? (payload as { message: string }).message
          : "Submission failed";
      return NextResponse.json({ error: message }, { status: res.status });
    }
    return NextResponse.json(await res.json(), {
      status: res.status === 201 ? 201 : 200,
    });
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
