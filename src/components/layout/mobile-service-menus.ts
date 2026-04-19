import type { UserRole } from "@/types/user";

export type ServiceMenuItem = {
  href: string;
  label: string;
  icon: string;
};

export const serviceMenus: Record<UserRole, ServiceMenuItem[]> = {
  admin: [
    { href: "/admin/dashboard", label: "adminOverview", icon: "dashboard" },
    { href: "/admin/users", label: "adminUsers", icon: "group" },
    { href: "/admin/subscription-packages", label: "adminSubscriptions", icon: "card_membership" },
    { href: "/admin/complaints", label: "adminComplaints", icon: "support_agent" },
    { href: "/admin/settings", label: "adminSettings", icon: "settings" },
  ],
  patient: [
    { href: "/book-appointment", label: "bookAppointment", icon: "calendar_month" },
    { href: "/my-results", label: "myResults", icon: "lab_research" },
    { href: "/dashboard/price-calculator", label: "priceCalculator", icon: "calculate" },
    { href: "/insurance-request", label: "insuranceRequest", icon: "health_and_safety" },
    { href: "/subscriptions", label: "subscriptions", icon: "card_membership" },
  ],
  doctor: [
    { href: "/doctor/request-tests", label: "requestTests", icon: "assignment_add" },
    { href: "/doctor/patient-list", label: "patientList", icon: "group" },
    { href: "/my-results", label: "myResults", icon: "lab_research" },
  ],
  lab: [
    { href: "/lab/order-tests", label: "orderTests", icon: "science" },
    { href: "/lab/accounting", label: "accounting", icon: "payments" },
    { href: "/lab/store", label: "store", icon: "storefront" },
    { href: "/my-results", label: "myResults", icon: "lab_research" },
  ],
  special: [
    { href: "/special/new-payment", label: "newPayment", icon: "add_card" },
    { href: "/special/new-expense", label: "newExpense", icon: "receipt_long" },
    { href: "/special/account-statement", label: "accountStatement", icon: "account_balance" },
    { href: "/special/daily-tasks", label: "dailyTasks", icon: "task_alt" },
  ],
};

export const guestServiceMenu: ServiceMenuItem[] = [
  { href: "/tests", label: "testsCatalog", icon: "biotech" },
  { href: "/offers", label: "offers", icon: "local_offer" },
  { href: "/price-calculator", label: "priceCalculator", icon: "calculate" },
  { href: "/lab-encyclopedia", label: "labEncyclopedia", icon: "menu_book" },
];
