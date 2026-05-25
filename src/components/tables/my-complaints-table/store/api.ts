import { ComplaintsResponse, CreateComplaintPayload } from "../types";

type Params = {
  complaintsData: ComplaintsResponse;
  isPending: boolean;
  refetchComplaints: () => void;
  createComplaint: (payload: CreateComplaintPayload) => Promise<unknown>;
  isCreating: boolean;
};

const store = (): Params => ({
  complaintsData: {
    items: [],
    page: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
  isPending: false,
  refetchComplaints: () => {},
  createComplaint: async () => null,
  isCreating: false,
});

export { store as apiStore };
export type { Params as apiParams };
