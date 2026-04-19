import type {
  QueueStage,
  RecentAnalysis,
  StatCard,
  SystemHealth,
  TestDistItem,
  ThroughputBar,
} from "../type";

type Params = {
  stats: StatCard[];
  queue: QueueStage[];
  throughput: ThroughputBar[];
  testDist: TestDistItem[];
  recentAnalysis: RecentAnalysis[];
  systemHealth: SystemHealth;
};

const store = (): Params => ({
  stats: [],
  queue: [],
  throughput: [],
  testDist: [],
  recentAnalysis: [],
  systemHealth: { uptime: "—", latency: "—" },
});

export { store as initStore };
export type { Params as initParams };
