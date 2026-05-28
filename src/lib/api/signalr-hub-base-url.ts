/** Normalized public API origin for browser SignalR (inlined at build time). */
export function getPublicBackendBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_BACKEND_URL ?? "").replace(/\/+$/, "");
}

/**
 * API origin returned from `/api/chat/negotiate`.
 * Uses runtime `BACKEND_URL` on the server, with build-time public fallback.
 */
export function getSignalRHubBaseUrl(): string {
  return (
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://localhost:4000"
  ).replace(/\/+$/, "");
}
