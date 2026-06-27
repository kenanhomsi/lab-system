type SidebarIconKey =
  | "home"
  | "users"
  | "calendar"
  | "creditCard"
  | "messageSquare"
  | "settings"
  | "flask"
  | "category"
  | "clipboardList"
  | "clipboardCheck"
  | "userPlus"
  | "alertCircle"
  | "shieldCheck"
  | "briefcase"
  | "fileText"
  | "store"
  | "dollarSign"
  | "layers"
  | "userCheck"
  | "filePlus"
  | "minusCircle"
  | "barChart"
  | "checkSquare";

type sideBarItem = {
  label: string;
  href: string;
  icon: SidebarIconKey;
  /** Optional translation key under sidebar.* for section grouping */
  group?: string;
};

type utilityItem = "light" | "dark";

export type { sideBarItem, SidebarIconKey, utilityItem };
