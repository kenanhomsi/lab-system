import { NextRequest } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { proxyBackendRequest } from "@/lib/api/backend-proxy";
import { withCappedPagination } from "@/lib/api/bff-pagination";
import { forwardMultipartToBackend } from "@/lib/api/forward-multipart";

function withCappedPaginationRequest(req: NextRequest) {
  const query = withCappedPagination(req.nextUrl.searchParams);
  const url = new URL(req.url);
  url.search = query;
  return new NextRequest(url, req);
}

export async function GET(req: NextRequest) {
  try {
    return await proxyBackendRequest(withCappedPaginationRequest(req), {
      method: "GET",
      path: "/api/appointments",
    });
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
