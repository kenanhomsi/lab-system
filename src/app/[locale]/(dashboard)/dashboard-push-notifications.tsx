"use client";

import type { ReactNode } from "react";
import { PushNotificationsProvider } from "@/features/push-notifications/context/push-notifications-context";

/** Client boundary for FCM inside the dashboard layout. */
export function DashboardPushNotifications({
  children,
}: {
  children: ReactNode;
}) {
  return <PushNotificationsProvider>{children}</PushNotificationsProvider>;
}
