type FindAllQueryParams = {
  Page?: string;
  PageSize?: string;
};

type FindAllRoleParams = {
  query?: FindAllQueryParams;
};

type CreateRoleParams = {
  name: string;
};

type FindOneRoleParams = {
  id: string;
};

type UpdateRoleParams = {
  id: string;
  name: string;
};

type DeleteRoleParams = {
  id: string;
};

type GetRolePermissionsParams = {
  id: string;
};

type AssignRolePermissionParams = {
  id: string;
  permissionId: string;
};

type RemoveRolePermissionParams = {
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
