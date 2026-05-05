import {
  CreateTestResultFrontendParams,
  UpdateTestResultFrontendParams,
} from "@/modules/TestResults";
import { TestResultsResponse } from "../types";

type Params = {
  testResultsData: TestResultsResponse;
  isPending: boolean;
  refetchTestResults: () => void;
  createMutation: { mutateAsync: (data: CreateTestResultFrontendParams) => Promise<unknown> };
  updateMutation: {
    mutateAsync: (params: { id: string; data: Omit<UpdateTestResultFrontendParams, "id"> }) => Promise<unknown>;
  };
  deleteMutation: { mutateAsync: (id: string) => Promise<unknown> };
};

const store = (): Params => ({
  testResultsData: {
    items: [],
    page: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
  isPending: false,
  refetchTestResults: () => {},
  createMutation: { mutateAsync: async () => {} },
  updateMutation: { mutateAsync: async () => {} },
  deleteMutation: { mutateAsync: async () => {} },
});

export { store as apiStore };
export type { Params as apiParams };
