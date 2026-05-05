import type {
  QueueStage,
  RecentAnalysis,
  StatCard,
  SystemHealth,
  TestDistItem,
  ThroughputBar,
} from "./type";

export const stats: StatCard[] = [
  {
    id: "labOrders",
    value: 12842,
    trend: 14,
    iconKey: "activity",
    accentColor: "light-dark(#009cc2, #5dd4ed)",
    accentBg: "light-dark(#e4f4f8, rgba(0, 156, 194, 0.2))",
  },
  {
    id: "partners",
    value: 48,
    trend: 3,
    iconKey: "users",
    accentColor: "light-dark(#003d4d, #6bd8f0)",
    accentBg: "light-dark(#d6edf4, rgba(0, 61, 77, 0.2))",
  },
  {
    id: "pendingRelease",
    value: 127,
    trend: -5.2,
    iconKey: "calendar",
    accentColor: "light-dark(#5c4d00, #ffd700)",
    accentBg: "light-dark(#fff8d6, rgba(255, 215, 0, 0.2))",
  },
];

export const queue: QueueStage[] = [
  {
    id: "new",
    count: 248,
    color: "light-dark(#009cc2, #5dd4ed)",
    bgColor: "light-dark(#ddf0f5, rgba(0, 156, 194, 0.2))",
    iconKey: "monitor",
    statusVariant: "positive",
  },
  {
    id: "received",
    count: 1102,
    color: "light-dark(#00a3c4, #6bd8f0)",
    bgColor: "light-dark(#c2ecf4, rgba(0, 156, 194, 0.2))",
    iconKey: "flask",
    statusVariant: "waiting",
  },
  {
    id: "processing",
    count: 843,
    color: "light-dark(#5c4d00, #ffd700)",
    bgColor: "light-dark(#fff8d6, rgba(255, 215, 0, 0.2))",
    iconKey: "loader",
    statusVariant: "active",
    accent: true,
  },
  {
    id: "ready",
    count: 459,
    color: "light-dark(#003d4d, #5dd4ed)",
    bgColor: "light-dark(#ddf0f5, rgba(0, 61, 77, 0.2))",
    iconKey: "check",
    statusVariant: "verified",
  },
];

export const throughput: ThroughputBar[] = [
  { monthKey: "jan", value: 620 },
  { monthKey: "feb", value: 890 },
  { monthKey: "mar", value: 1340 },
  { monthKey: "apr", value: 1100 },
  { monthKey: "may", value: 780 },
  { monthKey: "jun", value: 950 },
  { monthKey: "jul", value: 1260 },
  { monthKey: "aug", value: 1050 },
  { monthKey: "sep", value: 1180 },
];

export const testDist: TestDistItem[] = [
  { id: "molecular", pct: 42, color: "#009cc2" },
  { id: "hematology", pct: 28, color: "#00a3c4" },
  { id: "immunology", pct: 15, color: "#a4a4a4" },
  { id: "chemistry", pct: 15, color: "#ffd700" },
];

export const systemHealth: SystemHealth = {
  uptime: "99.98%",
  latency: "12ms",
};

export const recentAnalysis: RecentAnalysis[] = [
  {
    id: "r1",
    rowKey: "row1",
    patientId: "LAB-94285-BX",
    statusVariant: "processing",
  },
  {
    id: "r2",
    rowKey: "row2",
    patientId: "LAB-12059-CY",
    statusVariant: "critical",
  },
  {
    id: "r3",
    rowKey: "row3",
    patientId: "LAB-88432-AZ",
    statusVariant: "completed",
  },
];
