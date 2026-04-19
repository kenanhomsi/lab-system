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

export type {
  CreateRoleParams,
  DeleteRoleParams,
  FindAllQueryParams,
  FindAllRoleParams,
  FindOneRoleParams,
  UpdateRoleParams,
};
