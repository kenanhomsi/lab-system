import type { NextRequest } from "next/server";

/** Public site origin for browser clients (respects reverse-proxy headers). */
export function resolvePublicOrigin(request: NextRequest): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost ?? request.headers.get("host");
  if (host) {
    const forwardedProto = request.headers.get("x-forwarded-proto");
    const proto =
      forwardedProto ??
      (host.includes("localhost") || host.startsWith("127.0.0.1")
        ? "http"
        : "https");
    return `${proto}://${host}`;
  }
  return new URL(request.url).origin;
}
