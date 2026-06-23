import type {
  PageUpsertRequest,
  WebsitePageLanguage,
} from "@/types/website-page";

type WithToken = {
  token: string;
};

type FindAllPageParams = WithToken & {
  query?: Record<string, string>;
};

type FindOnePageParams = WithToken & {
  id: number;
};

type DeletePageParams = WithToken & {
  id: number;
};

type CreatePageParams = WithToken & PageUpsertRequest;

type UpdatePageParams = WithToken &
  PageUpsertRequest & {
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
