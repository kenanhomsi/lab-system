import { guardByRole } from "@/lib/auth/role-guard";
import type { ReactNode } from "react";

type LabLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LabLayout({ children, params }: LabLayoutProps) {
  const { locale } = await params;
  await guardByRole({ locale, allowedRoles: ["LabPartner"] });
  return children;
}
