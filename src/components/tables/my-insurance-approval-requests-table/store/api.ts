import type { CreateInsuranceApprovalPayload, InsuranceApprovalListResponse } from "../types";

type Params = {
  requestsData: InsuranceApprovalListResponse;
  isPending: boolean;
  refetchRequests: () => void;
  createRequest: (payload: CreateInsuranceApprovalPayload) => Promise<unknown>;
  isCreating: boolean;
  removeRequest: (id: number) => Promise<void>;
  isDeleting: boolean;
};

const store = (): Params => ({
  requestsData: {
    items: [],
    page: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
  isPending: false,
  refetchRequests: () => {},
  createRequest: async () => null,
  isCreating: false,
  removeRequest: async () => {},
  isDeleting: false,
});

export { store as apiStore };
export type { Params as apiParams };
