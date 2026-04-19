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

export type {
  FindAllComplaintParams,
  FindAllQueryParams,
  UpdateComplaintStatusParams,
};
