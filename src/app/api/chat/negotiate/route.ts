import { NextRequest, NextResponse } from "next/server";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import { getSignalRHubBaseUrl } from "@/lib/api/signalr-hub-base-url";

/**
 * Returns the upstream API origin for SignalR hubs plus a scoped access token
 * read server-side from the encrypted session cookie. The browser connects
 * directly to the API (`NEXT_PUBLIC_BACKEND_URL`); the token is returned only
 * here so client code cannot access it outside the SignalR flow.
 */
export async function GET(request: NextRequest) {
  const hubBaseUrl = getSignalRHubBaseUrl();
  const accessToken = await resolveAccessToken(request);
  return NextResponse.json({ hubBaseUrl, accessToken: accessToken ?? null });
}
