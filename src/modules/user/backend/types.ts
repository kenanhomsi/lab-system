type FindAllQueryParams = {
  Page?: string;
  PageSize?: string;
  Search?: string;
  IsActive?: string;
  Role?: string;
  SortBy?: string;
  SortDesc?: string;
};

type AuthParams = {
  token: string;
};

type GetMeParams = AuthParams;

type UpdateMeParams = AuthParams & {
  fullName: string;
  city: string;
  phoneNumber: string;
  profileMetadata: string;
};

type ChangePasswordMeParams = AuthParams & {
  currentPassword: string;
  newPassword: string;
};

type RequestDeletionMeParams = AuthParams;

type FindAllUserParams = AuthParams & {
  query?: FindAllQueryParams;
};

type FindUserParams = AuthParams & {
  id: string;
};

type CreateUserParams = AuthParams & {
  email: string;
  password: string;
  fullName: string;
  city: string;
  phoneNumber: string;
  roles: string[];
  profileMetadata: string;
};

type UpdateUserBody = {
  fullName: string;
  city: string;
  phoneNumber: string;
  profileMetadata: string;
};

type UpdateUserParams = AuthParams & {
  id: string;
  fullName: string;
  city: string;
  phoneNumber: string;
  profileMetadata: string;
};

type DeleteUserParams = AuthParams & {
  id: string;
};

type ActivateUserParams = AuthParams & {
  id: string;
};

type DeactivateUserParams = AuthParams & {
  id: string;
};

type AssignRolesParams = AuthParams & {
  id: string;
  roles: string[];
};

type RemoveRolesParams = AuthParams & {
  id: string;
  roles: string[];
};

type GetPermissionsParams = AuthParams & {
  id: string;
};

type AssignPermissionsParams = AuthParams & {
  id: string;
  permissions: string[];
};

type ReplacePermissionsParams = AuthParams & {
  id: string;
  permissions: string[];
};

type RemovePermissionParams = AuthParams & {
  id: string;
  permission: string;
};

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
  FindUserParams,
  GetMeParams,
  GetPermissionsParams,
  RemovePermissionParams,
  RemoveRolesParams,
  ReplacePermissionsParams,
  RequestDeletionMeParams,
  UpdateMeParams,
  UpdateUserBody,
  UpdateUserParams,
};
