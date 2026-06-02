import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }
    const { id } = await context.params;
    const body = await req.json();
    const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";

    const res = await fetch(
      `${backendUrl}/api/contract-service-requests/${id}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      },
    );

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: errorText || "Upstream request failed" },
        { status: res.status },
      );
    }
    return NextResponse.json(await res.json());
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
