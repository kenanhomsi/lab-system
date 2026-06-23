import type {
  WebsitePageBlockType,
  WebsitePagePublishStatus,
} from "@/types/website-page";

export const WEBSITE_PAGE_PUBLISH_STATUSES: WebsitePagePublishStatus[] = [
  "Draft",
  "Published",
  "Scheduled",
];

export const WEBSITE_PAGE_BLOCK_TYPES: WebsitePageBlockType[] = [
  "hero",
  "rich-text",
  "media-text",
  "cta",
  "cards",
];

export const WEBSITE_PAGE_DEFAULT_TEMPLATE_KEY = "standard";
