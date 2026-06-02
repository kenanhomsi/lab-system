import type {
  ContractServiceRequest,
  ContractServiceRequestListResponse,
} from "@/types/contract-service-request";
import type { ContractServiceRequestStatus } from "@/lib/contract-service-request-status";

export type ContractServiceRequestItem = ContractServiceRequest;
export type ContractServiceRequestList = ContractServiceRequestListResponse;
export type { ContractServiceRequestStatus };

export type UpdateStatusPayload = {
  id: number;
  status: string;
  notes: string;
};
