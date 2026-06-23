export const WEBSITE_PAGES_CACHE_TAG = "website-pages";
export const WEBSITE_PAGES_NAVIGATION_CACHE_TAG = "website-pages:navigation";

export function websitePageCacheTag(language: string, slug: string): string {
  return `website-page:${language}:${slug}`;
}
