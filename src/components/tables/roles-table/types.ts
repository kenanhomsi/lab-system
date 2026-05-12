export type RoleItem = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  items: { id: string; name: string }[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export type RolesResponse = RoleItem;

export type CreateRoleRequest = {
  name: string;
};

export type UpdateRoleRequest = CreateRoleRequest;

export type RoleModalType = "create" | "edit" | "delete" | null;
