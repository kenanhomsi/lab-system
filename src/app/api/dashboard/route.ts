import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import {
  DASHBOARD_CACHE_SECONDS,
  fetchDashboardResponseForToken,
} from "@/lib/api/fetch-dashboard";

const DASHBOARD_PRIVATE_CACHE = [
  "private",
  `max-age=${DASHBOARD_CACHE_SECONDS}`,
  `stale-while-revalidate=${DASHBOARD_CACHE_SECONDS}`,
].join(", ");

export async function GET(req: NextRequest) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }

    const res = await fetchDashboardResponseForToken(token);
    return NextResponse.json(res, {
      headers: {
        "Cache-Control": DASHBOARD_PRIVATE_CACHE,
        Vary: "Cookie, Authorization",
      },
    });
  } catch (error: unknown) {
    return jsonError(error);
  }
}
