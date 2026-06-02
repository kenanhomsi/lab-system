import type {
  InsuranceApprovalRequestDetail,
  InsuranceApprovalRequestItem,
  InsuranceApprovalRequestsListResponse,
  InsuranceApprovalStatus,
} from "@/modules/insurance-approval-request";

export type InsuranceApprovalItem = InsuranceApprovalRequestItem;
export type InsuranceApprovalDetail = InsuranceApprovalRequestDetail;
export type InsuranceApprovalListResponse = InsuranceApprovalRequestsListResponse;
export type { InsuranceApprovalStatus };

export type UpdateStatusPayload = {
  id: number;
  status: InsuranceApprovalStatus;
  notes?: string;
  rejectionReason?: string;
};
