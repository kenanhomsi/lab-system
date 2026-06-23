const DAY_KEYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

/**
 * Normalizes backend day-of-week values to a 0–6 index (Sunday = 0).
 */
const normalizeDayOfWeek = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    if (value >= 0 && value <= 6) return value;
    if (value >= 1 && value <= 7) return value % 7;
  }

  if (typeof value === "string") {
    const trimmed = value.trim().toLowerCase();
    const byName = DAY_KEYS.indexOf(trimmed as (typeof DAY_KEYS)[number]);
    if (byName >= 0) return byName;

    const parsed = Number(trimmed);
    if (Number.isFinite(parsed)) {
      return normalizeDayOfWeek(parsed);
    }
  }

  return 0;
};

/**
 * Formats HH:mm:ss or HH:mm strings for table display.
 */
const formatTimeCell = (value: string): string => {
  if (!value) return "—";
  const match = value.match(/^(\d{1,2}:\d{2})/);
  return match?.[1] ?? value;
};

/**
 * Strips seconds from a time string for form fields.
 */
const toFormTime = (value: string): string => formatTimeCell(value);

export { DAY_KEYS, formatTimeCell, normalizeDayOfWeek, toFormTime };
