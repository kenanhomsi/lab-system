import { guardByRole } from "@/lib/auth/role-guard";
import type { ReactNode } from "react";

type SpecialLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function SpecialLayout({
  children,
  params,
}: SpecialLayoutProps) {
  const { locale } = await params;
  await guardByRole({ locale, allowedRoles: ["special"] });
  return children;
}
