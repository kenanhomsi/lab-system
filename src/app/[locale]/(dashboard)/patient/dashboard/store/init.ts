import type { ActivityItem, HealthSummary, RecentResult, StatCard } from "../type";

type Params = {
  stats: StatCard[];
  recentResults: RecentResult[];
  healthSummary: HealthSummary;
  activity: ActivityItem[];
};

const store = (): Params => ({
  stats: [],
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
