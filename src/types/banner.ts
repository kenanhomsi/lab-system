import type { DisplayMode } from "@/lib/banners/display-mode";

export type BannerItem = {
  id: string;
  title: string;
  type: string;
  displayMode?: DisplayMode;
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
  displayMode: DisplayMode;
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

export type BannerModalType = "create" | "edit" | "delete" | "view" | null;

export type UpdateBannerRequest = {
  id: string;
  title: string;
  type: string;
  displayMode: DisplayMode;
  internalLink: string;
  externalLink: string;
  targetType: string;
  location: string;
  displayOrder: number;
  isActive: boolean;
  visibilityRulesJson: string;
  startDate: string;
  endDate: string;
  media?: File;
};
