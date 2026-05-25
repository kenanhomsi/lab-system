/**
 * Resolves the dashboard URL prefix (e.g. `/patient`) from API role strings.
 */
export function resolveDashboardBaseFromRoles(roles?: string[]): string {
  const pick = (needle: string) =>
    roles?.some((r) => r.toLowerCase().includes(needle)) ?? false;

  if (pick("secretary")) return "/secretary";
  if (pick("patient")) return "/patient";
  if (pick("doctor")) return "/doctor";
  if (pick("admin")) return "/admin";
  if (pick("lab")) return "/lab";

  return "/admin";
}

/** True when any role looks like a patient account (for plans / subscription shortcuts). */
export function hasPatientRole(roles?: string[]): boolean {
  return roles?.some((r) => r.toLowerCase().includes("patient")) ?? false;
}

/** True when any role looks like an admin account. */
export function hasAdminRole(roles?: string[]): boolean {
  return roles?.some((r) => r.toLowerCase().includes("admin")) ?? false;
}
