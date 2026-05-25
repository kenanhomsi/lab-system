import { notFound } from "next/navigation";
import type { AppLocale } from "@/i18n/routing";
import { fetchMetwaliAllPostIds } from "@/lib/server/metwali-blog";
import { BlogArticleView } from "../../ui/blog/article-view";
import { getRequestOrigin } from "@/lib/api/request-origin";
import type { MetwaliPostDetail } from "@/types/metwali-blog";

export const revalidate = 3600;

/**
 * Uses server integration directly — build/static generation runs without a guaranteed HTTP origin.
 */
export async function generateStaticParams() {
  const ids = await fetchMetwaliAllPostIds();
  return ids.map((id) => ({ id: String(id) }));
}

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

async function fetchPostJson(
  origin: string,
  locale: AppLocale,
  numId: number,
): Promise<MetwaliPostDetail | null> {
  try {
    const url = new URL(`/api/website/blog/${numId}`, origin);
    url.searchParams.set("locale", locale);
    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return (await res.json()) as MetwaliPostDetail;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { id, locale } = await params;
  const numId = Number(id);
  if (!Number.isFinite(numId)) {
    return {};
  }
  const origin = await getRequestOrigin();
  const post = await fetchPostJson(origin, locale as AppLocale, numId);
  if (!post) {
    return {};
  }
  return {
    title: `${post.title} | Al Mutawali Lab`,
    description: post.excerpt,
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { id, locale } = await params;
  const numId = Number(id);
  if (!Number.isFinite(numId)) {
    notFound();
  }
  const origin = await getRequestOrigin();
  const post = await fetchPostJson(origin, locale as AppLocale, numId);
  if (!post) {
    notFound();
  }
  return (
    <main>
      <BlogArticleView post={post} />
    </main>
  );
}
