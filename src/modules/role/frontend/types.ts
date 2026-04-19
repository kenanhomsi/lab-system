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

export type {
  CreateRoleParams,
  DeleteRoleParams,
  FindAllQueryParams,
  FindAllRoleParams,
  FindOneRoleParams,
  UpdateRoleParams,
};
