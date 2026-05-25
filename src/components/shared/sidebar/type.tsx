type SidebarIconKey =
  | "home"
  | "users"
  | "calendar"
  | "creditCard"
  | "messageSquare"
  | "settings"
  | "flask"
  | "clipboardList"
  | "clipboardCheck"
  | "userPlus"
  | "alertCircle";

type sideBarItem = {
  label: string;
  href: string;
  icon: SidebarIconKey;
};

type utilityItem = "light" | "dark";

export type { sideBarItem, SidebarIconKey, utilityItem };