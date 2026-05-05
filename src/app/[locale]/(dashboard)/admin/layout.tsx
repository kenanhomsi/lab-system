import { guardByRole } from "@/lib/auth/role-guard";
import type { ReactNode } from "react";

type AdminLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AdminLayout({
  children,
  params,
}: AdminLayoutProps) {
  const { locale } = await params;
  await guardByRole({ locale, allowedRoles: ["admin"] });
  return children;
}
