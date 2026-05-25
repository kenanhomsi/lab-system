type AuthParams = {
  token: string;
};

type FindAllQueryParams = {
  Page?: string;
  PageSize?: string;
  Search?: string;
  Status?: string;
  UserId?: string;
};

type FindAllComplaintParams = AuthParams & {
  query?: FindAllQueryParams;
};

type UpdateComplaintStatusParams = AuthParams & {
  id: string;
  status: string;
};

type FindMineComplaintParams = AuthParams & {
  query?: Record<string, string | undefined>;
};

type CreateMineComplaintParams = AuthParams & {
  formData: FormData;
};

export type {
  FindAllComplaintParams,
  FindAllQueryParams,
  FindMineComplaintParams,
  CreateMineComplaintParams,
  UpdateComplaintStatusParams,
};
