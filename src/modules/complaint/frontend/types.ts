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

type CreateComplaintMineParams = {
  title: string;
  description: string;
  attachment?: File | null;
};

export type {
  CreateComplaintMineParams,
  FindAllComplaintParams,
  FindAllQueryParams,
  UpdateComplaintStatusParams,
};
