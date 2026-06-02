export type ContractType = "Individual" | "Organization";

export type ContractDuration = "ThreeMonths" | "SixMonths" | "OneYear";

export type ContractServiceRequest = {
  id: number;
  contractType: ContractType | string;
  responsibleName: string;
  organizationName: string;
  expectedSubscribersCount: number;
  contactNumber: string;
  email: string;
  address: string;
  contractDuration: ContractDuration | string;
  additionalInfo: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export type ContractServiceRequestListResponse = {
  items: ContractServiceRequest[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type ContractServiceRequestCreatePayload = {
  contractType: ContractType;
  responsibleName: string;
  organizationName: string;
  expectedSubscribersCount: number;
  contactNumber: string;
  email: string;
  address: string;
  contractDuration: ContractDuration;
  additionalInfo?: string;
};

export type ContractServiceRequestStatusPayload = {
  status: string;
  notes: string;
};
