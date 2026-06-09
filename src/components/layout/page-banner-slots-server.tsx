import { cache } from "react";
import { fetchPublicBannersForPlacement } from "@/lib/banners/fetch-public-banners";
import {
  groupBannersBySlot,
  type BannerSlotLocation,
} from "@/lib/banners/slots";
import { PageBanner } from "./page-banner";

const fetchGroups = cache(async (placement: BannerSlotLocation) => {
  const banners = await fetchPublicBannersForPlacement(placement, false);
  return groupBannersBySlot(banners, placement);
});

type PageBannerSlotServerProps = {
  placement: BannerSlotLocation;
  order: number;
};

/** Renders one declared full-width banner insertion slot. */
export async function PageBannerSlotServer({
  placement,
  order,
}: PageBannerSlotServerProps) {
  const groups = await fetchGroups(placement);
  const banners = groups.slots.get(order) ?? [];
  return banners.length > 0 ? <PageBanner banners={banners} /> : null;
}

/** Appends invalid legacy display-order groups after the page content. */
export async function PageBannerOverflowServer({
  placement,
}: {
  placement: BannerSlotLocation;
}) {
  const groups = await fetchGroups(placement);
  return groups.overflow.map(([order, banners]) => (
    <PageBanner key={order} banners={banners} />
  ));
}
