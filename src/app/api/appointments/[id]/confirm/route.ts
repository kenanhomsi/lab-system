import { NextRequest } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { proxyBackendRequest } from "@/lib/api/backend-proxy";

type RouteParams = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    return await proxyBackendRequest(req, {
      method: "POST",
      path: `/api/appointments/${id}/confirm`,
    });
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
