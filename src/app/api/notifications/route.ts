import { NextRequest } from "next/server";
import { proxyBackendRequest } from "@/lib/api/backend-proxy";

export async function GET(req: NextRequest) {
  return proxyBackendRequest(req, { method: "GET", path: "/api/notifications" });
}
