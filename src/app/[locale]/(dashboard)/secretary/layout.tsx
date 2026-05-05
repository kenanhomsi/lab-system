import { guardByRole } from "@/lib/auth/role-guard";
import type { ReactNode } from "react";

type SecretaryLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function SecretaryLayout({
  children,
  params,
}: SecretaryLayoutProps) {
  const { locale } = await params;
  await guardByRole({ locale, allowedRoles: ["secretary"] });
  return children;
}
