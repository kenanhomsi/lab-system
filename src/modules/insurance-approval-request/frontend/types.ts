type ListQueryParams = {
  page?: string;
  pageSize?: string;
  status?: string;
  search?: string;
};

type FindAllInsuranceApprovalParams = {
  query?: ListQueryParams;
};

type FindMineInsuranceApprovalParams = {
  query?: Pick<ListQueryParams, "page" | "pageSize">;
};

type CreateInsuranceApprovalParams = {
  insuredName: string;
  insuranceNumber: string;
  mobileNumber: string;
  insuranceCardImage: File;
  prescriptionImage: File;
};

type UpdateInsuranceApprovalStatusParams = {
  id: string;
  status: string;
  notes?: string;
  rejectionReason?: string;
};

export type {
  CreateInsuranceApprovalParams,
  FindAllInsuranceApprovalParams,
  FindMineInsuranceApprovalParams,
  ListQueryParams,
  UpdateInsuranceApprovalStatusParams,
};
