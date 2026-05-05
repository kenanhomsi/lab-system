export type UserItem = {
  id: string;
  email: string;
  fullName: string;
  city: string | null;
  phoneNumber: string | null;
  isActive: boolean;
  emailConfirmed: boolean;
  createdAt: string;
  roles?: string[];
};

export type UsersResponse = {
  items: UserItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type CreateUserRequest = {
  email: string;
  password: string;
  fullName: string;
  city: string;
  phoneNumber: string;
  roles: string[];
  profileMetadata: string;
};

export type UpdateUserRequest = {
  fullName: string;
  city: string;
  phoneNumber: string;
  profileMetadata: string;
};

export type AssignRolesRequest = {
  roles: string[];
};

export type RemoveRolesRequest = {
  roles: string[];
};

export type AssignPermissionsRequest = {
  permissions: string[];
};

export type ReplacePermissionsRequest = {
  permissions: string[];
};

export type UserPermissionsResponse = {
  permissions?: string[];
  [key: string]: unknown;
};

export type UserModalType =
  | "create"
  | "edit"
  | "delete"
  | "roles"
  | "permissions";
