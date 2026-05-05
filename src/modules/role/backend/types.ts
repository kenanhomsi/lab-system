type AuthParams = {
  token: string;
};

type FindAllQueryParams = {
  Page?: string;
  PageSize?: string;
};

type FindAllRoleParams = AuthParams & {
  query?: FindAllQueryParams;
};

type CreateRoleParams = AuthParams & {
  name: string;
};

type FindOneRoleParams = AuthParams & {
  id: string;
};

type UpdateRoleParams = AuthParams & {
  id: string;
  name: string;
};

type DeleteRoleParams = AuthParams & {
  id: string;
};

type GetRolePermissionsParams = AuthParams & {
  id: string;
};

type AssignRolePermissionParams = AuthParams & {
  id: string;
  permissionId: string;
};

type RemoveRolePermissionParams = AuthParams & {
  id: string;
  permissionId: string;
};

export type {
  AssignRolePermissionParams,
  CreateRoleParams,
  DeleteRoleParams,
  FindAllQueryParams,
  FindAllRoleParams,
  FindOneRoleParams,
  GetRolePermissionsParams,
  RemoveRolePermissionParams,
  UpdateRoleParams,
};
