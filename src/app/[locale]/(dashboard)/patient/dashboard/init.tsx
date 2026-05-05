"use client";

import type { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";
import type { ActivityItem, HealthSummary, RecentResult, StatCard } from "./type";

type Props = PropsWithChildren<{
  stats: StatCard[];
  recentResults: RecentResult[];
  healthSummary: HealthSummary;
  activity: ActivityItem[];
}>;

const Init = ({
  children,
  stats,
  recentResults,
  healthSummary,
  activity,
}: Props) => {
  useMirrorRegistry("stats", stats);
  useMirrorRegistry("recentResults", recentResults);
  useMirrorRegistry("healthSummary", healthSummary);
  useMirrorRegistry("activity", activity);
  return <>{children}</>;
};

export default Init;
