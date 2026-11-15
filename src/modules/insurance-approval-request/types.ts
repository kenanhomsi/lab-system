const INSURANCE_APPROVAL_STATUSES = [
  "New",
  "UnderReview",
  "Approved",
  "Rejected",
  "NeedMoreInfo",
] as const;

type InsuranceApprovalStatus = (typeof INSURANCE_APPROVAL_STATUSES)[number];

type InsuranceApprovalRequestItem = {
  id: number;
  patientId: string;
  patientName: string;
  insuranceCompanyId: number | null;
  insuranceCompanyName: string | null;
  insuredName: string;
  insuranceNumber: string;
  mobileNumber: string;
  status: InsuranceApprovalStatus | string;
  notes: string;
  rejectionReason: string;
  insuranceCardImageUrl?: string | null;
  insuranceCardOriginalFileName?: string | null;
  prescriptionImageUrl?: string | null;
  prescriptionOriginalFileName?: string | null;
  createdAt: string;
  updatedAt: string;
};

type InsuranceApprovalRequestDetail = InsuranceApprovalRequestItem & {
  insuranceCardImageUrl: string | null;
  insuranceCardOriginalFileName: string | null;
  prescriptionImageUrl: string | null;
  prescriptionOriginalFileName: string | null;
};

type InsuranceApprovalRequestsListResponse = {
  items: InsuranceApprovalRequestItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

type CreateInsuranceApprovalMessageResponse = {
  message: string;
};

export {
  INSURANCE_APPROVAL_STATUSES,
};
export type {
  CreateInsuranceApprovalMessageResponse,
  InsuranceApprovalRequestDetail,
  InsuranceApprovalRequestItem,
  InsuranceApprovalRequestsListResponse,
  InsuranceApprovalStatus,
};
