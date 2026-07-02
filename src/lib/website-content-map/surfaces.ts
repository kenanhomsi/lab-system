import {
  BANNER_PLACEMENT,
  type BannerPlacement,
} from "@/lib/banners/locations";
import {
  BANNER_SLOT_LOCATIONS,
  type BannerSlotLocation,
} from "@/lib/banners/slots";

export type WebsiteSurfaceSection =
  | { kind: "staticSection"; labelKey: string }
  | { kind: "bannerSlot"; order: number }
  | { kind: "slideCards" }
  | { kind: "bannerSlider"; placement: BannerPlacement; labelKey: string }
  | { kind: "overflow" };

export type BuiltinWebsiteSurface = {
  id: BannerSlotLocation;
  placement: BannerSlotLocation;
  path: string;
  sections: WebsiteSurfaceSection[];
};

export const SITE_WIDE_SURFACE_ID = "siteWide" as const;

const staticSection = (labelKey: string): WebsiteSurfaceSection => ({
  kind: "staticSection",
  labelKey,
});

const bannerSlot = (order: number): WebsiteSurfaceSection => ({
  kind: "bannerSlot",
  order,
});

const bannerSlider = (
  placement: BannerPlacement,
  labelKey: string,
): WebsiteSurfaceSection => ({
  kind: "bannerSlider",
  placement,
  labelKey,
});

/** Ordered wireframe sections aligned with public page component trees. */
export const WEBSITE_BUILTIN_SURFACES: Record<
  BannerSlotLocation,
  BuiltinWebsiteSurface
> = {
  [BANNER_PLACEMENT.HOME_PAGE]: {
    id: BANNER_PLACEMENT.HOME_PAGE,
    placement: BANNER_PLACEMENT.HOME_PAGE,
    path: "/",
    sections: [
      staticSection("hero"),
      bannerSlot(1),
      staticSection("editorial"),
      bannerSlot(2),
      staticSection("servicesGrid"),
      bannerSlot(3),
      { kind: "slideCards" },
      bannerSlot(4),
      staticSection("testsSpotlight"),
      bannerSlot(5),
      bannerSlider(BANNER_PLACEMENT.MEDICAL_ADVICE, "medicalAdviceSlider"),
      bannerSlot(6),
      staticSection("quality"),
      bannerSlot(7),
      staticSection("departments"),
      bannerSlot(8),
      bannerSlider(BANNER_PLACEMENT.EQUIPMENT, "equipmentSlider"),
      bannerSlot(9),
      staticSection("branchesMap"),
      bannerSlot(10),
      staticSection("partnersStrip"),
      bannerSlider(BANNER_PLACEMENT.PARTNERS, "partnersSlider"),
      bannerSlot(11),
      bannerSlider(BANNER_PLACEMENT.CLIENTS, "clientsSlider"),
      bannerSlot(12),
      { kind: "overflow" },
    ],
  },
  [BANNER_PLACEMENT.ABOUT]: {
    id: BANNER_PLACEMENT.ABOUT,
    placement: BANNER_PLACEMENT.ABOUT,
    path: "/about",
    sections: [
      staticSection("hero"),
      bannerSlot(1),
      staticSection("timeline"),
      bannerSlot(2),
      staticSection("methodology"),
      bannerSlot(3),
      staticSection("leadership"),
      bannerSlot(4),
      staticSection("accreditation"),
      bannerSlot(5),
      staticSection("cta"),
      bannerSlot(6),
      { kind: "overflow" },
    ],
  },
  [BANNER_PLACEMENT.BLOG]: {
    id: BANNER_PLACEMENT.BLOG,
    placement: BANNER_PLACEMENT.BLOG,
    path: "/blog",
    sections: [
      staticSection("hero"),
      bannerSlot(1),
      staticSection("postGrid"),
      bannerSlot(2),
      { kind: "overflow" },
    ],
  },
  [BANNER_PLACEMENT.CONTACT]: {
    id: BANNER_PLACEMENT.CONTACT,
    placement: BANNER_PLACEMENT.CONTACT,
    path: "/contact",
    sections: [
      staticSection("hero"),
      bannerSlot(1),
      staticSection("contactInfo"),
      bannerSlot(2),
      staticSection("contactForm"),
      bannerSlot(3),
      staticSection("branches"),
      bannerSlot(4),
      { kind: "overflow" },
    ],
  },
  [BANNER_PLACEMENT.SERVICES]: {
    id: BANNER_PLACEMENT.SERVICES,
    placement: BANNER_PLACEMENT.SERVICES,
    path: "/services",
    sections: [
      staticSection("hero"),
      bannerSlot(1),
      staticSection("categories"),
      bannerSlot(2),
      staticSection("testsOverview"),
      bannerSlot(3),
      staticSection("cta"),
      bannerSlot(4),
      { kind: "overflow" },
    ],
  },
  [BANNER_PLACEMENT.CAREERS]: {
    id: BANNER_PLACEMENT.CAREERS,
    placement: BANNER_PLACEMENT.CAREERS,
    path: "/careers",
    sections: [
      staticSection("hero"),
      staticSection("benefits"),
      bannerSlot(1),
      staticSection("vacancies"),
      bannerSlot(2),
      staticSection("applicationForm"),
      bannerSlot(3),
      { kind: "overflow" },
    ],
  },
  [BANNER_PLACEMENT.OFFERS]: {
    id: BANNER_PLACEMENT.OFFERS,
    placement: BANNER_PLACEMENT.OFFERS,
    path: "/offers",
    sections: [
      staticSection("introduction"),
      bannerSlot(1),
      staticSection("offersGrid"),
      bannerSlot(2),
      { kind: "overflow" },
    ],
  },
  [BANNER_PLACEMENT.PLANS]: {
    id: BANNER_PLACEMENT.PLANS,
    placement: BANNER_PLACEMENT.PLANS,
    path: "/plans",
    sections: [
      staticSection("introduction"),
      bannerSlot(1),
      staticSection("plansGrid"),
      bannerSlot(2),
      staticSection("vouchers"),
      bannerSlot(3),
      { kind: "overflow" },
    ],
  },
  [BANNER_PLACEMENT.TESTS]: {
    id: BANNER_PLACEMENT.TESTS,
    placement: BANNER_PLACEMENT.TESTS,
    path: "/tests",
    sections: [
      staticSection("introduction"),
      bannerSlot(1),
      staticSection("testsCatalog"),
      bannerSlot(2),
      { kind: "overflow" },
    ],
  },
};

export const WEBSITE_BUILTIN_SURFACE_LIST = BANNER_SLOT_LOCATIONS.map(
  (id) => WEBSITE_BUILTIN_SURFACES[id],
);
