type FindAllQueryParams = {
  Page?: string;
  PageSize?: string;
};

type FindAllPermissionParams = {
  query?: FindAllQueryParams;
};

type CreatePermissionParams = {
  name: string;
  description: string;
};

type FindOnePermissionParams = {
  id: string;
};

type UpdatePermissionParams = {
  id: string;
  description: string;
};

type DeletePermissionParams = {
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
