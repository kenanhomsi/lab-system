import type { sideBarItem } from "@/components/shared/sidebar/type";
import type { navbarConfig } from "@/components/shared/navbar/type";

type NavbarProfileOverrides = {
  name?: string;
  roleTitle?: string;
};

const buildNavbarConfig = (name: string, roleTitle: string): navbarConfig => ({
  searchPlaceholder: "searchPlaceholder",
  actions: [
    {
      label: "notifications",
      icon: "notification",
    },
    {
      label: "help",
      icon: "help",
    },
  ],
  profile: {
    name,
    roleTitle,
  },
  profileMenu: [
    {
      id: "profile",
      label: "profile",
      href: "/profile",
    },
    {
      id: "settings",
      label: "settings",
      href: "/settings",
    },
    {
      id: "logout",
      label: "logout",
    },
  ],
});

const withNavbarProfileOverrides =
  (defaultName: string, defaultRoleTitle: string) =>
  (profile?: NavbarProfileOverrides): navbarConfig =>
    buildNavbarConfig(
      profile?.name?.trim() || defaultName,
      profile?.roleTitle?.trim() || defaultRoleTitle,
    );

export const roleStrategy = {
  admin: {
    getDashboardRoute: () => "/admin/dashboard",
    getSiderBarItems: (): sideBarItem[] => [
      {
        label: "dashboard",
        href: "/admin/dashboard",
        icon: "home",
      },
      {
        label: "adminUsers",
        href: "/admin/users",
        icon: "users",
      },
      {
        label: "adminAppointments",
        href: "/admin/appointments",
        icon: "calendar",
      },
      {
        label: "adminSubscriptions",
        href: "/admin/subscription-packages",
        icon: "creditCard",
      },
      {
        label: "adminComplaints",
        href: "/admin/complaints",
        icon: "messageSquare",
      },
      {
        label: "adminSettings",
        href: "/admin/settings",
        icon: "settings",
      },
    ],
    getNavbarConfig: withNavbarProfileOverrides(
      "Dr. Elena Vance",
      "LAB DIRECTOR",
    ),
    canAccess: (route: string) => route.startsWith("/admin"),
  },
  doctor: {
    getDashboardRoute: () => "/doctor/dashboard",
    getSiderBarItems: (): sideBarItem[] => [
      {
        label: "dashboard",
        href: "/doctor/dashboard",
        icon: "home",
      },
    ],
    getNavbarConfig: withNavbarProfileOverrides("Dr. Ahmad Salem", "DOCTOR"),
    canAccess: (route: string) => route.startsWith("/doctor"),
  },
  patient: {
    getDashboardRoute: () => "/patient/dashboard",
    getSiderBarItems: (): sideBarItem[] => [
      {
        label: "dashboard",
        href: "/patient/dashboard",
        icon: "home",
      },
      {
        label: "appointments",
        href: "/patient/appointments",
        icon: "calendar",
      },
    ],
    getNavbarConfig: withNavbarProfileOverrides("Noor Hassan", "PATIENT"),
    canAccess: (route: string) => route.startsWith("/patient"),
  },
  lab: {
    getDashboardRoute: () => "/lab/dashboard",
    getSiderBarItems: (): sideBarItem[] => [
      {
        label: "Dashboard",
        href: "/lab/dashboard",
        icon: "home",
      },
    ],
    getNavbarConfig: withNavbarProfileOverrides(
      "Dr. Elena Vance",
      "LAB DIRECTOR",
    ),
    canAccess: (route: string) => route.startsWith("/lab"),
  },
};
