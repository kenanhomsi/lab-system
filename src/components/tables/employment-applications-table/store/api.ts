import type { EmploymentApplicationStatus, EmploymentApplicationsResponse } from "../types";

type Params = {
  applicationsData: EmploymentApplicationsResponse;
  isPending: boolean;
  refetchApplications: () => void;
  updateStatus: (payload: {
    id: number;
    status: EmploymentApplicationStatus;
    notes?: string;
  }) => Promise<unknown>;
  isUpdatingStatus: boolean;
  deleteApplication: (id: number) => Promise<unknown>;
  isDeleting: boolean;
};

const store = (): Params => ({
  applicationsData: {
    items: [],
    page: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
  isPending: false,
  refetchApplications: () => {},
  updateStatus: async () => null,
  isUpdatingStatus: false,
  deleteApplication: async () => null,
  isDeleting: false,
});

export { store as apiStore };
export type { Params as apiParams };
