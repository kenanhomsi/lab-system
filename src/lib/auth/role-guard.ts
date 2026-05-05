import { serverAuthConfig } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type GuardByRoleParams = {
  locale: string;
  allowedRoles: string[];
};

export async function guardByRole({ locale, allowedRoles }: GuardByRoleParams) {
  const session = await getServerSession(serverAuthConfig);

  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  const userRoles = (session.user.roles ?? []).map((role) => role.toLowerCase());
  const normalizedAllowedRoles = allowedRoles.map((role) => role.toLowerCase());
  const hasAllowedRole = userRoles.some((role) =>
    normalizedAllowedRoles.includes(role),
  );

  if (!hasAllowedRole) {
    redirect(`/${locale}/forbidden`);
  }

  return session;
}
