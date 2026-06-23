import { NextRequest } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { proxyBackendRequest } from "@/lib/api/backend-proxy";

export async function GET(req: NextRequest) {
  try {
    return await proxyBackendRequest(req, { method: "GET", path: "/api/appointments" });
  } catch (error: unknown) {
    return jsonError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return await proxyBackendRequest(req, {
      method: "POST",
      path: "/api/appointments",
      body,
    });
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
