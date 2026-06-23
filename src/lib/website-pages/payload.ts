export function unwrapWebsitePagePayload(payload: unknown): unknown {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "data" in payload &&
    (payload as { data: unknown }).data !== undefined
  ) {
    return unwrapWebsitePagePayload((payload as { data: unknown }).data);
  }
  return payload;
}

export function normalizeArrayPayload<T>(payload: unknown): T[] {
  const unwrapped = unwrapWebsitePagePayload(payload);
  if (Array.isArray(unwrapped)) {
    return unwrapped as T[];
  }
  if (
    unwrapped &&
    typeof unwrapped === "object" &&
    "items" in unwrapped &&
    Array.isArray((unwrapped as { items: unknown }).items)
  ) {
    return (unwrapped as { items: T[] }).items;
  }
  if (
    unwrapped &&
    typeof unwrapped === "object" &&
    "results" in unwrapped &&
    Array.isArray((unwrapped as { results: unknown }).results)
  ) {
    return (unwrapped as { results: T[] }).results;
  }
  return [];
}

export function normalizeObjectPayload<T>(payload: unknown): T {
  return unwrapWebsitePagePayload(payload) as T;
}
