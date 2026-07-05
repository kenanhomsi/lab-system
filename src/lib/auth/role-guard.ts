import type { Session } from "next-auth";
import { redirect } from "next/navigation";
import { getDashboardSession } from "./get-dashboard-session";
import { hasAdminRole } from "./permissions";

type GuardByRoleParams = {
  locale: string;
  allowedRoles: string[];
  session?: Session | null;
};

export async function guardByRole({
  locale,
  allowedRoles,
  session: providedSession,
}: GuardByRoleParams) {
  const session = providedSession ?? (await getDashboardSession());

  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  const userRoles = (session.user.roles ?? []).map((role) =>
    role.toLowerCase(),
  );
  const normalizedAllowedRoles = allowedRoles.map((role) => role.toLowerCase());
  const hasAllowedRole =
    hasAdminRole(session.user.roles) ||
    userRoles.some((role) => normalizedAllowedRoles.includes(role));

  if (!hasAllowedRole) {
    redirect(`/${locale}/forbidden`);
  }

  return session;
}
