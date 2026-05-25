const COMPLAINT_STATUSES = ["Pending", "InReview", "Resolved", "Rejected"] as const;

type ComplaintStatus = (typeof COMPLAINT_STATUSES)[number];

const normalizeComplaintStatus = (value: string): ComplaintStatus | null => {
  const key = value.replace(/[\s_-]/g, "").toLowerCase();
  const map: Record<string, ComplaintStatus> = {
    pending: "Pending",
    inreview: "InReview",
    resolved: "Resolved",
    rejected: "Rejected",
  };
  return map[key] ?? null;
};

export { COMPLAINT_STATUSES, normalizeComplaintStatus };
export type { ComplaintStatus };
