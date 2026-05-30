import { getRequestOrigin } from "@/lib/api/request-origin";
import { normalizePublicBannerPayload } from "@/lib/banners/public-banner-payload";
import type { BannerItem } from "@/types/banner";
import {
  BANNER_PLACEMENT,
  filterBannersByPlacement,
} from "./locations";

async function fetchPublicBannersFromBff(
  location: string,
): Promise<BannerItem[]> {
  try {
    const origin = await getRequestOrigin();
    const url = new URL("/api/website/banners", origin);
    url.searchParams.set("location", location);
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) return [];
    const payload: unknown = await res.json();
    return normalizePublicBannerPayload(payload);
  } catch {
    return [];
  }
}

export async function fetchPublicBannersForPlacement(
  placement: string,
  fallbackToHomepage = false,
): Promise<BannerItem[]> {
  const byPlacement = await fetchPublicBannersFromBff(placement);
  const filtered = filterBannersByPlacement(byPlacement, placement);
  if (filtered.length > 0) return filtered;

  if (fallbackToHomepage && placement !== BANNER_PLACEMENT.HOME_PAGE) {
    const home = await fetchPublicBannersFromBff(BANNER_PLACEMENT.HOME_PAGE);
    return filterBannersByPlacement(home, BANNER_PLACEMENT.HOME_PAGE);
  }

  return [];
}
