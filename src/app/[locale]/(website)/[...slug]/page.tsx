import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WebsiteCmsPage } from "@/components/website-pages/cms-page";
import { fetchWebsitePage } from "@/lib/website-pages/server";
import { toWebsitePageLanguage } from "@/lib/website-pages/language";

type PageProps = {
  params: Promise<{ locale: string; slug: string[] }>;
};

const toSlugPath = (slug: string[]) => slug.join("/");

const toAbsoluteUrl = (value?: string | null) => {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  return /^https?:\/\//i.test(trimmed) ? trimmed : undefined;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const language = toWebsitePageLanguage(locale);
  const page = await fetchWebsitePage(toSlugPath(slug), language);
  if (!page) return {};

  const keywords = page.metaKeywords
    ?.split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
  const image = toAbsoluteUrl(page.openGraphImageUrl);

  return {
    title: page.metaTitle || page.title || "Al Mutawali Lab",
    description: page.metaDescription || undefined,
    keywords,
    alternates: {
      canonical: toAbsoluteUrl(page.canonicalUrl),
    },
    openGraph: {
      title: page.metaTitle || page.title || undefined,
      description: page.metaDescription || undefined,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function CmsWebsitePage({ params }: PageProps) {
  const { locale, slug } = await params;
  const language = toWebsitePageLanguage(locale);
  const page = await fetchWebsitePage(toSlugPath(slug), language);
  if (!page) {
    notFound();
  }
  return <WebsiteCmsPage page={page} />;
}
