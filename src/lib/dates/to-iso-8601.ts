/**
 * Normalizes a date string from inputs (e.g. Mantine) to RFC3339 / ISO 8601 in UTC,
 * matching typical API expectations (`2026-04-30T14:37:40.592Z`).
 */
export function toIso8601Utc(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  const d = new Date(trimmed);
  if (Number.isNaN(d.getTime())) return trimmed;
  return d.toISOString();
}
