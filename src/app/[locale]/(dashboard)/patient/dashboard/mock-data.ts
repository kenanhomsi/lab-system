import type {
  ActivityItem,
  HealthSummary,
  RecentResult,
  StatCard,
  UpcomingAppointment,
} from "./type";

export const stats: StatCard[] = [
  {
    id: "upcomingAppointments",
    value: 3,
    trend: 12,
    iconKey: "calendar",
    accentColor: "light-dark(#00647e, #62d4fc)",
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
    accentColor: "light-dark(#705d00, #e9c400)",
    accentBg: "light-dark(#f9f3d6, rgba(112, 93, 0, 0.2))",
  },
];

export const upcomingAppointments: UpcomingAppointment[] = [
  {
    id: "u1",
    rowKey: "row1",
    doctorName: "Dr. Layla Karim",
    dateIso: "2026-04-18T09:30:00",
    statusVariant: "confirmed",
  },
  {
    id: "u2",
    rowKey: "row2",
    doctorName: "Dr. Omar Haddad",
    dateIso: "2026-04-22T14:00:00",
    statusVariant: "pending",
  },
  {
    id: "u3",
    rowKey: "row3",
    doctorName: "Dr. Layla Karim",
    dateIso: "2026-05-01T10:15:00",
    statusVariant: "confirmed",
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
  { id: "act1", rowKey: "a1", kind: "appointment" },
  { id: "act2", rowKey: "a2", kind: "result" },
  { id: "act3", rowKey: "a3", kind: "message" },
];
