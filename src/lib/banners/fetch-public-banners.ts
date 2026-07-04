import { unstable_cache } from "next/cache";
import { backendContainer } from "@/container/backend";
import { bannerModuleNames } from "@/modules/banner";
import { BannerBackendService } from "@/modules/banner/backend";
import type { BannerItem } from "@/types/banner";
import {
  BANNER_PLACEMENT,
  filterBannersByPlacement,
} from "./locations";

const PUBLIC_REVALIDATE_SECONDS = 300;
const PUBLIC_BANNERS_CACHE_TAG = "website-banners";

const bannerService = backendContainer.get<BannerBackendService>(
  bannerModuleNames.service,
);

async function fetchPublicBannersFromBff(
  location: string,
): Promise<BannerItem[]> {
  try {
    return await bannerService.findAllPublic({ location });
  } catch {
    return [];
  }
}

const fetchPublicBannersFromBackend = unstable_cache(
  fetchPublicBannersFromBff,
  ["website-public-banners"],
  {
    revalidate: PUBLIC_REVALIDATE_SECONDS,
    tags: [PUBLIC_BANNERS_CACHE_TAG],
  },
);

export async function fetchPublicBannersForPlacement(
  placement: string,
  fallbackToHomepage = false,
): Promise<BannerItem[]> {
  const byPlacement = await fetchPublicBannersFromBackend(placement);
  const filtered = filterBannersByPlacement(byPlacement, placement);
  if (filtered.length > 0) return filtered;

  if (fallbackToHomepage && placement !== BANNER_PLACEMENT.HOME_PAGE) {
    const home = await fetchPublicBannersFromBackend(BANNER_PLACEMENT.HOME_PAGE);
    return filterBannersByPlacement(home, BANNER_PLACEMENT.HOME_PAGE);
  }

  return [];
}
