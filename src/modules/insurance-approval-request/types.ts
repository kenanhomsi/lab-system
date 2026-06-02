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
  insuredName: string;
  insuranceNumber: string;
  mobileNumber: string;
  status: InsuranceApprovalStatus | string;
  notes: string;
  rejectionReason: string;
  createdAt: string;
  updatedAt: string;
};

type InsuranceApprovalRequestDetail = InsuranceApprovalRequestItem & {
  insuranceCardImageUrl: string;
  insuranceCardOriginalFileName: string;
  prescriptionImageUrl: string;
  prescriptionOriginalFileName: string;
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
