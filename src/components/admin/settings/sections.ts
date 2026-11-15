import type { SidebarIconKey } from "@/components/shared/sidebar/type";

/** Settings section ids — also the value of the `?tab=` URL param. */
export type SettingsSectionKey =
  | "roles"
  | "accessPolicies"
  | "websiteContentMap"
  | "navbar"
  | "websitePages"
  | "slideCards"
  | "banners"
  | "ads"
  | "welcomePages"
  | "medicalTestCategories"
  | "accounting";

export type SettingsGroupKey = "access" | "website" | "lookups" | "dashboardContent";

export type SettingsSection = {
  key: SettingsSectionKey;
  /** Translation key under `admin.settings` for the section name. */
  labelKey: string;
  icon: SidebarIconKey;
};

export type SettingsGroup = {
  key: SettingsGroupKey;
  icon: SidebarIconKey;
  sections: SettingsSection[];
};

/**
 * Single source of truth for how admin settings are grouped and ordered.
 * Descriptions live under `admin.settings.sectionInfo.<key>` and
 * `admin.settings.groups.<groupKey>` in the message files.
 */
export const SETTINGS_GROUPS: SettingsGroup[] = [
  {
    key: "access",
    icon: "shieldCheck",
    sections: [
      { key: "roles", labelKey: "tabRoles", icon: "users" },
      { key: "accessPolicies", labelKey: "tabAccessPolicies", icon: "lock" },
    ],
  },
  {
    key: "website",
    icon: "globe",
    sections: [
      { key: "websiteContentMap", labelKey: "tabWebsiteContentMap", icon: "map" },
      { key: "navbar", labelKey: "tabNavbar", icon: "layout" },
      { key: "websitePages", labelKey: "tabWebsitePages", icon: "fileText" },
      { key: "slideCards", labelKey: "tabSlideCards", icon: "layers" },
      { key: "banners", labelKey: "tabBanners", icon: "image" },
      { key: "ads", labelKey: "tabAds", icon: "monitor" },
      { key: "welcomePages", labelKey: "tabWelcomePages", icon: "smile" },
    ],
  },
  {
    key: "lookups",
    icon: "database",
    sections: [
      { key: "medicalTestCategories", labelKey: "tabMedicalTestCategories", icon: "category" },
    ],
  },
  {
    key: "dashboardContent",
    icon: "layout",
    sections: [{ key: "accounting", labelKey: "tabAccounting", icon: "dollarSign" }],
  },
];

export const SETTINGS_SECTIONS: Array<SettingsSection & { group: SettingsGroupKey }> =
  SETTINGS_GROUPS.flatMap((group) =>
    group.sections.map((section) => ({ ...section, group: group.key })),
  );

export const isSettingsSectionKey = (value: string | null): value is SettingsSectionKey =>
  SETTINGS_SECTIONS.some((section) => section.key === value);
