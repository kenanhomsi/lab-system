import {
  CreatePermissionRequest,
  PermissionsResponse,
  UpdatePermissionRequest,
} from "../types";

type Params = {
  permissionsData: PermissionsResponse;
  isPending: boolean;
  refetchPermissions: () => void;
  createPermission: (payload: CreatePermissionRequest) => Promise<unknown>;
  updatePermission: (id: string, payload: UpdatePermissionRequest) => Promise<unknown>;
  deletePermission: (id: string) => Promise<unknown>;
};

const store = (): Params => ({
  permissionsData: [],
  isPending: false,
  refetchPermissions: () => {},
  createPermission: async () => null,
  updatePermission: async () => null,
  deletePermission: async () => null,
});

export { store as apiStore };
export type { Params as apiParams };
