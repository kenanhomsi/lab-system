/**
 * Normalizes upstream `{ success, message, data }` envelopes to the inner payload.
 */
export function unwrapUpstreamPayload<T>(payload: unknown): T {
  if (
    payload !== null &&
    typeof payload === "object" &&
    "data" in payload &&
    (payload as { data: unknown }).data !== null &&
    typeof (payload as { data: unknown }).data === "object"
  ) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}
