import type { sideBarItem } from "@/components/shared/sidebar/type";
import type { navbarConfig, navbarQuickAction } from "@/components/shared/navbar/type";

type NavbarProfileOverrides = {
  name?: string;
  roleTitle?: string;
};

const buildNavbarConfig = (
  name: string,
  roleTitle: string,
  quickActions: navbarQuickAction[] = [],
): navbarConfig => ({
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
  quickActions,
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

const adminQuickActions: navbarQuickAction[] = [
  {
    id: "create-user",
    label: "createUser.label",
    description: "createUser.description",
    icon: "userPlus",
    href: "/admin/users",
    color: "blue",
    modal: "create",
  },
  {
    id: "add-medical-test",
    label: "addMedicalTest.label",
    description: "addMedicalTest.description",
    icon: "flask",
    href: "/admin/medical-tests",
    color: "teal",
    modal: "create",
  },
  {
    id: "create-test-request",
    label: "createTestRequest.label",
    description: "createTestRequest.description",
    icon: "clipboardList",
    href: "/admin/test-requests",
    color: "orange",
    modal: "create",
  },
  {
    id: "create-subscription",
    label: "createSubscription.label",
    description: "createSubscription.description",
    icon: "creditCard",
    href: "/admin/subscription-packages",
    color: "violet",
    modal: "create",
  },
  {
    id: "create-role",
    label: "createRole.label",
    description: "createRole.description",
    icon: "shield",
    href: "/admin/settings",
    color: "indigo",
    modal: "create",
    tab: "roles",
  },
];

const doctorQuickActions: navbarQuickAction[] = [
  {
    id: "add-external-patient",
    label: "addExternalPatient.label",
    description: "addExternalPatient.description",
    icon: "userPlus",
    href: "/doctor/external-patients",
    color: "blue",
    modal: "create",
  },
  {
    id: "create-test-request",
    label: "createTestRequest.label",
    description: "createTestRequest.description",
    icon: "clipboardList",
    href: "/doctor/test-requests",
    color: "orange",
    modal: "create",
  },
  {
    id: "submit-complaint",
    label: "submitComplaint.label",
    description: "submitComplaint.description",
    icon: "alertCircle",
    href: "/doctor/complaints",
    color: "red",
    modal: "create",
  },
];

const patientQuickActions: navbarQuickAction[] = [
  {
    id: "create-test-request",
    label: "createTestRequest.label",
    description: "createTestRequest.description",
    icon: "clipboardList",
    href: "/patient/test-requests",
    color: "orange",
    modal: "create",
  },
  {
    id: "submit-complaint",
    label: "submitComplaint.label",
    description: "submitComplaint.description",
    icon: "alertCircle",
    href: "/patient/complaints",
    color: "red",
    modal: "create",
  },
];

const labQuickActions: navbarQuickAction[] = [
  {
    id: "add-external-patient",
    label: "addExternalPatient.label",
    description: "addExternalPatient.description",
    icon: "userPlus",
    href: "/lab/external-patients",
    color: "blue",
    modal: "create",
  },
  {
    id: "create-test-result",
    label: "createTestResult.label",
    description: "createTestResult.description",
    icon: "clipboardCheck",
    href: "/lab/test-results",
    color: "green",
    modal: "create",
  },
  {
    id: "submit-complaint",
    label: "submitComplaint.label",
    description: "submitComplaint.description",
    icon: "alertCircle",
    href: "/lab/complaints",
    color: "red",
    modal: "create",
  },
];

const secretaryQuickActions: navbarQuickAction[] = [
  {
    id: "add-medical-test",
    label: "addMedicalTest.label",
    description: "addMedicalTest.description",
    icon: "flask",
    href: "/secretary/medical-tests",
    color: "teal",
    modal: "create",
  },
  {
    id: "create-test-request",
    label: "createTestRequest.label",
    description: "createTestRequest.description",
    icon: "clipboardList",
    href: "/secretary/test-requests",
    color: "orange",
    modal: "create",
  },
  {
    id: "create-test-result",
    label: "createTestResult.label",
    description: "createTestResult.description",
    icon: "clipboardCheck",
    href: "/secretary/test-results",
    color: "green",
    modal: "create",
  },
];

const withNavbarProfileOverrides =
  (defaultName: string, defaultRoleTitle: string, quickActions: navbarQuickAction[] = []) =>
  (profile?: NavbarProfileOverrides): navbarConfig =>
    buildNavbarConfig(
      profile?.name?.trim() || defaultName,
      profile?.roleTitle?.trim() || defaultRoleTitle,
      quickActions,
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
        label: "adminSubscriptions",
        href: "/admin/subscription-packages",
        icon: "creditCard",
      },
      {
        label: "adminComplaints",
        href: "/admin/complaints",
        icon: "alertCircle",
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
      adminQuickActions,
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
        label: "doctorComplaints",
        href: "/doctor/complaints",
        icon: "alertCircle",
      },
      {
        label: "chat",
        href: "/doctor/chat",
        icon: "messageSquare",
      },
    ],
    getNavbarConfig: withNavbarProfileOverrides(
      "Dr. Ahmad Salem",
      "DOCTOR",
      doctorQuickActions,
    ),
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
        label: "patientComplaints",
        href: "/patient/complaints",
        icon: "alertCircle",
      },
      {
        label: "chat",
        href: "/patient/chat",
        icon: "messageSquare",
      },
    ],
    getNavbarConfig: withNavbarProfileOverrides(
      "Noor Hassan",
      "PATIENT",
      patientQuickActions,
    ),
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
        label: "labComplaints",
        href: "/lab/complaints",
        icon: "alertCircle",
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
      labQuickActions,
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
      {
        label: "secretaryComplaints",
        href: "/secretary/complaints",
        icon: "alertCircle",
      },
    ],
    getNavbarConfig: withNavbarProfileOverrides(
      "Sara Nabil",
      "SECRETARY",
      secretaryQuickActions,
    ),
    canAccess: (route: string) => route.startsWith("/secretary"),
  },
};
