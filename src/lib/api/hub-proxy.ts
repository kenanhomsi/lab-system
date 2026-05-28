import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSignalRHubBaseUrl } from "@/lib/api/signalr-hub-base-url";

/** Browser-facing prefix; proxied at runtime to `${BACKEND_URL}/hubs/*`. */
export const SIGNALR_HUB_PROXY_PREFIX = "/api/hubs";

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
]);

function copyForwardableHeaders(
  source: Headers,
  target: Headers,
  skipHost = false,
): void {
  source.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (HOP_BY_HOP_HEADERS.has(lower)) return;
    if (skipHost && lower === "host") return;
    target.set(key, value);
  });
}

function buildUpstreamHubUrl(
  backendBaseUrl: string,
  hubPathSegments: string[],
  request: NextRequest,
): URL {
  const normalizedSegments = hubPathSegments.filter(Boolean);
  const upstreamPath = `/hubs/${normalizedSegments.join("/")}`;
  const url = new URL(upstreamPath, `${backendBaseUrl}/`);
  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });
  return url;
}

/**
 * Proxies SignalR HTTP traffic to the upstream API using runtime env vars.
 * Avoids build-time rewrites and cross-origin browser calls.
 */
export async function proxySignalRHubRequest(
  request: NextRequest,
  hubPathSegments: string[],
): Promise<NextResponse> {
  const backendBaseUrl = getSignalRHubBaseUrl();
  if (!backendBaseUrl) {
    return NextResponse.json(
      { error: "SignalR backend URL is not configured." },
      { status: 503 },
    );
  }

  const upstreamUrl = buildUpstreamHubUrl(
    backendBaseUrl,
    hubPathSegments,
    request,
  );
  const method = request.method.toUpperCase();
  const headers = new Headers();
  copyForwardableHeaders(request.headers, headers, true);

  let body: ArrayBuffer | undefined;
  if (method !== "GET" && method !== "HEAD" && method !== "OPTIONS") {
    body = await request.arrayBuffer();
  }

  try {
    const upstream = await fetch(upstreamUrl.toString(), {
      method,
      headers,
      body,
      cache: "no-store",
    });

    const responseHeaders = new Headers();
    copyForwardableHeaders(upstream.headers, responseHeaders);

    return new NextResponse(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upstream hub request failed.";
    console.error(
      "[hub-proxy]",
      method,
      upstreamUrl.toString(),
      message,
    );
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
