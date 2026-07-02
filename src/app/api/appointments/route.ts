import { NextRequest } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { proxyBackendRequest } from "@/lib/api/backend-proxy";
import { forwardMultipartToBackend } from "@/lib/api/forward-multipart";

export async function GET(req: NextRequest) {
  try {
    return await proxyBackendRequest(req, { method: "GET", path: "/api/appointments" });
  } catch (error: unknown) {
    return jsonError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    return await forwardMultipartToBackend(req, "/api/appointments");
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
