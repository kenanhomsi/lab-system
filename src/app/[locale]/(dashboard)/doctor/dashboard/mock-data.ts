import type {
  PendingReferral,
  RecentPatient,
  StatCard,
  TodayAppointment,
  WeeklyBar,
} from "./type";

export const stats: StatCard[] = [
  {
    id: "todayPatients",
    value: 12,
    trend: 8,
    iconKey: "users",
    accentColor: "light-dark(#00647e, #62d4fc)",
    accentBg: "light-dark(#e4f4f8, rgba(0, 100, 126, 0.2))",
  },
  {
    id: "pendingReferrals",
    value: 5,
    trend: -12,
    iconKey: "calendar",
    accentColor: "light-dark(#705d00, #e9c400)",
    accentBg: "light-dark(#f9f3d6, rgba(112, 93, 0, 0.2))",
  },
  {
    id: "completedToday",
    value: 7,
    trend: 15,
    iconKey: "activity",
    accentColor: "light-dark(#004d62, #59c7ef)",
    accentBg: "light-dark(#d6edf4, rgba(0, 77, 98, 0.2))",
  },
];

export const todayAppointments: TodayAppointment[] = [
  {
    id: "a1",
    rowKey: "row1",
    patientName: "Sara Al-Masri",
    timeIso: "2026-04-13T09:00:00",
    visitType: "followUp",
    statusVariant: "confirmed",
  },
  {
    id: "a2",
    rowKey: "row2",
    patientName: "Khaled Nasser",
    timeIso: "2026-04-13T10:15:00",
    visitType: "newPatient",
    statusVariant: "inProgress",
  },
  {
    id: "a3",
    rowKey: "row3",
    patientName: "Maya Haddad",
    timeIso: "2026-04-13T11:30:00",
    visitType: "labReview",
    statusVariant: "waiting",
  },
  {
    id: "a4",
    rowKey: "row4",
    patientName: "Omar Fares",
    timeIso: "2026-04-13T14:00:00",
    visitType: "followUp",
    statusVariant: "confirmed",
  },
];

export const pendingReferrals: PendingReferral[] = [
  {
    id: "ref1",
    rowKey: "r1",
    patientName: "Lina Khoury",
    testSummary: "CBC, lipid panel",
    statusVariant: "urgent",
  },
  {
    id: "ref2",
    rowKey: "r2",
    patientName: "Rami Saad",
    testSummary: "HbA1c, renal panel",
    statusVariant: "pending",
  },
  {
    id: "ref3",
    rowKey: "r3",
    patientName: "Nadia Issa",
    testSummary: "Thyroid profile",
    statusVariant: "pending",
  },
];

export const recentPatients: RecentPatient[] = [
  {
    id: "rp1",
    rowKey: "p1",
    patientName: "Hassan Mousa",
    lastVisitIso: "2026-04-10",
  },
  {
    id: "rp2",
    rowKey: "p2",
    patientName: "Dina Rahal",
    lastVisitIso: "2026-04-08",
  },
  {
    id: "rp3",
    rowKey: "p3",
    patientName: "Yousef Diab",
    lastVisitIso: "2026-04-05",
  },
];

export const weeklySummary: WeeklyBar[] = [
  { dayKey: "mon", value: 18 },
  { dayKey: "tue", value: 22 },
  { dayKey: "wed", value: 16 },
  { dayKey: "thu", value: 24 },
  { dayKey: "fri", value: 14 },
];
