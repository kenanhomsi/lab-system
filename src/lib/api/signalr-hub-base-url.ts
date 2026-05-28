/** Normalized public API origin for browser SignalR (inlined at build time). */
export function getPublicBackendBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_BACKEND_URL ?? "").replace(/\/+$/, "");
}

/**
 * Upstream API origin for hub proxying.
 * Prefer runtime `BACKEND_URL`; fall back to public build-time URL.
 */
export function getSignalRHubBaseUrl(): string {
  return (
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://localhost:4000"
  ).replace(/\/+$/, "");
}

/** Backend target for middleware runtime rewrites (`/hubs/*`). */
export function getMiddlewareHubRewriteBackend(): string {
  return (
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.BACKEND_URL ||
    ""
  ).replace(/\/+$/, "");
}
