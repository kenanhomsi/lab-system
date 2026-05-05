export type RoleItem = {
  id: string;
  name: string;
};

export type RolesResponse = RoleItem[];

export type RolePermissionItem = {
  id: string;
  name: string;
  description: string;
  createdAt?: string;
};

export type RolePermissionsResponse = RolePermissionItem[];

export type CreateRoleRequest = {
  name: string;
};

export type UpdateRoleRequest = CreateRoleRequest;

export type RoleModalType =
  | "create"
  | "edit"
  | "delete"
  | "permissions"
  | null;
