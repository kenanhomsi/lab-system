export type ParsedResultData =
  | { kind: "empty" }
  | { kind: "object"; entries: [string, unknown][] }
  | { kind: "json"; value: unknown }
  | { kind: "text"; text: string };

export function stringifyPreview(v: unknown): string {
  if (v === null) return "null";
  if (v === undefined) return "undefined";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

export function parseResultData(raw: unknown): ParsedResultData {
  if (raw === null || raw === undefined) return { kind: "empty" };

  if (typeof raw !== "string") {
    if (typeof raw === "object") {
      if (Object.keys(raw).length === 0) return { kind: "empty" };
      if (!Array.isArray(raw)) {
        return {
          kind: "object",
          entries: Object.entries(raw as Record<string, unknown>),
        };
      }
      return { kind: "json", value: raw };
    }
    raw = String(raw);
  }

  const trimmed = (raw as string).trim();
  if (!trimmed || trimmed === "{}") return { kind: "empty" };
  try {
    const value = JSON.parse(trimmed) as unknown;
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      return {
        kind: "object",
        entries: Object.entries(value as Record<string, unknown>),
      };
    }
    return { kind: "json", value };
  } catch {
    return { kind: "text", text: trimmed };
  }
}
