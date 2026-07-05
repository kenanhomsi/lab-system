import { cache } from "react";
import { PageBanner } from "@/components/layout/page-banner";
import { fetchPublicBannersForPlacement } from "@/lib/banners/fetch-public-banners";
import { BANNER_PLACEMENT } from "@/lib/banners/locations";
import {
  groupBannersBySlot,
  type BannerSlotGroups,
} from "@/lib/banners/slots";

const fetchHomePageBannerGroups = cache(async (): Promise<BannerSlotGroups> => {
  const banners = await fetchPublicBannersForPlacement(
    BANNER_PLACEMENT.HOME_PAGE,
    false,
  );
  return groupBannersBySlot(banners, BANNER_PLACEMENT.HOME_PAGE);
});

/** Returns grouped homepage banners with a single cached fetch per request. */
export async function getHomePageBannerGroups(): Promise<BannerSlotGroups> {
  return fetchHomePageBannerGroups();
}

type HomePageBannerSlotProps = {
  groups: BannerSlotGroups;
  order: number;
};

/** Renders one homepage banner slot from pre-fetched groups. */
export function HomePageBannerSlot({ groups, order }: HomePageBannerSlotProps) {
  const banners = groups.slots.get(order) ?? [];
  return banners.length > 0 ? <PageBanner banners={banners} /> : null;
}

type HomePageBannerOverflowProps = {
  groups: BannerSlotGroups;
};

/** Renders overflow homepage banners from pre-fetched groups. */
export function HomePageBannerOverflow({
  groups,
}: HomePageBannerOverflowProps) {
  return groups.overflow.map(([order, banners]) => (
    <PageBanner key={order} banners={banners} />
  ));
}
