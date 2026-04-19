export type RoleItem = {
  id: string;
  name: string;
};

export type RolesResponse = RoleItem[];

export type CreateRoleRequest = {
  name: string;
};

export type UpdateRoleRequest = CreateRoleRequest;

export type RoleModalType = "create" | "edit" | "delete" | null;
