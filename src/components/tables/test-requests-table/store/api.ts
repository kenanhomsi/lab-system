import {
  CreateTestRequestFrontendParams,
  UpdateTestRequestFrontendParams,
} from "@/modules/TestRequests";
import { TestRequestsResponse } from "../types";

type Params = {
  testRequestsData: TestRequestsResponse;
  isPending: boolean;
  refetchTestRequests: () => void;
  createMutation: { mutateAsync: (data: CreateTestRequestFrontendParams) => Promise<unknown> };
  updateMutation: {
    mutateAsync: (params: { id: string; data: Omit<UpdateTestRequestFrontendParams, "id"> }) => Promise<unknown>;
  };
  deleteMutation: { mutateAsync: (id: string) => Promise<unknown> };
};

const store = (): Params => ({
  testRequestsData: {
    items: [],
    page: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
  isPending: false,
  refetchTestRequests: () => {},
  createMutation: { mutateAsync: async () => {} },
  updateMutation: { mutateAsync: async () => {} },
  deleteMutation: { mutateAsync: async () => {} },
});

export { store as apiStore };
export type { Params as apiParams };
