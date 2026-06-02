import type {
  InsuranceApprovalRequestDetail,
  InsuranceApprovalRequestItem,
  InsuranceApprovalRequestsListResponse,
} from "@/modules/insurance-approval-request";

export type InsuranceApprovalItem = InsuranceApprovalRequestItem;
export type InsuranceApprovalDetail = InsuranceApprovalRequestDetail;
export type InsuranceApprovalListResponse = InsuranceApprovalRequestsListResponse;

export type CreateInsuranceApprovalPayload = {
  insuredName: string;
  insuranceNumber: string;
  mobileNumber: string;
  insuranceCardImage: File;
  prescriptionImage: File;
};
