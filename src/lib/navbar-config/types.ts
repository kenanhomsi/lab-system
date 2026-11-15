import { z } from "zod";

/**
 * Fixed navbar entries. Keys are stable; hrefs stay hard-coded in the header.
 * Admins may only rename (ar/en) or hide these entries.
 */
export const NAVBAR_ITEM_KEYS = [
  "home",
  "labGroup",
  "about",
  "quality",
  "services",
  "tests",
  "careers",
  "joinAsClient",
  "blog",
  "contact",
] as const;

export type NavbarItemKey = (typeof NAVBAR_ITEM_KEYS)[number];

/** Children that belong to a group and cannot be shown without it. */
export const NAVBAR_GROUP_CHILDREN: Partial<Record<NavbarItemKey, NavbarItemKey[]>> = {
  labGroup: ["about", "quality"],
};

export const navbarItemConfigSchema = z.object({
  key: z.enum(NAVBAR_ITEM_KEYS),
  visible: z.boolean(),
  labelAr: z.string().max(60).default(""),
  labelEn: z.string().max(60).default(""),
});

export const navbarConfigSchema = z.object({
  items: z.array(navbarItemConfigSchema).max(NAVBAR_ITEM_KEYS.length),
});

export type NavbarItemConfig = z.infer<typeof navbarItemConfigSchema>;
export type NavbarConfig = z.infer<typeof navbarConfigSchema>;

export const DEFAULT_NAVBAR_CONFIG: NavbarConfig = {
  items: NAVBAR_ITEM_KEYS.map((key) => ({
    key,
    visible: true,
    labelAr: "",
    labelEn: "",
  })),
};

/** Fills missing keys with defaults and drops duplicates; keeps stored order of keys. */
export function normalizeNavbarConfig(input: unknown): NavbarConfig {
  const parsed = navbarConfigSchema.safeParse(input);
  if (!parsed.success) return DEFAULT_NAVBAR_CONFIG;
  const seen = new Set<NavbarItemKey>();
  const items: NavbarItemConfig[] = [];
  for (const item of parsed.data.items) {
    if (seen.has(item.key)) continue;
    seen.add(item.key);
    items.push({
      ...item,
      labelAr: item.labelAr.trim(),
      labelEn: item.labelEn.trim(),
    });
  }
  for (const def of DEFAULT_NAVBAR_CONFIG.items) {
    if (!seen.has(def.key)) items.push(def);
  }
  return { items };
}

/** Rules enforced on save: at least one top-level item stays visible. */
export function validateNavbarConfig(config: NavbarConfig): string | null {
  const childKeys = new Set(Object.values(NAVBAR_GROUP_CHILDREN).flat());
  const anyTopVisible = config.items.some(
    (item) => item.visible && !childKeys.has(item.key),
  );
  return anyTopVisible ? null : "At least one navbar item must stay visible";
}
