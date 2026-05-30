import { roleStrategy } from "@/strategies/role";
import { serverAuthConfig } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import type { ReactNode } from "react";
import { SidebarFactory } from "@/components/shared/sidebar";
import { NavbarFactory } from "@/components/shared/navbar";
import styles from "./styles.module.scss";
import { DashboardPushNotifications } from "./dashboard-push-notifications";

const formatRoleTitle = (role: string) =>
  role.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

type RoleKey = keyof typeof roleStrategy;

export default async function LocaleLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await getServerSession(serverAuthConfig);
  const requestedRole = session?.user.roles?.[0]?.toLowerCase();
  const role: RoleKey =
    requestedRole && requestedRole in roleStrategy
      ? (requestedRole as RoleKey)
      : "admin";
  const siderBarItems = roleStrategy[role].getSiderBarItems();
  const navbarConfig = roleStrategy[role].getNavbarConfig({
    name: session?.user.fullName,
    roleTitle: requestedRole ? formatRoleTitle(requestedRole) : undefined,
  });
  return (
    <DashboardPushNotifications>
      <div className={styles.dashboardRoot}>
        <SidebarFactory items={siderBarItems} />
        <NavbarFactory config={navbarConfig} />
        <main className={styles.sectionPadding}>{children}</main>
      </div>
    </DashboardPushNotifications>
  );
}
