import type { IconType } from "react-icons";
import {
  FiActivity,
  FiAlertCircle,
  FiCheckCircle,
  FiClipboard,
  FiFileText,
  FiHeart,
  FiLayers,
  FiTrendingUp,
  FiUserCheck,
  FiUsers,
} from "react-icons/fi";
import type { DashboardSummary } from "@/modules/dashboard";

export type SummaryKey = keyof DashboardSummary;

export type SummaryMeta = {
  icon: IconType;
  accentColor: string;
  accentBg: string;
};

export const SUMMARY_META: Record<SummaryKey, SummaryMeta> = {
  totalUsers: { icon: FiUsers, accentColor: "#2563eb", accentBg: "rgba(37, 99, 235, 0.12)" },
  totalDoctors: { icon: FiUserCheck, accentColor: "#7c3aed", accentBg: "rgba(124, 58, 237, 0.12)" },
  totalPatients: { icon: FiHeart, accentColor: "#db2777", accentBg: "rgba(219, 39, 119, 0.12)" },
  totalLabPartners: { icon: FiActivity, accentColor: "#0891b2", accentBg: "rgba(8, 145, 178, 0.12)" },
  totalMedicalTests: { icon: FiLayers, accentColor: "#4f46e5", accentBg: "rgba(79, 70, 229, 0.12)" },
  totalTestRequests: { icon: FiClipboard, accentColor: "#ea580c", accentBg: "rgba(234, 88, 12, 0.12)" },
  totalResults: { icon: FiFileText, accentColor: "#059669", accentBg: "rgba(5, 150, 105, 0.12)" },
  completedResults: { icon: FiCheckCircle, accentColor: "#16a34a", accentBg: "rgba(22, 163, 74, 0.12)" },
  totalExternalPatients: { icon: FiUsers, accentColor: "#0d9488", accentBg: "rgba(13, 148, 136, 0.12)" },
  totalComplaints: { icon: FiAlertCircle, accentColor: "#dc2626", accentBg: "rgba(220, 38, 38, 0.12)" },
  totalTemplates: { icon: FiLayers, accentColor: "#6366f1", accentBg: "rgba(99, 102, 241, 0.12)" },
  totalRevenue: { icon: FiTrendingUp, accentColor: "#b45309", accentBg: "rgba(180, 83, 9, 0.12)" },
};

export const ADMIN_SUMMARY_KEYS: SummaryKey[] = [
  "totalUsers",
  "totalDoctors",
  "totalPatients",
  "totalLabPartners",
  "totalTestRequests",
  "totalResults",
  "totalRevenue",
  "totalComplaints",
];

export const PATIENT_SUMMARY_KEYS: SummaryKey[] = [
  "totalTestRequests",
  "totalResults",
  "completedResults",
  "totalComplaints",
  "totalRevenue",
  "totalMedicalTests",
];

export const DOCTOR_SUMMARY_KEYS: SummaryKey[] = [
  "totalTestRequests",
  "totalResults",
  "completedResults",
  "totalExternalPatients",
  "totalComplaints",
  "totalMedicalTests",
];

/** Top metrics highlighted in the hero strip */
export const HERO_HIGHLIGHT_KEYS: SummaryKey[] = [
  "totalTestRequests",
  "totalResults",
  "totalRevenue",
];

export type HeroPillConfig = {
  summaryKey: SummaryKey;
  /** Translation key under `admin.dashboard` (e.g. `stats.labOrders`) */
  labelKey: string;
};

/** Admin hero pills matching the reference dashboard mock */
export const ADMIN_HERO_PILLS: HeroPillConfig[] = [
  { summaryKey: "totalTestRequests", labelKey: "stats.labOrders" },
  { summaryKey: "totalLabPartners", labelKey: "stats.partners" },
  { summaryKey: "totalResults", labelKey: "stats.pendingRelease" },
];
