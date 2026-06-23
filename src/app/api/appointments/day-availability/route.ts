import { NextRequest } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { proxyBackendRequest } from "@/lib/api/backend-proxy";

export async function GET(req: NextRequest) {
  try {
    return await proxyBackendRequest(req, {
      method: "GET",
      path: "/api/appointments/day-availability",
    });
  } catch (error: unknown) {
    return jsonError(error);
  }
}
