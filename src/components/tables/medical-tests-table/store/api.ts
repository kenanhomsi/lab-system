import type { UsersResponse } from "@/components/tables/users-table/types";
import { CreateMedicalTestParams, UpdateMedicalTestParams } from "@/modules/medical-tests/frontend/types";
import { MedicalTestsResponse } from "../types";

type Params = {
  medicalTestsData: MedicalTestsResponse;
  usersData: UsersResponse;
  isPending: boolean;
  refetchMedicalTests: () => void;
  refetchUsers: () => void;
  createMutation: { mutateAsync: (data: CreateMedicalTestParams) => Promise<unknown> };
  updateMutation: {
    mutateAsync: (params: { id: string; data: Omit<UpdateMedicalTestParams, "id"> }) => Promise<unknown>;
  };
  deleteMutation: { mutateAsync: (id: string) => Promise<unknown> };
  activateUser: (id: string) => Promise<unknown>;
  deactivateUser: (id: string) => Promise<unknown>;
  deleteUser: (id: string) => Promise<unknown>;
};

const emptyUsers: UsersResponse = {
  items: [],
  page: 1,
  pageSize: 20,
  totalCount: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

const store = (): Params => ({
  medicalTestsData: {
    items: [],
    page: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
  usersData: emptyUsers,
  isPending: false,
  refetchMedicalTests: () => {},
  refetchUsers: () => {},
  createMutation: { mutateAsync: async () => {} },
  updateMutation: { mutateAsync: async () => {} },
  deleteMutation: { mutateAsync: async () => {} },
  activateUser: async () => {},
  deactivateUser: async () => {},
  deleteUser: async () => {},
});

export { store as apiStore };
export type { Params as apiParams };
