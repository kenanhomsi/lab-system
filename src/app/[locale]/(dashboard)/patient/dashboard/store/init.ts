import type {
  ActivityItem,
  HealthSummary,
  RecentResult,
  StatCard,
  UpcomingAppointment,
} from "../type";

type Params = {
  stats: StatCard[];
  upcomingAppointments: UpcomingAppointment[];
  recentResults: RecentResult[];
  healthSummary: HealthSummary;
  activity: ActivityItem[];
};

const store = (): Params => ({
  stats: [],
  upcomingAppointments: [],
  recentResults: [],
  healthSummary: {
    lastCheckup: "—",
    bloodType: "—",
    nextReminder: "—",
  },
  activity: [],
});

export { store as initStore };
export type { Params as initParams };
