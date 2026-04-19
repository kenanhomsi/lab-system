export type StatCardId = "labOrders" | "partners" | "pendingRelease";

export type StatCard = {
  id: StatCardId;
  value: number;
  trend: number;
  iconKey: "activity" | "users" | "calendar";
  accentColor: string;
  accentBg: string;
};

export type QueueStageStatus = "positive" | "waiting" | "active" | "verified";

export type QueueStageId = "new" | "received" | "processing" | "ready";

export type QueueStage = {
  id: QueueStageId;
  count: number;
  color: string;
  bgColor: string;
  iconKey: "monitor" | "flask" | "loader" | "check";
  statusVariant: QueueStageStatus;
  accent?: boolean;
};

export type ThroughputBar = {
  monthKey: string;
  value: number;
};

export type TestDistId = "molecular" | "hematology" | "immunology" | "chemistry";

export type TestDistItem = {
  id: TestDistId;
  pct: number;
  color: string;
};

export type RecentRowKey = "row1" | "row2" | "row3";

export type RecentAnalysis = {
  id: string;
  rowKey: RecentRowKey;
  patientId: string;
  statusVariant: "processing" | "critical" | "completed";
};

export type SystemHealth = {
  uptime: string;
  latency: string;
};
