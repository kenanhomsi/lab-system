import { getLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { BlogHeroSection } from "../ui/blog/hero-section";
import { BlogPostGrid } from "../ui/blog/post-grid";
import { PageBannerOverflowServer, PageBannerSlotServer } from "@/components/layout/page-banner-slots-server";
import { BANNER_PLACEMENT } from "@/lib/banners/locations";
import { getRequestOrigin } from "@/lib/api/request-origin";
import type { FetchMetwaliBlogResult } from "@/types/metwali-blog";

export const revalidate = 3600;

async function fetchBlogIndex(locale: AppLocale): Promise<FetchMetwaliBlogResult> {
  try {
    const origin = await getRequestOrigin();
    const url = new URL("/api/website/blog", origin);
    url.searchParams.set("locale", locale);
    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
    if (!res.ok) return { ok: false };
    return (await res.json()) as FetchMetwaliBlogResult;
  } catch {
    return { ok: false };
  }
}

export default async function BlogPage() {
  const locale = (await getLocale()) as AppLocale;
  const result = await fetchBlogIndex(locale);

  return (
    <main>
      <BlogHeroSection />
      <PageBannerSlotServer placement={BANNER_PLACEMENT.BLOG} order={1} />
      <BlogPostGrid result={result} />
      <PageBannerSlotServer placement={BANNER_PLACEMENT.BLOG} order={2} />
      <PageBannerOverflowServer placement={BANNER_PLACEMENT.BLOG} />
    </main>
  );
}
