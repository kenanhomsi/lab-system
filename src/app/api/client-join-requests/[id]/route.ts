import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import { unwrapUpstreamPayload } from "@/lib/api/unwrap-upstream-payload";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }
    const { id } = await context.params;
    const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";

    const res = await fetch(`${backendUrl}/api/client-join-requests/${id}`, {
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

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }
    const { id } = await context.params;
    const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";

    const res = await fetch(`${backendUrl}/api/client-join-requests/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Upstream request failed" },
        { status: res.status },
      );
    }
    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
