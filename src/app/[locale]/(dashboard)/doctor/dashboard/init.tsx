"use client";

import type { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";
import type {
  PendingReferral,
  RecentPatient,
  StatCard,
  TodayAppointment,
  WeeklyBar,
} from "./type";

type Props = PropsWithChildren<{
  stats: StatCard[];
  todayAppointments: TodayAppointment[];
  pendingReferrals: PendingReferral[];
  recentPatients: RecentPatient[];
  weeklySummary: WeeklyBar[];
}>;

const Init = ({
  children,
  stats,
  todayAppointments,
  pendingReferrals,
  recentPatients,
  weeklySummary,
}: Props) => {
  useMirrorRegistry("stats", stats);
  useMirrorRegistry("todayAppointments", todayAppointments);
  useMirrorRegistry("pendingReferrals", pendingReferrals);
  useMirrorRegistry("recentPatients", recentPatients);
  useMirrorRegistry("weeklySummary", weeklySummary);
  return <>{children}</>;
};

export default Init;
