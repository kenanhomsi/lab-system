type AuthParams = {
  token: string;
};

type ListQueryParams = {
  page?: string;
  pageSize?: string;
  status?: string;
  search?: string;
};

type FindAllInsuranceApprovalParams = AuthParams & {
  query?: ListQueryParams;
};

type FindMineInsuranceApprovalParams = AuthParams & {
  query?: Pick<ListQueryParams, "page" | "pageSize">;
};

type FindOneInsuranceApprovalParams = AuthParams & {
  id: string;
};

type CreateInsuranceApprovalParams = AuthParams & {
  formData: FormData;
};

type UpdateInsuranceApprovalStatusParams = AuthParams & {
  id: string;
  status: string;
  notes?: string;
  rejectionReason?: string;
};

type RemoveInsuranceApprovalParams = AuthParams & {
  id: string;
};

export type {
  CreateInsuranceApprovalParams,
  FindAllInsuranceApprovalParams,
  FindMineInsuranceApprovalParams,
  FindOneInsuranceApprovalParams,
  ListQueryParams,
  RemoveInsuranceApprovalParams,
  UpdateInsuranceApprovalStatusParams,
};
