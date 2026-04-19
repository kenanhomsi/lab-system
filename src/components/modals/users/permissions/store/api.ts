import { PermissionsResponse } from "../types";

type Params = {
  getPermissionsApi: (id: string) => Promise<PermissionsResponse>;
  assignPermissionsApi: (params: { id: string; permissions: string[] }) => Promise<unknown>;
  replacePermissionsApi: (params: { id: string; permissions: string[] }) => Promise<unknown>;
  removePermissionApi: (params: { id: string; permission: string }) => Promise<unknown>;
};

const store = (): Params => ({
  getPermissionsApi: async () => ({}),
  assignPermissionsApi: async () => null,
  replacePermissionsApi: async () => null,
  removePermissionApi: async () => null,
});

export { store as apiStore };
export type { Params as apiParams };
