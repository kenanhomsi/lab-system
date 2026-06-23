export type WebsitePageJsonPrimitive = string | number | boolean | null;

export type WebsitePageJsonValue =
  | WebsitePageJsonPrimitive
  | WebsitePageJsonValue[]
  | { [key: string]: WebsitePageJsonValue };

export type WebsitePagePublishStatus = "Draft" | "Published" | "Scheduled";

export type WebsitePageBlockType =
  | "hero"
  | "rich-text"
  | "media-text"
  | "cta"
  | "cards";

export type WebsitePageLanguage = "en-US" | "ar";

export type PageTranslationRequest = {
  language: string;
  title: string;
  slug: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  openGraphImageUrl?: string | null;
  canonicalUrl?: string | null;
  breadcrumbTitle?: string | null;
};

export type PageTranslationDto = PageTranslationRequest & {
  id: number;
};

export type BlockLocalizationRequest = {
  language: string;
  heading?: string | null;
  subheading?: string | null;
  description?: string | null;
  contentData?: WebsitePageJsonValue;
  mediaUrl?: string | null;
  mediaAltText?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
  buttonStyle?: string | null;
};

export type BlockLocalizationDto = BlockLocalizationRequest & {
  id: number;
};

export type ContentBlockRequest = {
  blockType: string;
  order: number;
  customCssClass?: string | null;
  customStyles?: WebsitePageJsonValue;
  animation?: string | null;
  visibilityRules?: WebsitePageJsonValue;
  isActive: boolean;
  localizations: BlockLocalizationRequest[];
};

export type ContentBlockDto = {
  id: number;
  blockType: string;
  order: number;
  customCssClass?: string | null;
  customStyles?: WebsitePageJsonValue;
  animation?: string | null;
  visibilityRules?: WebsitePageJsonValue;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  localizations?: BlockLocalizationDto[] | null;
};

export type ContentVersionDto = {
  id: number;
  versionNumber: number;
  snapshotData?: WebsitePageJsonValue;
  changeNotes?: string | null;
  createdByUserId?: string | null;
  createdAt: string;
};

export type PageUpsertRequest = {
  templateKey: string;
  parentId?: number | null;
  order: number;
  publishStatus: string;
  publishScheduledAt?: string | null;
  publishedAt?: string | null;
  isVisibleInNav: boolean;
  isActive: boolean;
  translations: PageTranslationRequest[];
  contentBlocks: ContentBlockRequest[];
  changeNotes?: string | null;
};

export type PageListItemDto = {
  id: number;
  templateKey?: string | null;
  parentId?: number | null;
  order: number;
  publishStatus?: string | null;
  isVisibleInNav: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string | null;
  displayTitle?: string | null;
  displaySlug?: string | null;
};

export type PageDto = {
  id: number;
  templateKey?: string | null;
  parentId?: number | null;
  order: number;
  publishStatus?: string | null;
  publishScheduledAt?: string | null;
  publishedAt?: string | null;
  isVisibleInNav: boolean;
  isActive: boolean;
  createdByUserId?: string | null;
  updatedByUserId?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  translations?: PageTranslationDto[] | null;
  contentBlocks?: ContentBlockDto[] | null;
  versions?: ContentVersionDto[] | null;
};

export type WebsiteNavigationPageDto = {
  id: number;
  templateKey?: string | null;
  parentId?: number | null;
  order: number;
  language?: string | null;
  title?: string | null;
  slug?: string | null;
  breadcrumbTitle?: string | null;
};

export type WebsiteContentBlockDto = {
  id: number;
  blockType?: string | null;
  order: number;
  customCssClass?: string | null;
  customStyles?: WebsitePageJsonValue;
  animation?: string | null;
  heading?: string | null;
  subheading?: string | null;
  description?: string | null;
  contentData?: WebsitePageJsonValue;
  mediaUrl?: string | null;
  mediaAltText?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
  buttonStyle?: string | null;
};

export type WebsitePageDto = {
  id: number;
  templateKey?: string | null;
  parentId?: number | null;
  order: number;
  language?: string | null;
  title?: string | null;
  slug?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  openGraphImageUrl?: string | null;
  canonicalUrl?: string | null;
  breadcrumbTitle?: string | null;
  contentBlocks?: WebsiteContentBlockDto[] | null;
};
