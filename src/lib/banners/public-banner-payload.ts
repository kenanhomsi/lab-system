import type { BannerItem } from "@/types/banner";

function pick(obj: Record<string, unknown>, ...keys: string[]): unknown {
  for (const k of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, k)) {
      const v = obj[k];
      if (v !== undefined && v !== null) {
        return v;
      }
    }
  }
  return undefined;
}

function toBool(v: unknown): boolean {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") return v.toLowerCase() === "true";
  if (typeof v === "number") return v !== 0;
  return false;
}

function toNum(v: unknown): number {
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isNaN(n) ? 0 : n;
  }
  return 0;
}

export function coerceBannerRecord(raw: unknown): BannerItem | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const id = pick(r, "id", "Id");
  if (id === undefined || id === null) return null;

  const activeRaw = pick(r, "isActive", "IsActive");
  const isActive =
    activeRaw === undefined || activeRaw === null ? true : toBool(activeRaw);

  return {
    id: String(id),
    title: String(pick(r, "title", "Title") ?? ""),
    type: String(pick(r, "type", "Type") ?? ""),
    mediaUrl: String(pick(r, "mediaUrl", "MediaUrl") ?? ""),
    internalLink: String(pick(r, "internalLink", "InternalLink") ?? ""),
    externalLink: String(pick(r, "externalLink", "ExternalLink") ?? ""),
    targetType: String(pick(r, "targetType", "TargetType") ?? ""),
    location: String(pick(r, "location", "Location") ?? ""),
    displayOrder: toNum(pick(r, "displayOrder", "DisplayOrder")),
    isActive,
    visibilityRules: String(
      pick(r, "visibilityRules", "VisibilityRules", "visibilityRulesJson") ?? "",
    ),
    startDate: String(pick(r, "startDate", "StartDate") ?? ""),
    endDate: String(pick(r, "endDate", "EndDate") ?? ""),
    viewsCount: toNum(pick(r, "viewsCount", "ViewsCount")),
    clicksCount: toNum(pick(r, "clicksCount", "ClicksCount")),
    createdAt: String(pick(r, "createdAt", "CreatedAt") ?? ""),
  };
}

/** Unwraps typical BFF / .NET envelope shapes to a list of raw records. */
export function unwrapPublicBannerPayload(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;

  if (payload && typeof payload === "object") {
    const o = payload as Record<string, unknown>;

    if (Array.isArray(o.data)) return o.data;

    const inner = o.data;
    if (inner && typeof inner === "object") {
      const d = inner as Record<string, unknown>;
      if (Array.isArray(d.data)) return d.data;
      if (Array.isArray(d.items)) return d.items;
      if (Array.isArray(d.results)) return d.results;
    }

    if (Array.isArray(o.items)) return o.items;
    if (Array.isArray(o.results)) return o.results;
  }

  return [];
}

/** Full unwrap + coercion for public banner API responses (website + upstream). */
export function normalizePublicBannerPayload(payload: unknown): BannerItem[] {
  const rows = unwrapPublicBannerPayload(payload);
  return rows
    .map((row) => coerceBannerRecord(row))
    .filter((b): b is BannerItem => b !== null);
}
