import {
  CreateRoleRequest,
  RolePermissionsResponse,
  RolesResponse,
  UpdateRoleRequest,
} from "../types";

type Params = {
  rolesData: RolesResponse;
  isPending: boolean;
  refetchRoles: () => void;
  createRole: (payload: CreateRoleRequest) => Promise<unknown>;
  updateRole: (id: string, payload: UpdateRoleRequest) => Promise<unknown>;
  deleteRole: (id: string) => Promise<unknown>;
  getRolePermissions: (id: string) => Promise<RolePermissionsResponse>;
  assignRolePermission: (id: string, permissionId: string) => Promise<unknown>;
  removeRolePermission: (id: string, permissionId: string) => Promise<unknown>;
};

const store = (): Params => ({
  rolesData: [],
  isPending: false,
  refetchRoles: () => {},
  createRole: async () => null,
  updateRole: async () => null,
  deleteRole: async () => null,
  getRolePermissions: async () => [],
  assignRolePermission: async () => null,
  removeRolePermission: async () => null,
});

export { store as apiStore };
export type { Params as apiParams };
