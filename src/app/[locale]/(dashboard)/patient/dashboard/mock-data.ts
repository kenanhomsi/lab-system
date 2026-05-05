import type {
  ActivityItem,
  HealthSummary,
  RecentResult,
  StatCard,
} from "./type";

export const stats: StatCard[] = [
  {
    id: "openLabRequests",
    value: 3,
    trend: 12,
    iconKey: "calendar",
    accentColor: "light-dark(#009cc2, #5dd4ed)",
    accentBg: "light-dark(#e4f4f8, rgba(0, 100, 126, 0.2))",
  },
  {
    id: "completedVisits",
    value: 14,
    trend: 4,
    iconKey: "check",
    accentColor: "light-dark(#004d62, #59c7ef)",
    accentBg: "light-dark(#d6edf4, rgba(0, 77, 98, 0.2))",
  },
  {
    id: "pendingResults",
    value: 2,
    trend: -8,
    iconKey: "activity",
    accentColor: "light-dark(#6b5a00, #ffd700)",
    accentBg: "light-dark(#f9f3d6, rgba(112, 93, 0, 0.2))",
  },
];

export const recentResults: RecentResult[] = [
  {
    id: "res1",
    rowKey: "r1",
    testCode: "CBC-2026-041",
    statusVariant: "ready",
  },
  {
    id: "res2",
    rowKey: "r2",
    testCode: "LIPID-2026-038",
    statusVariant: "processing",
  },
  {
    id: "res3",
    rowKey: "r3",
    testCode: "HBA1C-2026-035",
    statusVariant: "scheduled",
  },
];

export const healthSummary: HealthSummary = {
  lastCheckup: "2026-03-12",
  bloodType: "A+",
  nextReminder: "2026-06-01",
};

export const activity: ActivityItem[] = [
  { id: "act1", rowKey: "a1", kind: "request" },
  { id: "act2", rowKey: "a2", kind: "result" },
  { id: "act3", rowKey: "a3", kind: "message" },
];
