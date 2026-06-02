export type ClientJoinRequest = {
  id: number;
  managerName: string;
  labName: string;
  mobileNumber: string;
  email: string;
  address: string;
  additionalInfo: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export type ClientJoinRequestListResponse = {
  items: ClientJoinRequest[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type ClientJoinRequestCreatePayload = {
  managerName: string;
  labName: string;
  mobileNumber: string;
  email: string;
  address: string;
  additionalInfo?: string;
};

export type ClientJoinRequestStatusPayload = {
  status: string;
  notes: string;
};
