type FindAllBannerParams = {
  query?: {
    Page?: string;
    PageSize?: string;
  };
};

type CreateBannerParams = {
  title: string;
  subtitle?: string;
  targetUrl: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  imageFile?: File;
};

type FindOneBannerParams = {
  id: string;
};

type UpdateBannerParams = {
  id: string;
  title: string;
  subtitle?: string;
  targetUrl: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  imageFile?: File;
};

type DeleteBannerParams = {
  id: string;
};

export type {
  CreateBannerParams,
  DeleteBannerParams,
  FindAllBannerParams,
  FindOneBannerParams,
  UpdateBannerParams,
};
