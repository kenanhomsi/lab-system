import { getLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { fetchMetwaliBlogPosts } from "@/lib/metwali-blog";
import { BlogHeroSection } from "../ui/blog/hero-section";
import { BlogPostGrid } from "../ui/blog/post-grid";

export const revalidate = 3600;

export default async function BlogPage() {
  const locale = (await getLocale()) as AppLocale;
  const result = await fetchMetwaliBlogPosts(locale);

  return (
    <main>
      <BlogHeroSection />
      <BlogPostGrid result={result} />
    </main>
  );
}
