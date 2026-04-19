type FindAllQueryParams = {
  Page?: string;
  PageSize?: string;
  Search?: string;
  IsActive?: string;
  Role?: string;
  SortBy?: string;
  SortDesc?: string;
};

type FindAllUserParams = {
  query?: FindAllQueryParams;
};

type FindOneUserParams = {
  id: string;
};

type CreateUserParams = {
  email: string;
  password: string;
  fullName: string;
  city: string;
  phoneNumber: string;
  roles: string[];
  profileMetadata: string;
};

type UpdateUserParams = {
  id: string;
  fullName: string;
  city: string;
  phoneNumber: string;
  profileMetadata: string;
};

type DeleteUserParams = {
  id: string;
};

type ActivateUserParams = {
  id: string;
};

type DeactivateUserParams = {
  id: string;
};

type AssignRolesParams = {
  id: string;
  roles: string[];
};

type RemoveRolesParams = {
  id: string;
  roles: string[];
};

type GetPermissionsParams = {
  id: string;
};

type AssignPermissionsParams = {
  id: string;
  permissions: string[];
};

type ReplacePermissionsParams = {
  id: string;
  permissions: string[];
};

type RemovePermissionParams = {
  id: string;
  permission: string;
};

type GetMeParams = Record<string, never>;

type UpdateMeParams = {
  fullName: string;
  city: string;
  phoneNumber: string;
  profileMetadata: string;
};

type ChangePasswordMeParams = {
  currentPassword: string;
  newPassword: string;
};

type RequestDeletionMeParams = Record<string, never>;

export type {
  ActivateUserParams,
  AssignPermissionsParams,
  AssignRolesParams,
  ChangePasswordMeParams,
  CreateUserParams,
  DeactivateUserParams,
  DeleteUserParams,
  FindAllQueryParams,
  FindAllUserParams,
  FindOneUserParams,
  GetMeParams,
  GetPermissionsParams,
  RemovePermissionParams,
  RemoveRolesParams,
  ReplacePermissionsParams,
  RequestDeletionMeParams,
  UpdateMeParams,
  UpdateUserParams,
};
