import { NextRequest } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { proxyBackendRequest } from "@/lib/api/backend-proxy";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    return await proxyBackendRequest(req, {
      method: "GET",
      path: `/api/appointments/${id}`,
    });
  } catch (error: unknown) {
    return jsonError(error);
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();
    return await proxyBackendRequest(req, {
      method: "PUT",
      path: `/api/appointments/${id}`,
      body,
    });
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
