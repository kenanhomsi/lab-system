type navbarActionIcon = "notification" | "help";
type navbarProfileMenuItemId = "profile" | "settings" | "logout";

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
  navbarProfile,
  navbarConfig,
  navbarProfileMenuItem,
  navbarProfileMenuItemId,
};
