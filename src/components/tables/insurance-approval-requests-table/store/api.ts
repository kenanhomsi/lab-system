import type { InsuranceApprovalListResponse, UpdateStatusPayload } from "../types";

type Params = {
  requestsData: InsuranceApprovalListResponse;
  isPending: boolean;
  refetchRequests: () => void;
  updateStatus: (payload: UpdateStatusPayload) => Promise<unknown>;
  isUpdatingStatus: boolean;
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
  updateStatus: async () => null,
  isUpdatingStatus: false,
  removeRequest: async () => {},
  isDeleting: false,
});

export { store as apiStore };
export type { Params as apiParams };
