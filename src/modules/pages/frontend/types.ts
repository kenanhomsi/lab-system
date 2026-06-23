import type {
  PageUpsertRequest,
  WebsitePageLanguage,
} from "@/types/website-page";

type FindAllPageParams = {
  query?: Record<string, string | undefined>;
};

type FindOnePageParams = {
  id: number;
};

type DeletePageParams = {
  id: number;
};

type CreatePageParams = PageUpsertRequest;

type UpdatePageParams = PageUpsertRequest & {
  id: number;
};

type FindNavigationPagesParams = {
  language: WebsitePageLanguage;
};

type FindPublicPageParams = {
  slug: string;
  language: WebsitePageLanguage;
};

export type {
  CreatePageParams,
  DeletePageParams,
  FindAllPageParams,
  FindNavigationPagesParams,
  FindOnePageParams,
  FindPublicPageParams,
  UpdatePageParams,
};
