"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { frontendContainer } from "@/container";
import { bannerModuleNames, BannerFrontendService } from "@/modules/banner";
import type { BannerItem } from "@/types/banner";
import {
  BANNER_PLACEMENT,
  filterBannersByPlacement,
  WEBSITE_BANNERS_QUERY_KEY,
} from "./locations";

type UsePublicBannersOptions = {
  placement: string;
  /** When true, fall back to homepage banners if none match the placement. */
  fallbackToHomepage?: boolean;
  enabled?: boolean;
};

export function usePublicBanners({
  placement,
  fallbackToHomepage = false,
  enabled = true,
}: UsePublicBannersOptions) {
  const bannerService = frontendContainer.get<BannerFrontendService>(
    bannerModuleNames.service,
  );

  const query = useQuery({
    queryKey: [...WEBSITE_BANNERS_QUERY_KEY, placement],
    enabled,
    queryFn: async (): Promise<BannerItem[]> => {
      const byPlacement = await bannerService.findAllPublic({
        location: placement,
      });
      const filtered = filterBannersByPlacement(byPlacement, placement);
      if (filtered.length > 0) return filtered;

      if (
        fallbackToHomepage &&
        placement !== BANNER_PLACEMENT.HOME_PAGE
      ) {
        const home = await bannerService.findAllPublic({
          location: BANNER_PLACEMENT.HOME_PAGE,
        });
        return filterBannersByPlacement(home, BANNER_PLACEMENT.HOME_PAGE);
      }

      return [];
    },
    staleTime: 1000 * 60,
  });

  const banners = useMemo((): BannerItem[] => query.data ?? [], [query.data]);

  return { ...query, banners };
}
