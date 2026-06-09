import type { BannerItem } from "@/types/banner";
import {
  BANNER_PLACEMENT,
  type BannerPlacement,
} from "./locations";

export type BannerSlotDefinition = {
  order: number;
  labelKey: string;
};

export type BannerSlotLocation =
  | typeof BANNER_PLACEMENT.HOME_PAGE
  | typeof BANNER_PLACEMENT.ABOUT
  | typeof BANNER_PLACEMENT.BLOG
  | typeof BANNER_PLACEMENT.CONTACT
  | typeof BANNER_PLACEMENT.SERVICES
  | typeof BANNER_PLACEMENT.CAREERS
  | typeof BANNER_PLACEMENT.OFFERS
  | typeof BANNER_PLACEMENT.PLANS
  | typeof BANNER_PLACEMENT.TESTS;

export type BannerSlotGroups = {
  slots: ReadonlyMap<number, BannerItem[]>;
  overflow: ReadonlyArray<readonly [number, BannerItem[]]>;
};

const slot = (order: number, labelKey: string): BannerSlotDefinition => ({
  order,
  labelKey,
});

/** Stable insertion positions available to full-width website banners. */
export const BANNER_SLOT_REGISTRY: Record<
  BannerSlotLocation,
  readonly BannerSlotDefinition[]
> = {
  [BANNER_PLACEMENT.HOME_PAGE]: [
    slot(1, "afterHero"),
    slot(2, "afterEditorial"),
    slot(3, "afterServices"),
    slot(4, "afterSlideCards"),
    slot(5, "afterMedicalAdvice"),
    slot(6, "afterQuality"),
    slot(7, "afterDepartments"),
    slot(8, "afterEquipment"),
    slot(9, "afterBranches"),
    slot(10, "afterPartners"),
    slot(11, "afterClients"),
  ],
  [BANNER_PLACEMENT.ABOUT]: [
    slot(1, "afterHero"),
    slot(2, "afterTimeline"),
    slot(3, "afterMethodology"),
    slot(4, "afterLeadership"),
    slot(5, "afterAccreditation"),
    slot(6, "afterCta"),
  ],
  [BANNER_PLACEMENT.BLOG]: [
    slot(1, "afterHero"),
    slot(2, "afterContent"),
  ],
  [BANNER_PLACEMENT.CONTACT]: [
    slot(1, "afterHero"),
    slot(2, "afterInfo"),
    slot(3, "afterForm"),
    slot(4, "afterBranches"),
  ],
  [BANNER_PLACEMENT.SERVICES]: [
    slot(1, "afterHero"),
    slot(2, "afterCategories"),
    slot(3, "afterTestsOverview"),
    slot(4, "afterCta"),
  ],
  [BANNER_PLACEMENT.CAREERS]: [
    slot(1, "afterIntroduction"),
    slot(2, "afterVacancies"),
    slot(3, "afterApplication"),
  ],
  [BANNER_PLACEMENT.OFFERS]: [
    slot(1, "afterIntroduction"),
    slot(2, "afterContent"),
  ],
  [BANNER_PLACEMENT.PLANS]: [
    slot(1, "afterIntroduction"),
    slot(2, "afterPlans"),
    slot(3, "afterVouchers"),
  ],
  [BANNER_PLACEMENT.TESTS]: [
    slot(1, "afterIntroduction"),
    slot(2, "afterContent"),
  ],
};

export const BANNER_SLOT_LOCATIONS = Object.keys(
  BANNER_SLOT_REGISTRY,
) as BannerSlotLocation[];

export function isBannerSlotLocation(
  location: BannerPlacement | string,
): location is BannerSlotLocation {
  return Object.prototype.hasOwnProperty.call(BANNER_SLOT_REGISTRY, location);
}

export function getBannerSlots(
  location: BannerPlacement | string,
): readonly BannerSlotDefinition[] {
  return isBannerSlotLocation(location) ? BANNER_SLOT_REGISTRY[location] : [];
}

export function isValidBannerSlot(location: string, order: number): boolean {
  return getBannerSlots(location).some((item) => item.order === order);
}

const compareBanners = (left: BannerItem, right: BannerItem): number => {
  const byCreatedAt = left.createdAt.localeCompare(right.createdAt);
  return byCreatedAt !== 0 ? byCreatedAt : left.id.localeCompare(right.id);
};

/** Groups banners into declared slots and ordered legacy overflow groups. */
export function groupBannersBySlot(
  banners: BannerItem[],
  location: BannerPlacement | string,
): BannerSlotGroups {
  const validOrders = new Set(getBannerSlots(location).map((item) => item.order));
  const grouped = new Map<number, BannerItem[]>();

  for (const banner of banners) {
    const group = grouped.get(banner.displayOrder) ?? [];
    group.push(banner);
    grouped.set(banner.displayOrder, group);
  }

  for (const group of grouped.values()) {
    group.sort(compareBanners);
  }

  const slots = new Map<number, BannerItem[]>();
  const overflow: Array<readonly [number, BannerItem[]]> = [];
  for (const [order, group] of [...grouped.entries()].sort(
    ([left], [right]) => left - right,
  )) {
    if (validOrders.has(order)) slots.set(order, group);
    else overflow.push([order, group]);
  }

  return { slots, overflow };
}
