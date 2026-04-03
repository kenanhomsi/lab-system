/**
 * When the real upstream API is not ready, keep routes on mock data.
 * Set UPSTREAM_BACKEND_READY=true in .env.local when the backend is available.
 */
export function isUpstreamBackendReady(): boolean {
  return process.env.UPSTREAM_BACKEND_READY === "true";
}
