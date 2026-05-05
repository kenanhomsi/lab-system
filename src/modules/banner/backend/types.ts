type FindAllBannerParams = {
  query?: {
    Page?: string;
    PageSize?: string;
  };
  token: string;
};

type FindAllPublicBannerParams = {
  location?: string;
};

type CreateBannerParams = {
  token: string;
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

export type { CreateBannerParams, FindAllBannerParams, FindAllPublicBannerParams };
