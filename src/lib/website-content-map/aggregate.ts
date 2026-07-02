import {
  BANNER_PLACEMENT,
  filterAdsByPlacement,
  filterBannersByPlacement,
} from "@/lib/banners/locations";
import { groupBannersBySlot } from "@/lib/banners/slots";
import type { AdItem } from "@/types/ad";
import type { BannerItem } from "@/types/banner";
import type { SlideCardItem } from "@/types/slide-card";

/** Groups page banners into declared slots and overflow buckets. */
export function groupBannersForSurface(
  banners: BannerItem[],
  placement: string,
) {
  const filtered = filterBannersByPlacement(banners, placement);
  return groupBannersBySlot(filtered, placement);
}

/** Pop-up ads whose addressName matches the page placement. */
export function getAdsForSurface(ads: AdItem[], placement: string): AdItem[] {
  return filterAdsByPlacement(ads, placement);
}

/** Banners for specialized card-slider sections (medical advice, equipment, etc.). */
export function getBannersForSliderPlacement(
  banners: BannerItem[],
  placement: string,
): BannerItem[] {
  return filterBannersByPlacement(banners, placement).sort(
    (left, right) => left.displayOrder - right.displayOrder,
  );
}

/** Active homepage slide cards sorted by display order. */
export function getActiveSlideCards(cards: SlideCardItem[]): SlideCardItem[] {
  return cards
    .filter((card) => card.isActive)
    .sort((left, right) => left.displayOrder - right.displayOrder);
}

/** Banners assigned to the global ad bar placement. */
export function getAdBarBanners(banners: BannerItem[]): BannerItem[] {
  return filterBannersByPlacement(banners, BANNER_PLACEMENT.AD_BAR);
}
