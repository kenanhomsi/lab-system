/**
 * Maps API status strings to visual badge variants.
 */
export type StatusVariant = "pending" | "completed" | "resolved" | "review" | "default";

export function getStatusVariant(status: string): StatusVariant {
  const normalized = status.toLowerCase().replace(/\s+/g, "");

  if (
    normalized.includes("pending") ||
    normalized.includes("waiting") ||
    normalized.includes("inreview")
  ) {
    return normalized.includes("review") ? "review" : "pending";
  }
  if (
    normalized.includes("complete") ||
    normalized.includes("ready") ||
    normalized.includes("verified")
  ) {
    return "completed";
  }
  if (normalized.includes("resolved")) {
    return "resolved";
  }

  return "default";
}
