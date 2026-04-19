export type StatCardId = "upcomingAppointments" | "completedVisits" | "pendingResults";

export type StatCard = {
  id: StatCardId;
  value: number;
  trend: number;
  iconKey: "calendar" | "check" | "activity";
  accentColor: string;
  accentBg: string;
};

export type UpcomingAppointment = {
  id: string;
  rowKey: "row1" | "row2" | "row3";
  doctorName: string;
  dateIso: string;
  statusVariant: "confirmed" | "pending";
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
  kind: "appointment" | "result" | "message";
};
