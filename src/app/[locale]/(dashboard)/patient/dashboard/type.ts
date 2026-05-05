export type StatCardId = "openLabRequests" | "completedVisits" | "pendingResults";

export type StatCard = {
  id: StatCardId;
  value: number;
  trend: number;
  iconKey: "calendar" | "check" | "activity";
  accentColor: string;
  accentBg: string;
};

export type RecentResult = {
  id: string;
  rowKey: "r1" | "r2" | "r3";
  testCode: string;
  statusVariant: "ready" | "processing" | "scheduled";
};

export type HealthSummary = {
  lastCheckup: string;
  bloodType: string;
  nextReminder: string;
};

export type ActivityItem = {
  id: string;
  rowKey: "a1" | "a2" | "a3";
  kind: "request" | "result" | "message";
};
