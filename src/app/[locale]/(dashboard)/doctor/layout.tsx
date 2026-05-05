import { guardByRole } from "@/lib/auth/role-guard";
import type { ReactNode } from "react";

type DoctorLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function DoctorLayout({
  children,
  params,
}: DoctorLayoutProps) {
  const { locale } = await params;
  await guardByRole({ locale, allowedRoles: ["doctor"] });
  return children;
}
