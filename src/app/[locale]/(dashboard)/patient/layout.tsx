import { guardByRole } from "@/lib/auth/role-guard";
import type { ReactNode } from "react";

type PatientLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function PatientLayout({
  children,
  params,
}: PatientLayoutProps) {
  const { locale } = await params;
  await guardByRole({ locale, allowedRoles: ["patient"] });
  return children;
}
