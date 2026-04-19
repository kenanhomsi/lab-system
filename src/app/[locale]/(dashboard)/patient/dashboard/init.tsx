"use client";

import type { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";
import type {
  ActivityItem,
  HealthSummary,
  RecentResult,
  StatCard,
  UpcomingAppointment,
} from "./type";

type Props = PropsWithChildren<{
  stats: StatCard[];
  upcomingAppointments: UpcomingAppointment[];
  recentResults: RecentResult[];
  healthSummary: HealthSummary;
  activity: ActivityItem[];
}>;

const Init = ({
  children,
  stats,
  upcomingAppointments,
  recentResults,
  healthSummary,
  activity,
}: Props) => {
  useMirrorRegistry("stats", stats);
  useMirrorRegistry("upcomingAppointments", upcomingAppointments);
  useMirrorRegistry("recentResults", recentResults);
  useMirrorRegistry("healthSummary", healthSummary);
  useMirrorRegistry("activity", activity);
  return <>{children}</>;
};

export default Init;
