import { backendContainer } from "@/container";
import { bannerModuleNames } from "@/modules/banner";
import { BannerBackendService } from "@/modules/banner/backend";
import type { BannerItem } from "@/types/banner";
import {
  BANNER_PLACEMENT,
  filterBannersByPlacement,
} from "./locations";

export async function fetchPublicBannersForPlacement(
  placement: string,
  fallbackToHomepage = false,
): Promise<BannerItem[]> {
  const bannerService = backendContainer.get<BannerBackendService>(
    bannerModuleNames.service,
  );

  const byPlacement = await bannerService.findAllPublic({ location: placement });
  const filtered = filterBannersByPlacement(byPlacement, placement);
  if (filtered.length > 0) return filtered;

  if (fallbackToHomepage && placement !== BANNER_PLACEMENT.HOME_PAGE) {
    const home = await bannerService.findAllPublic({
      location: BANNER_PLACEMENT.HOME_PAGE,
    });
    return filterBannersByPlacement(home, BANNER_PLACEMENT.HOME_PAGE);
  }

  return [];
}
