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
  navbarProfileMenuItem,
  navbarProfileMenuItemId,
};
