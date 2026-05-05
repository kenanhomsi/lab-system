import type { PendingReferral, RecentPatient, StatCard, WeeklyBar } from "../type";

type Params = {
  stats: StatCard[];
  pendingReferrals: PendingReferral[];
  recentPatients: RecentPatient[];
  weeklySummary: WeeklyBar[];
};

const store = (): Params => ({
  stats: [],
  pendingReferrals: [],
  recentPatients: [],
  weeklySummary: [],
});

export { store as initStore };
export type { Params as initParams };
