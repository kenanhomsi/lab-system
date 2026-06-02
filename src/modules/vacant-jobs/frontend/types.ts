type FindAllQueryParams = {
  page?: string;
  pageSize?: string;
  includeInactive?: string;
};

type FindAllVacantJobsParams = {
  query?: FindAllQueryParams;
};

type FindOneVacantJobParams = {
  id: string;
};

type CreateVacantJobParams = {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  isActive: boolean;
  sortOrder: number;
};

type UpdateVacantJobParams = {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  isActive: boolean;
  sortOrder: number;
};

type DeleteVacantJobParams = {
  id: string;
};

export type {
  CreateVacantJobParams,
  DeleteVacantJobParams,
  FindAllQueryParams,
  FindAllVacantJobsParams,
  FindOneVacantJobParams,
  UpdateVacantJobParams,
};
