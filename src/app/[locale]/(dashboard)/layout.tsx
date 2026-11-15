import { roleStrategy } from "@/strategies/role";
import type { ReactNode } from "react";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/notifications/styles.css";
import { SidebarFactory } from "@/components/shared/sidebar";
import { NavbarFactory } from "@/components/shared/navbar";
import { DashboardProviders } from "@/components/providers/dashboard-providers";
import { getDashboardSession } from "@/lib/auth/get-dashboard-session";
import { LazyDashboardPushNotifications } from "./lazy-dashboard-push-notifications";
import styles from "./styles.module.scss";

const formatRoleTitle = (role: string) =>
  role.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

type RoleKey = keyof typeof roleStrategy;

export default async function LocaleLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await getDashboardSession();
  const requestedRole = session?.user.roles?.[0]?.toLowerCase();
  const role: RoleKey =
    requestedRole && requestedRole in roleStrategy
      ? (requestedRole as RoleKey)
      : "admin";
  const siderBarItems = roleStrategy[role].getSiderBarItems();
  const navbarConfig = {
    ...roleStrategy[role].getNavbarConfig({
      name: session?.user.fullName,
      roleTitle: requestedRole ? formatRoleTitle(requestedRole) : undefined,
    }),
    navItems: siderBarItems,
  };
  return (
    <DashboardProviders>
      <LazyDashboardPushNotifications>
        <div className={styles.dashboardRoot}>
          <SidebarFactory items={siderBarItems} />
          <NavbarFactory config={navbarConfig} />
          <main className={styles.sectionPadding}>{children}</main>
        </div>
      </LazyDashboardPushNotifications>
    </DashboardProviders>
  );
}
