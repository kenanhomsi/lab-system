import { notFound } from "next/navigation";
import type { AppLocale } from "@/i18n/routing";
import {
  fetchMetwaliAllPostIds,
  fetchMetwaliPostById,
} from "@/lib/metwali-blog";
import { BlogArticleView } from "../../ui/blog/article-view";

export const revalidate = 3600;

export async function generateStaticParams() {
  const ids = await fetchMetwaliAllPostIds();
  return ids.map((id) => ({ id: String(id) }));
}

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id, locale } = await params;
  const numId = Number(id);
  if (!Number.isFinite(numId)) {
    return {};
  }
  const post = await fetchMetwaliPostById(numId, locale as AppLocale);
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
  const post = await fetchMetwaliPostById(numId, locale as AppLocale);
  if (!post) {
    notFound();
  }
  return (
    <main>
      <BlogArticleView post={post} />
    </main>
  );
}
