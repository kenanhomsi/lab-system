import { NextRequest, NextResponse } from "next/server";
import { resolvePublicOrigin } from "@/lib/api/public-origin";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";

/**
 * Returns the same-origin base URL for SignalR plus a scoped access token.
 * Hubs use `/hubs/*` on the frontend origin; middleware rewrites those paths
 * to the upstream API at request time.
 */
export async function GET(request: NextRequest) {
  const hubBaseUrl = resolvePublicOrigin(request);
  const accessToken = await resolveAccessToken(request);
  return NextResponse.json({ hubBaseUrl, accessToken: accessToken ?? null });
}
