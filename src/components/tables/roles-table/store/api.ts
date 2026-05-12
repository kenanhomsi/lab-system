import { CreateRoleRequest, RolesResponse, UpdateRoleRequest } from "../types";

type Params = {
  rolesData: RolesResponse;
  isPending: boolean;
  refetchRoles: () => void;
  createRole: (payload: CreateRoleRequest) => Promise<unknown>;
  updateRole: (id: string, payload: UpdateRoleRequest) => Promise<unknown>;
  deleteRole: (id: string) => Promise<unknown>;
};

const store = (): Params => ({
  rolesData: {
    hasNextPage: false,
    hasPreviousPage: false,
    items: [],
    page: 1,
    pageSize: 0,
    totalCount: 0,
    totalPages: 0,
  },
  isPending: false,
  refetchRoles: () => {},
  createRole: async () => null,
  updateRole: async () => null,
  deleteRole: async () => null,
});

export { store as apiStore };
export type { Params as apiParams };
