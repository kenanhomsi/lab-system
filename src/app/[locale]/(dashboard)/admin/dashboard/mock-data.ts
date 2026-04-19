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
    accentColor: "light-dark(#00647e, #62d4fc)",
    accentBg: "light-dark(#e4f4f8, rgba(0, 100, 126, 0.2))",
  },
  {
    id: "partners",
    value: 48,
    trend: 3,
    iconKey: "users",
    accentColor: "light-dark(#004d62, #59c7ef)",
    accentBg: "light-dark(#d6edf4, rgba(0, 77, 98, 0.2))",
  },
  {
    id: "pendingRelease",
    value: 127,
    trend: -5.2,
    iconKey: "calendar",
    accentColor: "light-dark(#705d00, #e9c400)",
    accentBg: "light-dark(#f9f3d6, rgba(112, 93, 0, 0.2))",
  },
];

export const queue: QueueStage[] = [
  {
    id: "new",
    count: 248,
    color: "light-dark(#00647e, #62d4fc)",
    bgColor: "light-dark(#ddf0f5, rgba(0, 100, 126, 0.2))",
    iconKey: "monitor",
    statusVariant: "positive",
  },
  {
    id: "received",
    count: 1102,
    color: "light-dark(#007f9e, #59c7ef)",
    bgColor: "light-dark(#d0ecf4, rgba(0, 127, 158, 0.2))",
    iconKey: "flask",
    statusVariant: "waiting",
  },
  {
    id: "processing",
    count: 843,
    color: "light-dark(#705d00, #e9c400)",
    bgColor: "light-dark(#f9f3d6, rgba(112, 93, 0, 0.2))",
    iconKey: "loader",
    statusVariant: "active",
    accent: true,
  },
  {
    id: "ready",
    count: 459,
    color: "light-dark(#004d62, #62d4fc)",
    bgColor: "light-dark(#ddf0f5, rgba(0, 77, 98, 0.2))",
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
  { id: "molecular", pct: 42, color: "#00647e" },
  { id: "hematology", pct: 28, color: "#007f9e" },
  { id: "immunology", pct: 15, color: "#705d00" },
  { id: "chemistry", pct: 15, color: "#c8a900" },
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
