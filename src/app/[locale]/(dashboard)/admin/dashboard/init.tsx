"use client";

import type { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";
import type {
  QueueStage,
  RecentAnalysis,
  StatCard,
  SystemHealth,
  TestDistItem,
  ThroughputBar,
} from "./type";

type Props = PropsWithChildren<{
  stats: StatCard[];
  queue: QueueStage[];
  throughput: ThroughputBar[];
  testDist: TestDistItem[];
  recentAnalysis: RecentAnalysis[];
  systemHealth: SystemHealth;
}>;

const Init = ({
  children,
  stats,
  queue,
  throughput,
  testDist,
  recentAnalysis,
  systemHealth,
}: Props) => {
  useMirrorRegistry("stats", stats);
  useMirrorRegistry("queue", queue);
  useMirrorRegistry("throughput", throughput);
  useMirrorRegistry("testDist", testDist);
  useMirrorRegistry("recentAnalysis", recentAnalysis);
  useMirrorRegistry("systemHealth", systemHealth);
  return <>{children}</>;
};

export default Init;
