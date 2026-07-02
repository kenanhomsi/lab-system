"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { frontendContainer } from "@/container";
import { pageModuleNames, PageFrontendService } from "@/modules/pages";
import { useMedicalTestsForSelectQuery } from "@/components/modals/test-requests/use-test-request-lookups";
import type { Offer } from "@/app/[locale]/(website)/offers/store/api";
import type { MetwaliBlogPost } from "@/types/metwali-blog";
import type { PageListItemDto } from "@/types/website-page";
import type { PageResourceType } from "@/lib/banners/page-target";
import { buildPathTarget } from "@/lib/banners/page-target";

export type PageTargetOption = {
  value: string;
  label: string;
};

type FetchMetwaliBlogResult =
  | { ok: true; posts: MetwaliBlogPost[] }
  | { ok: false };

async function fetchBlogPosts(locale: string): Promise<MetwaliBlogPost[]> {
  const response = await fetch(`/api/website/blog?locale=${locale}`);
  if (!response.ok) return [];
  const payload = (await response.json()) as FetchMetwaliBlogResult;
  return payload.ok ? payload.posts : [];
}

async function fetchOffers(locale: string): Promise<Offer[]> {
  const response = await fetch(`/api/offers?locale=${locale}`);
  if (!response.ok) return [];
  const payload = (await response.json()) as unknown;
  if (Array.isArray(payload)) return payload as Offer[];
  if (payload && typeof payload === "object" && "data" in payload) {
    const inner = (payload as { data: unknown }).data;
    return Array.isArray(inner) ? (inner as Offer[]) : [];
  }
  return [];
}

async function fetchCmsPages(): Promise<PageListItemDto[]> {
  const pageService = frontendContainer.get<PageFrontendService>(
    pageModuleNames.service,
  );
  const rows = await pageService.findAll({ query: { PageSize: "500" } });
  return Array.isArray(rows) ? rows : [];
}

/**
 * Loads searchable options for a specific page-resource type.
 */
export function usePageTargetResourceOptions(
  resourceType: PageResourceType | null,
  search: string,
) {
  const locale = useLocale();
  const testsQuery = useMedicalTestsForSelectQuery(resourceType === "tests");
  const blogQuery = useQuery({
    queryKey: ["page-target", "blog", locale],
    queryFn: () => fetchBlogPosts(locale),
    enabled: resourceType === "blog",
    staleTime: 60_000,
  });
  const offersQuery = useQuery({
    queryKey: ["page-target", "offers", locale],
    queryFn: () => fetchOffers(locale),
    enabled: resourceType === "offers",
    staleTime: 60_000,
  });
  const cmsQuery = useQuery({
    queryKey: ["page-target", "cms-pages"],
    queryFn: fetchCmsPages,
    enabled: resourceType === "cms",
    staleTime: 60_000,
  });

  const options = useMemo((): PageTargetOption[] => {
    const needle = search.trim().toLowerCase();

    if (resourceType === "tests") {
      const tests = testsQuery.data ?? [];
      return tests
        .map((test) => {
          const label = locale === "ar" ? test.nameAr : test.nameEn;
          return {
            value: buildPathTarget(`/tests/${test.id}`),
            label: label || String(test.id),
          };
        })
        .filter((item) => !needle || item.label.toLowerCase().includes(needle));
    }

    if (resourceType === "blog") {
      const posts = blogQuery.data ?? [];
      return posts
        .map((post) => ({
          value: buildPathTarget(`/blog/${post.id}`),
          label: post.title,
        }))
        .filter((item) => !needle || item.label.toLowerCase().includes(needle));
    }

    if (resourceType === "offers") {
      const offers = offersQuery.data ?? [];
      return offers
        .map((offer) => ({
          value: buildPathTarget(`/offers/${offer.id}`),
          label: offer.name,
        }))
        .filter((item) => !needle || item.label.toLowerCase().includes(needle));
    }

    if (resourceType === "cms") {
      const pages = cmsQuery.data ?? [];
      return pages
        .map((page) => {
          const slug = page.displaySlug?.trim().replace(/^\/+/, "") ?? "";
          const label = page.displayTitle?.trim() || slug || String(page.id);
          return {
            value: buildPathTarget(slug ? `/${slug}` : "/"),
            label,
          };
        })
        .filter((item) => item.value !== buildPathTarget("/"))
        .filter((item) => !needle || item.label.toLowerCase().includes(needle));
    }

    return [];
  }, [
    resourceType,
    search,
    locale,
    testsQuery.data,
    blogQuery.data,
    offersQuery.data,
    cmsQuery.data,
  ]);

  const isLoading =
    (resourceType === "tests" && testsQuery.isLoading) ||
    (resourceType === "blog" && blogQuery.isLoading) ||
    (resourceType === "offers" && offersQuery.isLoading) ||
    (resourceType === "cms" && cmsQuery.isLoading);

  return { options, isLoading };
}
