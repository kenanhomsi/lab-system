import {
  PermissionCatalogItem,
  RolePermissionItem,
} from "../types";

type Params = {
  rolePermissions: RolePermissionItem[];
  isRolePermissionsLoading: boolean;
  catalogPermissions: PermissionCatalogItem[];
  isCatalogLoading: boolean;
  refetchRolePermissions: () => void;
  assignRolePermissionApi: (id: string, permissionId: string) => Promise<unknown>;
  removeRolePermissionApi: (id: string, permissionId: string) => Promise<unknown>;
};

const store = (): Params => ({
  rolePermissions: [],
  isRolePermissionsLoading: false,
  catalogPermissions: [],
  isCatalogLoading: false,
  refetchRolePermissions: () => {},
  assignRolePermissionApi: async () => null,
  removeRolePermissionApi: async () => null,
});

export { store as apiStore };
export type { Params as apiParams };
