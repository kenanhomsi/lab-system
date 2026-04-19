import { CreateRoleRequest, UpdateRoleRequest } from "@/components/tables/roles-table/types";

type Params = {
  createRoleApi: (payload: CreateRoleRequest) => Promise<unknown>;
  updateRoleApi: (id: string, payload: UpdateRoleRequest) => Promise<unknown>;
};

const store = (): Params => ({
  createRoleApi: async () => null,
  updateRoleApi: async () => null,
});

export { store as apiStore };
export type { Params as apiParams };
