import type { ReactNode } from "react";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import { MantineRouteProvider } from "@/components/providers/mantine-route-provider";

/**
 * Profile uses Mantine UI inside the public website shell.
 */
export default function ProfileLayout({ children }: { children: ReactNode }) {
  return <MantineRouteProvider>{children}</MantineRouteProvider>;
}
