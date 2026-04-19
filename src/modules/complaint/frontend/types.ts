type FindAllQueryParams = {
  Page?: string;
  PageSize?: string;
  Search?: string;
  Status?: string;
  UserId?: string;
};

type FindAllComplaintParams = {
  query?: FindAllQueryParams;
};

type UpdateComplaintStatusParams = {
  id: string;
  status: string;
};

export type {
  FindAllComplaintParams,
  FindAllQueryParams,
  UpdateComplaintStatusParams,
};
