type FindAllQueryParams = {
  page?: string;
  pageSize?: string;
  includeInactive?: string;
};

type AuthParams = {
  token: string;
};

type FindAllVacantJobsBackendParams = AuthParams & {
  query?: FindAllQueryParams;
};

type FindVacantJobBackendParams = AuthParams & {
  id: string;
};

type CreateVacantJobBackendParams = AuthParams & {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  isActive: boolean;
  sortOrder: number;
};

type UpdateVacantJobBackendParams = AuthParams & {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  isActive: boolean;
  sortOrder: number;
};

type DeleteVacantJobBackendParams = AuthParams & {
  id: string;
};

export type {
  CreateVacantJobBackendParams,
  DeleteVacantJobBackendParams,
  FindAllVacantJobsBackendParams,
  FindVacantJobBackendParams,
  UpdateVacantJobBackendParams,
};
