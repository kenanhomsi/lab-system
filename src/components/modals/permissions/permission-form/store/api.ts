import {
  CreatePermissionRequest,
  UpdatePermissionRequest,
} from "@/components/tables/permissions-table/types";

type Params = {
  createPermissionApi: (payload: CreatePermissionRequest) => Promise<unknown>;
  updatePermissionApi: (id: string, payload: UpdatePermissionRequest) => Promise<unknown>;
};

const store = (): Params => ({
  createPermissionApi: async () => null,
  updatePermissionApi: async () => null,
});

export { store as apiStore };
export type { Params as apiParams };
