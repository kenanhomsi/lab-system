"use client";

import { useQueries } from "@tanstack/react-query";
import { frontendContainer } from "@/container";
import { adModuleNames, AdFrontendService } from "@/modules/ad";
import { bannerModuleNames, BannerFrontendService } from "@/modules/banner";
import { normalizeDisplayMode } from "@/lib/banners/display-mode";
import { PageFrontendService, pageModuleNames } from "@/modules/pages";
import {
  SlideCardFrontendService,
  slideCardModuleNames,
} from "@/modules/slide-card";
import {
  WelcomePageFrontendService,
  welcomePageModuleNames,
} from "@/modules/welcome-page";
import type { WelcomePageItem } from "@/types/welcome-page";
import type { AdItem } from "@/types/ad";
import type { BannerItem } from "@/types/banner";
import type { SlideCardItem } from "@/types/slide-card";
import type { PageListItemDto } from "@/types/website-page";

const LIST_PAGE_SIZE = "200";

const normalizeBanner = (value: unknown): BannerItem | null => {
  if (typeof value !== "object" || value === null) return null;
  const item = value as Partial<BannerItem>;
  if (
    typeof item.id !== "string" ||
    typeof item.title !== "string" ||
    typeof item.mediaUrl !== "string"
  ) {
    return null;
  }
  return {
    id: item.id,
    title: item.title,
    type: item.type ?? "",
    displayMode: normalizeDisplayMode(item.displayMode as string | undefined),
    mediaUrl: item.mediaUrl,
    internalLink: item.internalLink ?? "",
    externalLink: item.externalLink ?? "",
    targetType: item.targetType ?? "",
    location: item.location ?? "",
    displayOrder: item.displayOrder ?? 0,
    isActive: item.isActive ?? true,
    visibilityRules: item.visibilityRules ?? "",
    startDate: item.startDate ?? "",
    endDate: item.endDate ?? "",
    viewsCount: item.viewsCount ?? 0,
    clicksCount: item.clicksCount ?? 0,
    createdAt: item.createdAt ?? "",
  };
};

const asBannerRows = (payload: unknown): BannerItem[] => {
  if (Array.isArray(payload)) {
    return payload.map(normalizeBanner).filter((item): item is BannerItem => item !== null);
  }
  if (payload && typeof payload === "object" && "data" in payload) {
    const inner = (payload as { data: unknown }).data;
    if (Array.isArray(inner)) {
      return inner.map(normalizeBanner).filter((item): item is BannerItem => item !== null);
    }
    if (inner && typeof inner === "object" && "data" in inner) {
      const nested = (inner as { data: unknown }).data;
      if (Array.isArray(nested)) {
        return nested.map(normalizeBanner).filter((item): item is BannerItem => item !== null);
      }
    }
  }
  return [];
};

const normalizeAd = (value: unknown): AdItem | null => {
  if (typeof value !== "object" || value === null) return null;
  const item = value as Partial<AdItem>;
  if (
    typeof item.id !== "number" ||
    typeof item.name !== "string" ||
    typeof item.mediaUrl !== "string"
  ) {
    return null;
  }
  return {
    ...item,
    displayMode: normalizeDisplayMode(item.displayMode as string | undefined),
  } as AdItem;
};

const asAdRows = (payload: unknown): AdItem[] => {
  if (Array.isArray(payload)) {
    return payload.map(normalizeAd).filter((item): item is AdItem => item !== null);
  }
  if (payload && typeof payload === "object" && "data" in payload) {
    const inner = (payload as { data: unknown }).data;
    if (Array.isArray(inner)) {
      return inner.map(normalizeAd).filter((item): item is AdItem => item !== null);
    }
  }
  return [];
};

const asSlideCardRows = (payload: unknown): SlideCardItem[] => {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object" && "data" in payload) {
    const inner = (payload as { data: unknown }).data;
    if (Array.isArray(inner)) return inner as SlideCardItem[];
  }
  return [];
};

const asPageRows = (payload: unknown): PageListItemDto[] => {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object" && "data" in payload) {
    const inner = (payload as { data: unknown }).data;
    if (Array.isArray(inner)) return inner as PageListItemDto[];
  }
  return [];
};

const asWelcomePageRows = (payload: unknown): WelcomePageItem[] => {
  if (Array.isArray(payload)) return payload as WelcomePageItem[];
  if (payload && typeof payload === "object" && "data" in payload) {
    const inner = (payload as { data: unknown }).data;
    if (Array.isArray(inner)) return inner as WelcomePageItem[];
  }
  return [];
};

/**
 * Loads banners, ads, slide cards, and CMS pages for the content map panel.
 */
export function useWebsiteContentData() {
  const bannerService = frontendContainer.get<BannerFrontendService>(
    bannerModuleNames.service,
  );
  const adService = frontendContainer.get<AdFrontendService>(adModuleNames.service);
  const slideCardService = frontendContainer.get<SlideCardFrontendService>(
    slideCardModuleNames.service,
  );
  const pageService = frontendContainer.get<PageFrontendService>(
    pageModuleNames.service,
  );

  const welcomePageService = frontendContainer.get<WelcomePageFrontendService>(
    welcomePageModuleNames.service,
  );

  const [bannersQuery, adsQuery, slideCardsQuery, pagesQuery, welcomePagesQuery] = useQueries({
    queries: [
      {
        queryKey: ["admin-content-map-banners"],
        queryFn: async () =>
          asBannerRows(
            await bannerService.findAll({
              query: { Page: "1", PageSize: LIST_PAGE_SIZE },
            }),
          ),
      },
      {
        queryKey: ["admin-content-map-ads"],
        queryFn: async () =>
          asAdRows(
            await adService.findAll({
              query: { Page: "1", PageSize: LIST_PAGE_SIZE },
            }),
          ),
      },
      {
        queryKey: ["admin-content-map-slide-cards"],
        queryFn: async () =>
          asSlideCardRows(
            await slideCardService.findAll({
              query: { Page: "1", PageSize: LIST_PAGE_SIZE },
            }),
          ),
      },
      {
        queryKey: ["admin-content-map-pages"],
        queryFn: async () =>
          asPageRows(
            await pageService.findAll({
              query: { Page: "1", PageSize: LIST_PAGE_SIZE },
            }),
          ),
      },
      {
        queryKey: ["admin-content-map-welcome-pages"],
        queryFn: async () => {
          const payload = await welcomePageService.findAll({
            query: { Page: "1", PageSize: LIST_PAGE_SIZE },
          });
          return asWelcomePageRows(payload);
        },
      },
    ],
  });

  const isLoading =
    bannersQuery.isPending ||
    adsQuery.isPending ||
    slideCardsQuery.isPending ||
    pagesQuery.isPending ||
    welcomePagesQuery.isPending;

  const isError =
    bannersQuery.isError ||
    adsQuery.isError ||
    slideCardsQuery.isError ||
    pagesQuery.isError ||
    welcomePagesQuery.isError;

  const refetchAll = () => {
    void bannersQuery.refetch();
    void adsQuery.refetch();
    void slideCardsQuery.refetch();
    void pagesQuery.refetch();
    void welcomePagesQuery.refetch();
  };

  return {
    banners: bannersQuery.data ?? [],
    ads: adsQuery.data ?? [],
    slideCards: slideCardsQuery.data ?? [],
    cmsPages: pagesQuery.data ?? [],
    welcomePages: welcomePagesQuery.data ?? [],
    isLoading,
    isError,
    refetchAll,
  };
}
