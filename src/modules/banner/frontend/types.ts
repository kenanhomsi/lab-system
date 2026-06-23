type FindAllBannerParams = {
  query?: {
    Page?: string;
    PageSize?: string;
  };
};

type FindAllPublicBannerParams = {
  location?: string;
};

type DeleteBannerParams = {
  id: string;
};

type CreateBannerParams = {
  title: string;
  type: string;
  InternalLink: string;
  ExternalLink: string;
  TargetType: string;
  Location: string;
  DisplayOrder: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  VisibilityRulesJson: string;
  Media: File;
};

type UpdateBannerParams = {
  id: string;
  title: string;
  type: string;
  InternalLink: string;
  ExternalLink: string;
  TargetType: string;
  Location: string;
  DisplayOrder: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  VisibilityRulesJson: string;
  Media?: File;
};

export type {
  CreateBannerParams,
  DeleteBannerParams,
  FindAllBannerParams,
  FindAllPublicBannerParams,
  UpdateBannerParams,
};
