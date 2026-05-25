import { NextRequest, NextResponse } from "next/server";
import { resolvePublicOrigin } from "@/lib/api/public-origin";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";

/**
 * Returns the browser-facing origin for SignalR hubs plus a scoped access
 * token read server-side from the encrypted session cookie. Hubs are proxied
 * via next.config rewrites (`/hubs/*` → BACKEND_URL) so negotiation stays
 * same-origin. The token is intentionally returned only here (not in the
 * session object) so client code cannot access it outside the SignalR flow.
 */
export async function GET(request: NextRequest) {
  const hubBaseUrl = resolvePublicOrigin(request);
  const accessToken = await resolveAccessToken(request);
  return NextResponse.json({ hubBaseUrl, accessToken: accessToken ?? null });
}
