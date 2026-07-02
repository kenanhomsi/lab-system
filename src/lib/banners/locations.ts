import type { BannerItem } from "@/types/banner";
import {
  BANNER_PLACEMENT,
  type BannerPlacement,
  normalizeBannerPlacement,
} from "./placements";
import {
  isPathTarget,
  normalizeTargetPath,
  parsePathTarget,
  pathTargetMatches,
  sortByTargetPriority,
} from "./page-target";

export {
  BANNER_PLACEMENT,
  BANNER_PLACEMENT_VALUES,
  BANNER_ROTATE_MS,
  WEBSITE_BANNERS_QUERY_KEY,
  normalizeBannerPlacement,
  type BannerPlacement,
} from "./placements";

const isRoleDashboard = (placement: string) => placement.endsWith("_dashboard");

export function bannerMatchesPlacement(
  bannerLocation: string,
  wanted: string,
): boolean {
  if (isPathTarget(bannerLocation) && isPathTarget(wanted)) {
    const bannerPath = parsePathTarget(bannerLocation);
    const wantedPath = parsePathTarget(wanted);
    if (!bannerPath || !wantedPath) return false;
    return normalizeTargetPath(bannerPath) === normalizeTargetPath(wantedPath);
  }
  if (isPathTarget(bannerLocation) || isPathTarget(wanted)) {
    return false;
  }

  const normBanner = normalizeBannerPlacement(bannerLocation);
  const normWanted = normalizeBannerPlacement(wanted);

  if (!normBanner || !normWanted) return false;
  if (normBanner === normWanted) return true;

  // Generic "dashboard" banner appears on every role dashboard.
  if (
    normBanner === BANNER_PLACEMENT.DASHBOARD &&
    isRoleDashboard(normWanted)
  ) {
    return true;
  }

  return false;
}

export function sectionTargetMatches(
  storedTarget: string,
  sectionPlacement: BannerPlacement | null,
): boolean {
  if (!sectionPlacement || isPathTarget(storedTarget)) return false;
  return bannerMatchesPlacement(storedTarget, sectionPlacement);
}

export function filterByTarget<T>(
  items: T[],
  getTarget: (item: T) => string,
  currentPath: string,
): T[] {
  const normalizedPath = normalizeTargetPath(currentPath);
  const section = getPageLocationFromPath(normalizedPath);

  const matched = items.filter((item) => {
    const target = getTarget(item);
    if (pathTargetMatches(target, normalizedPath)) return true;
    if (section && sectionTargetMatches(target, section)) return true;
    return false;
  });

  return sortByTargetPriority(matched, getTarget);
}

export function filterBannersByPlacement(
  items: BannerItem[],
  wanted: string,
): BannerItem[] {
  return items
    .filter(
      (item) => item.isActive && bannerMatchesPlacement(item.location, wanted),
    )
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getPageLocationFromPath(pathname: string): BannerPlacement | null {
  const path = pathname.toLowerCase().replace(/\/+$/, "") || "/";

  if (path === "/" || path.endsWith("/home")) return BANNER_PLACEMENT.HOME_PAGE;
  if (path.includes("/about")) return BANNER_PLACEMENT.ABOUT;
  if (path.includes("/blog")) return BANNER_PLACEMENT.BLOG;
  if (path.includes("/contact")) return BANNER_PLACEMENT.CONTACT;
  if (path.includes("/services")) return BANNER_PLACEMENT.SERVICES;
  if (path.includes("/careers")) return BANNER_PLACEMENT.CAREERS;
  if (path.includes("/offers")) return BANNER_PLACEMENT.OFFERS;
  if (path.includes("/plans")) return BANNER_PLACEMENT.PLANS;
  if (path.includes("/tests")) return BANNER_PLACEMENT.TESTS;

  return null;
}

export function filterAdsByPlacement<T extends { addressName?: string }>(
  items: T[],
  wanted: string,
): T[] {
  return items.filter(
    (item) =>
      Boolean(item.addressName) &&
      bannerMatchesPlacement(item.addressName!, wanted),
  );
}

export function filterBannersByPath(
  items: BannerItem[],
  currentPath: string,
): BannerItem[] {
  return filterByTarget(
    items.filter((item) => item.isActive),
    (item) => item.location,
    currentPath,
  );
}

export function filterAdsByPath<T extends { addressName?: string }>(
  items: T[],
  currentPath: string,
): T[] {
  return filterByTarget(
    items.filter((item) => Boolean(item.addressName)),
    (item) => item.addressName!,
    currentPath,
  );
}

export {
  buildPathTarget,
  formatPageTargetLabel,
  inferResourceTypeFromTarget,
  isDetailPagePath,
  isPathTarget,
  normalizeTargetPath,
  parsePathTarget,
  parsePathResource,
  PATH_TARGET_PREFIX,
  type PageResourceType,
} from "./page-target";
