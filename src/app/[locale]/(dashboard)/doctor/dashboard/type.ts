export type StatCardId = "todayPatients" | "pendingReferrals" | "completedToday";

export type StatCard = {
  id: StatCardId;
  value: number;
  trend: number;
  iconKey: "users" | "calendar" | "activity";
  accentColor: string;
  accentBg: string;
};

export type PendingReferral = {
  id: string;
  rowKey: "r1" | "r2" | "r3";
  patientName: string;
  testSummary: string;
  statusVariant: "pending" | "urgent";
};

export type RecentPatient = {
  id: string;
  rowKey: "p1" | "p2" | "p3";
  patientName: string;
  lastVisitIso: string;
};

export type WeeklyBar = {
  dayKey: "mon" | "tue" | "wed" | "thu" | "fri";
  value: number;
};
