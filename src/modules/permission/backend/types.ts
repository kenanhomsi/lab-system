type AuthParams = {
  token: string;
};

type FindAllQueryParams = {
  Page?: string;
  PageSize?: string;
};

type FindAllPermissionParams = AuthParams & {
  query?: FindAllQueryParams;
};

type CreatePermissionParams = AuthParams & {
  name: string;
  description: string;
};

type FindOnePermissionParams = AuthParams & {
  id: string;
};

type UpdatePermissionParams = AuthParams & {
  id: string;
  description: string;
};

type DeletePermissionParams = AuthParams & {
  id: string;
};

export type {
  CreatePermissionParams,
  DeletePermissionParams,
  FindAllQueryParams,
  FindAllPermissionParams,
  FindOnePermissionParams,
  UpdatePermissionParams,
};
