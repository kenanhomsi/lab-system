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

const AUTH_ROOTS = new Set(["login", "register", "forgot-password"]);

function routeSegmentAfterLocale(pathname: string | null): string | undefined {
  if (!pathname) return undefined;
  const parts = pathname.split("/").filter(Boolean);
  return parts[1]?.toLowerCase();
}

export function isDashboardRoute(pathname: string | null): boolean {
  const afterLocale = routeSegmentAfterLocale(pathname);
  return !!afterLocale && DASHBOARD_ROOTS.has(afterLocale);
}

export function needsMantineProvider(pathname: string | null): boolean {
  const afterLocale = routeSegmentAfterLocale(pathname);
  if (!afterLocale) return false;
  return DASHBOARD_ROOTS.has(afterLocale) || AUTH_ROOTS.has(afterLocale);
}
