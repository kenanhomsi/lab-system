export type BannerItem = {
  id: string;
  title: string;
  type: string;
  mediaUrl: string;
  internalLink: string;
  externalLink: string;
  targetType: string;
  location: string;
  displayOrder: number;
  isActive: boolean;
  visibilityRules: string;
  startDate: string;
  endDate: string;
  viewsCount: number;
  clicksCount: number;
  createdAt: string;
};

export type BannersResponse = BannerItem[];

export type CreateBannerRequest = {
  title: string;
  type: string;
  internalLink: string;
  externalLink: string;
  targetType: string;
  location: string;
  displayOrder: number;
  isActive: boolean;
  visibilityRulesJson: string;
  startDate: string;
  endDate: string;
  media: File;
};

/**
 * BannerModalType - Modal state for banners table.
 * Only supports 'create' since the API doesn't support edit/delete operations.
 */
export type BannerModalType = "create" | null;
