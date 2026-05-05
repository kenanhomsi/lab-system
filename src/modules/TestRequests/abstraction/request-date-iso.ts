/** HTML date inputs send YYYY-MM-DD; upstream APIs expect ISO 8601 datetimes. */
function toRequestDateIso(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return new Date(`${trimmed}T00:00:00.000Z`).toISOString();
  }

  const ms = Date.parse(trimmed);
  if (Number.isNaN(ms)) return trimmed;
  return new Date(ms).toISOString();
}

export { toRequestDateIso };
