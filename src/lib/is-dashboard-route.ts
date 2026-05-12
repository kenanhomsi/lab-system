/**
 * Matches the first URL segment after `[locale]` for the `(dashboard)` route group
 * (dashboard segments are not prefixed in the path).
 */
const DASHBOARD_ROOTS = new Set([
  "admin",
  "doctor",
  "lab",
  "patient",
  "secretary",
]);

export function isDashboardRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  const parts = pathname.split("/").filter(Boolean);
  const afterLocale = parts[1]?.toLowerCase();
  return !!afterLocale && DASHBOARD_ROOTS.has(afterLocale);
}
