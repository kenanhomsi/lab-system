import { roleStrategy } from "@/strategies/role";
import { serverAuthConfig } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import type { ReactNode } from "react";
import { SidebarFactory } from "@/components/shared/sidebar";
import { NavbarFactory } from "@/components/shared/navbar";
import { Box } from "@mantine/core";
import { DashboardAdBanner, DashboardAdFloating } from "@/components/dashboard/ad-space";
import styles from "./styles.module.scss";

const formatRoleTitle = (role: string) =>
    role.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

type RoleKey = keyof typeof roleStrategy;

export default async function LocaleLayout({
    children,
}: Readonly<{
    children: ReactNode;
    params: Promise<{ locale: string }>;
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
    return <Box>
        <SidebarFactory items={siderBarItems} />
        <NavbarFactory config={navbarConfig} />
        <Box className={styles.sectionPadding}>
            <DashboardAdBanner kind="external" partnerName="Al kenan Lab" />
            {children}
        </Box>
        <DashboardAdFloating kind="external" partnerName="Al kenan Lab" />
    </Box >;
}
