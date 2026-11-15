import type { SidebarIconKey, sideBarItem } from "@/components/shared/sidebar/type";

type navbarActionIcon = "notification" | "help";
type navbarProfileMenuItemId = "profile" | "settings" | "logout";

type navbarQuickActionIcon =
  | "userPlus"
  | "flask"
  | "clipboardList"
  | "clipboardCheck"
  | "creditCard"
  | "alertCircle"
  | "shield"
  | "filePlus";

type navbarQuickAction = {
  id: string;
  label: string;
  description: string;
  icon: navbarQuickActionIcon;
  href: string;
  color: string;
  /** Opens this modal on the target page via `?open=` query param */
  modal?: string;
  /** Optional settings tab (e.g. roles on admin settings) */
  tab?: string;
};

/** Extra searchable destination (e.g. a settings section) for the command palette. */
type navbarPaletteLink = {
  id: string;
  /** Full translation key (from the messages root). */
  labelKey: string;
  /** Full translation key for the secondary line. */
  hintKey?: string;
  href: string;
  icon: SidebarIconKey;
};

type navbarActionItem = {
  label: string;
  icon: navbarActionIcon;
  href?: string;
};

type navbarProfile = {
  name: string;
  roleTitle: string;
  avatarSrc?: string;
  avatarFallback?: string;
};

type navbarConfig = {
  searchPlaceholder: string;
  searchValue?: string;
  actions: navbarActionItem[];
  quickActions?: navbarQuickAction[];
  /** Role navigation pages, surfaced in the command palette ("Go to"). */
  navItems?: sideBarItem[];
  /** Deeper destinations (sub-sections) surfaced in the command palette. */
  paletteLinks?: navbarPaletteLink[];
  profile: navbarProfile;
  profileMenu: navbarProfileMenuItem[];
};

type navbarProfileMenuItem = {
  id: navbarProfileMenuItemId;
  label: string;
  href?: string;
};

export type {
  navbarActionIcon,
  navbarActionItem,
  navbarQuickAction,
  navbarQuickActionIcon,
  navbarProfile,
  navbarConfig,
  navbarPaletteLink,
  navbarProfileMenuItem,
  navbarProfileMenuItemId,
};
