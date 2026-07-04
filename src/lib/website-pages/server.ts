import { unstable_cache } from "next/cache";
import { backendContainer } from "@/container/backend";
import {
  WEBSITE_PAGES_CACHE_TAG,
  WEBSITE_PAGES_NAVIGATION_CACHE_TAG,
  websitePageCacheTag,
} from "./cache";
import { toWebsitePageLanguage } from "./language";
import { pageModuleNames } from "@/modules/pages";
import { PageBackendService } from "@/modules/pages/backend";
import type {
  WebsiteNavigationPageDto,
  WebsitePageDto,
  WebsitePageLanguage,
} from "@/types/website-page";

const PUBLIC_REVALIDATE_SECONDS = 300;

const pageService = backendContainer.get<PageBackendService>(
  pageModuleNames.service,
);

const fetchNavigationCached = unstable_cache(
  async (language: WebsitePageLanguage): Promise<WebsiteNavigationPageDto[]> => {
    try {
      return await pageService.findNavigation({ language });
    } catch {
      return [];
    }
  },
  ["website-pages-navigation"],
  {
    revalidate: PUBLIC_REVALIDATE_SECONDS,
    tags: [WEBSITE_PAGES_CACHE_TAG, WEBSITE_PAGES_NAVIGATION_CACHE_TAG],
  },
);

function fetchPageCached(language: WebsitePageLanguage, slug: string) {
  return unstable_cache(
    async (): Promise<WebsitePageDto | null> => {
      try {
        return await pageService.findPublicPage({ slug, language });
      } catch {
        return null;
      }
    },
    ["website-page", language, slug],
    {
      revalidate: PUBLIC_REVALIDATE_SECONDS,
      tags: [WEBSITE_PAGES_CACHE_TAG, websitePageCacheTag(language, slug)],
    },
  )();
}

export async function fetchWebsiteNavigation(
  locale: string,
): Promise<WebsiteNavigationPageDto[]> {
  const language = toWebsitePageLanguage(locale);
  return fetchNavigationCached(language);
}

export async function fetchWebsitePage(
  slug: string,
  language: WebsitePageLanguage,
): Promise<WebsitePageDto | null> {
  return fetchPageCached(language, slug);
}
