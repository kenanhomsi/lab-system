import { CreateVacantJobParams, UpdateVacantJobParams } from "@/modules/vacant-jobs/frontend/types";
import { VacantJobsResponse } from "../types";

type Params = {
  vacantJobsData: VacantJobsResponse;
  isPending: boolean;
  refetchVacantJobs: () => void;
  createMutation: { mutateAsync: (data: CreateVacantJobParams) => Promise<unknown> };
  updateMutation: {
    mutateAsync: (params: { id: string; data: Omit<UpdateVacantJobParams, "id"> }) => Promise<unknown>;
  };
  deleteMutation: { mutateAsync: (id: string) => Promise<unknown> };
};

const store = (): Params => ({
  vacantJobsData: {
    items: [],
    page: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
  isPending: false,
  refetchVacantJobs: () => {},
  createMutation: { mutateAsync: async () => {} },
  updateMutation: { mutateAsync: async () => {} },
  deleteMutation: { mutateAsync: async () => {} },
});

export { store as apiStore };
export type { Params as apiParams };
