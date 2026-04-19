import type {
  PendingReferral,
  RecentPatient,
  StatCard,
  TodayAppointment,
  WeeklyBar,
} from "../type";

type Params = {
  stats: StatCard[];
  todayAppointments: TodayAppointment[];
  pendingReferrals: PendingReferral[];
  recentPatients: RecentPatient[];
  weeklySummary: WeeklyBar[];
};

const store = (): Params => ({
  stats: [],
  todayAppointments: [],
  pendingReferrals: [],
  recentPatients: [],
  weeklySummary: [],
});

export { store as initStore };
export type { Params as initParams };
