"use client";

import type { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";
import type { PendingReferral, RecentPatient, StatCard, WeeklyBar } from "./type";

type Props = PropsWithChildren<{
  stats: StatCard[];
  pendingReferrals: PendingReferral[];
  recentPatients: RecentPatient[];
  weeklySummary: WeeklyBar[];
}>;

const Init = ({
  children,
  stats,
  pendingReferrals,
  recentPatients,
  weeklySummary,
}: Props) => {
  useMirrorRegistry("stats", stats);
  useMirrorRegistry("pendingReferrals", pendingReferrals);
  useMirrorRegistry("recentPatients", recentPatients);
  useMirrorRegistry("weeklySummary", weeklySummary);
  return <>{children}</>;
};

export default Init;
