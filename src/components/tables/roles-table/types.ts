export type RoleAccessPolicy = {
  id: string;
  resource: string;
  action: string;
  effect: string;
  subjectType: string;
  subjectKey: string;
  priority: number;
  isEnabled: boolean;
  description: string | null;
  validFrom: string | null;
  validTo: string | null;
};

export type RoleTableItem = {
  id: string;
  name: string;
  accessPolicies: RoleAccessPolicy[];
};

export type RolesResponse = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  items: RoleTableItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export type CreateRoleRequest = {
  name: string;
};

export type UpdateRoleRequest = CreateRoleRequest;

export type RoleModalType = "create" | "edit" | "delete" | "permissions" | null;
