import type { ReactNode } from "react";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/notifications/styles.css";
import { AuthProviders } from "@/components/providers/auth-providers";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthProviders>{children}</AuthProviders>;
}
