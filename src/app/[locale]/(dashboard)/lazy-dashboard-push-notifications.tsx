"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

const DashboardPushNotifications = dynamic(
  () =>
    import("./dashboard-push-notifications").then(
      (module) => module.DashboardPushNotifications,
    ),
  { ssr: false },
);

/** Lazy-loaded FCM provider for the dashboard shell. */
export function LazyDashboardPushNotifications({
  children,
}: {
  children: ReactNode;
}) {
  return <DashboardPushNotifications>{children}</DashboardPushNotifications>;
}
