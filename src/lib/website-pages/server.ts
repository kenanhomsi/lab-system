import { getRequestOrigin } from "@/lib/api/request-origin";
import {
  WEBSITE_PAGES_CACHE_TAG,
  WEBSITE_PAGES_NAVIGATION_CACHE_TAG,
  websitePageCacheTag,
} from "./cache";
import { toWebsitePageLanguage } from "./language";
import type {
  WebsiteNavigationPageDto,
  WebsitePageDto,
  WebsitePageLanguage,
} from "@/types/website-page";

const PUBLIC_REVALIDATE_SECONDS = 300;

async function fetchJson<T>(url: URL, tags: string[]): Promise<T | null> {
  try {
    const res = await fetch(url.toString(), {
      next: {
        revalidate: PUBLIC_REVALIDATE_SECONDS,
        tags,
      },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchWebsiteNavigation(
  locale: string,
): Promise<WebsiteNavigationPageDto[]> {
  const origin = await getRequestOrigin();
  const language = toWebsitePageLanguage(locale);
  const url = new URL("/api/website/pages/navigation", origin);
  url.searchParams.set("language", language);
  const payload = await fetchJson<WebsiteNavigationPageDto[]>(url, [
    WEBSITE_PAGES_CACHE_TAG,
    WEBSITE_PAGES_NAVIGATION_CACHE_TAG,
  ]);
  return Array.isArray(payload) ? payload : [];
}

export async function fetchWebsitePage(
  slug: string,
  language: WebsitePageLanguage,
): Promise<WebsitePageDto | null> {
  const origin = await getRequestOrigin();
  const url = new URL(`/api/website/pages/${encodeURIComponent(slug)}`, origin);
  url.searchParams.set("language", language);
  return fetchJson<WebsitePageDto>(url, [
    WEBSITE_PAGES_CACHE_TAG,
    websitePageCacheTag(language, slug),
  ]);
}
