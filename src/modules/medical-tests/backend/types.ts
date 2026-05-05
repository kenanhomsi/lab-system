import type { ParameterSchemaInput } from "../abstraction";

type FindAllQueryParams = {
  Page?: string;
  PageSize?: string;
  Search?: string;
  IsActive?: string;
  SortBy?: string;
  SortDesc?: string;
};

type AuthParams = {
  token: string;
};
type FindAllUserParams = AuthParams & {
  query?: FindAllQueryParams;
};

type FindUserParams = AuthParams & {
  id: string;
};

type CreateUserParams = AuthParams & {
  nameAr: string;
  nameEn: string;
  price: number;
  category: string;
  sampleType: string;
  parameterSchema: ParameterSchemaInput;
  status: string;
};

type UpdateUserParams = AuthParams & {
  id: string;
  nameAr: string;
  nameEn: string;
  price: number;
  category: string;
  sampleType: string;
  parameterSchema: ParameterSchemaInput;
  status: string;
};

type DeleteUserParams = AuthParams & {
  id: string;
};

export type {
  CreateUserParams,
  DeleteUserParams,
  FindAllUserParams,
  FindUserParams,
  UpdateUserParams,
};
