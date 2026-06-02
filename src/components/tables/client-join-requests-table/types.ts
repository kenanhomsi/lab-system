import type {
  ClientJoinRequest,
  ClientJoinRequestListResponse,
} from "@/types/client-join-request";
import type { ClientJoinRequestStatus } from "@/lib/client-join-request-status";

export type ClientJoinRequestItem = ClientJoinRequest;
export type ClientJoinRequestList = ClientJoinRequestListResponse;
export type { ClientJoinRequestStatus };

export type UpdateStatusPayload = {
  id: number;
  status: string;
  notes: string;
};
