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
        label: "adminMedicalTests",
        href: "/admin/medical-tests",
        icon: "flask",
      },
      {
        label: "adminTestRequests",
        href: "/admin/test-requests",
        icon: "clipboardList",
      },
      {
        label: "adminTestResults",
        href: "/admin/test-results",
        icon: "clipboardCheck",
      },
      {
        label: "chat",
        href: "/admin/chat",
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
      {
        label: "doctorTestRequests",
        href: "/doctor/test-requests",
        icon: "clipboardList",
      },
      {
        label: "doctorTestResults",
        href: "/doctor/test-results",
        icon: "clipboardCheck",
      },
      {
        label: "externalPatients",
        href: "/doctor/external-patients",
        icon: "userPlus",
      },
      {
        label: "chat",
        href: "/doctor/chat",
        icon: "messageSquare",
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
        label: "patientTestRequests",
        href: "/patient/test-requests",
        icon: "clipboardList",
      },
      {
        label: "patientTestResults",
        href: "/patient/test-results",
        icon: "clipboardCheck",
      },
      {
        label: "chat",
        href: "/patient/chat",
        icon: "messageSquare",
      },
    ],
    getNavbarConfig: withNavbarProfileOverrides("Noor Hassan", "PATIENT"),
    canAccess: (route: string) => route.startsWith("/patient"),
  },
  labpartner: {
    getDashboardRoute: () => "/lab/dashboard",
    getSiderBarItems: (): sideBarItem[] => [
      {
        label: "dashboard",
        href: "/lab/dashboard",
        icon: "home",
      },
      {
        label: "labTestRequests",
        href: "/lab/test-requests",
        icon: "clipboardList",
      },
      {
        label: "labTestResults",
        href: "/lab/test-results",
        icon: "clipboardCheck",
      },
      {
        label: "externalPatients",
        href: "/lab/external-patients",
        icon: "userPlus",
      },
      {
        label: "chat",
        href: "/lab/chat",
        icon: "messageSquare",
      },
    ],
    getNavbarConfig: withNavbarProfileOverrides(
      "Dr. Elena Vance",
      "LAB DIRECTOR",
    ),
    canAccess: (route: string) => route.startsWith("/lab"),
  },
  secretary: {
    getDashboardRoute: () => "/secretary/dashboard",
    getSiderBarItems: (): sideBarItem[] => [
      {
        label: "dashboard",
        href: "/secretary/dashboard",
        icon: "home",
      },
      {
        label: "adminMedicalTests",
        href: "/secretary/medical-tests",
        icon: "flask",
      },
      {
        label: "adminTestRequests",
        href: "/secretary/test-requests",
        icon: "clipboardList",
      },
      {
        label: "adminTestResults",
        href: "/secretary/test-results",
        icon: "clipboardCheck",
      },
    ],
    getNavbarConfig: withNavbarProfileOverrides("Sara Nabil", "SECRETARY"),
    canAccess: (route: string) => route.startsWith("/secretary"),
  },
};
