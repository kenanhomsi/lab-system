import type { BannerItem } from "@/types/banner";

/** Auto-advance interval for banner carousels (ms). */
export const BANNER_ROTATE_MS = 15_000;

export const WEBSITE_BANNERS_QUERY_KEY = ["website-banners-public"] as const;

/** Canonical placement strings stored in the API `location` field. */
export const BANNER_PLACEMENT = {
  HOME_PAGE: "homepage",
  ABOUT: "about",
  BLOG: "blog",
  CONTACT: "contact",
  SERVICES: "services",
  CAREERS: "careers",
  OFFERS: "offers",
  /** Fixed strip / dismissible ad placement (e.g. GlobalAdBar). */
  AD_BAR: "ad",
  PLANS: "plans",
  TESTS: "tests",
  /** Matches any role-specific dashboard when filtering. */
  DASHBOARD: "dashboard",
  ADMIN_DASHBOARD: "admin_dashboard",
  DOCTOR_DASHBOARD: "doctor_dashboard",
  PATIENT_DASHBOARD: "patient_dashboard",
  LAB_DASHBOARD: "lab_dashboard",
} as const;

export type BannerPlacement =
  (typeof BANNER_PLACEMENT)[keyof typeof BANNER_PLACEMENT];

export const BANNER_PLACEMENT_VALUES: readonly BannerPlacement[] =
  Object.values(BANNER_PLACEMENT);

const CANONICAL_SET = new Set<string>(BANNER_PLACEMENT_VALUES);

/** Legacy / free-text values mapped to canonical placements. */
const PLACEMENT_ALIASES: Record<string, BannerPlacement> = {
  home: BANNER_PLACEMENT.HOME_PAGE,
  homepage: BANNER_PLACEMENT.HOME_PAGE,
  "الصفحة الرئيسية": BANNER_PLACEMENT.HOME_PAGE,
  "الرئيسية": BANNER_PLACEMENT.HOME_PAGE,
  about: BANNER_PLACEMENT.ABOUT,
  "من نحن": BANNER_PLACEMENT.ABOUT,
  blog: BANNER_PLACEMENT.BLOG,
  "المدونة": BANNER_PLACEMENT.BLOG,
  contact: BANNER_PLACEMENT.CONTACT,
  "اتصل بنا": BANNER_PLACEMENT.CONTACT,
  services: BANNER_PLACEMENT.SERVICES,
  "الخدمات": BANNER_PLACEMENT.SERVICES,
  careers: BANNER_PLACEMENT.CAREERS,
  ad: BANNER_PLACEMENT.AD_BAR,
  ad_bar: BANNER_PLACEMENT.AD_BAR,
  offers: BANNER_PLACEMENT.OFFERS,
  plans: BANNER_PLACEMENT.PLANS,
  tests: BANNER_PLACEMENT.TESTS,
  dashboard: BANNER_PLACEMENT.DASHBOARD,
  admin_dashboard: BANNER_PLACEMENT.ADMIN_DASHBOARD,
  doctor_dashboard: BANNER_PLACEMENT.DOCTOR_DASHBOARD,
  patient_dashboard: BANNER_PLACEMENT.PATIENT_DASHBOARD,
  lab_dashboard: BANNER_PLACEMENT.LAB_DASHBOARD,
};

const isRoleDashboard = (placement: string) => placement.endsWith("_dashboard");

export function normalizeBannerPlacement(raw: string): BannerPlacement | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const aliasHit = PLACEMENT_ALIASES[trimmed] ?? PLACEMENT_ALIASES[trimmed.toLowerCase()];
  if (aliasHit) return aliasHit;

  if (CANONICAL_SET.has(trimmed)) return trimmed as BannerPlacement;
  if (CANONICAL_SET.has(trimmed.toLowerCase())) {
    return trimmed.toLowerCase() as BannerPlacement;
  }

  return null;
}

export function bannerMatchesPlacement(
  bannerLocation: string,
  wanted: string,
): boolean {
  const normBanner = normalizeBannerPlacement(bannerLocation);
  const normWanted = normalizeBannerPlacement(wanted);

  if (!normBanner || !normWanted) return false;
  if (normBanner === normWanted) return true;

  // Generic "dashboard" banner appears on every role dashboard.
  if (normBanner === BANNER_PLACEMENT.DASHBOARD && isRoleDashboard(normWanted)) {
    return true;
  }

  return false;
}

export function filterBannersByPlacement(
  items: BannerItem[],
  wanted: string,
): BannerItem[] {
  return items
    .filter((item) => item.isActive && bannerMatchesPlacement(item.location, wanted))
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getPageLocationFromPath(pathname: string): BannerPlacement {
  const path = pathname.toLowerCase();

  if (path.includes("/about")) return BANNER_PLACEMENT.ABOUT;
  if (path.includes("/blog")) return BANNER_PLACEMENT.BLOG;
  if (path.includes("/contact")) return BANNER_PLACEMENT.CONTACT;
  if (path.includes("/services")) return BANNER_PLACEMENT.SERVICES;
  if (path.includes("/careers")) return BANNER_PLACEMENT.CAREERS;
  if (path.includes("/offers")) return BANNER_PLACEMENT.OFFERS;
  if (path.includes("/plans")) return BANNER_PLACEMENT.PLANS;
  if (path.includes("/tests")) return BANNER_PLACEMENT.TESTS;
  if (path === "/" || path.includes("/home")) return BANNER_PLACEMENT.HOME_PAGE;

  return BANNER_PLACEMENT.HOME_PAGE;
}
