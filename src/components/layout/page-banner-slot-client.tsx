"use client";

import { groupBannersBySlot, type BannerSlotLocation } from "@/lib/banners/slots";
import { usePublicBanners } from "@/lib/banners/use-public-banners";
import { PageBanner } from "./page-banner";

type PageBannerSlotClientProps = {
  placement: BannerSlotLocation;
  order: number;
};

/** Renders a banner slot inside an existing client-rendered page. */
export function PageBannerSlotClient({
  placement,
  order,
}: PageBannerSlotClientProps) {
  const { banners } = usePublicBanners({ placement });
  const group = groupBannersBySlot(banners, placement).slots.get(order) ?? [];
  return group.length > 0 ? <PageBanner banners={group} /> : null;
}

/** Appends invalid legacy display-order groups inside a client page. */
export function PageBannerOverflowClient({
  placement,
}: {
  placement: BannerSlotLocation;
}) {
  const { banners } = usePublicBanners({ placement });
  const groups = groupBannersBySlot(banners, placement).overflow;
  return groups.map(([order, group]) => <PageBanner key={order} banners={group} />);
}
