import { INSURANCE_APPROVAL_STATUSES } from "@/modules/insurance-approval-request";

type InsuranceApprovalStatus = (typeof INSURANCE_APPROVAL_STATUSES)[number];

const normalizeInsuranceApprovalStatus = (value: string): InsuranceApprovalStatus | null => {
  const key = value.replace(/[\s_-]/g, "").toLowerCase();
  const map: Record<string, InsuranceApprovalStatus> = {
    new: "New",
    underreview: "UnderReview",
    approved: "Approved",
    rejected: "Rejected",
    needmoreinfo: "NeedMoreInfo",
  };
  return map[key] ?? null;
};

export { INSURANCE_APPROVAL_STATUSES, normalizeInsuranceApprovalStatus };
export type { InsuranceApprovalStatus };
