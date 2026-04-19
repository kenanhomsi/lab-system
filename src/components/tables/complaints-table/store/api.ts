import { ComplaintStatus, ComplaintsResponse } from "../types";

type Params = {
  complaintsData: ComplaintsResponse;
  isPending: boolean;
  refetchComplaints: () => void;
  updateComplaintStatus: (id: number, status: ComplaintStatus) => Promise<unknown>;
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
  updateComplaintStatus: async () => null,
});

export { store as apiStore };
export type { Params as apiParams };
