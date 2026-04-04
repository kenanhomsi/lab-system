"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { UserRole } from "@/types/user";

export type SidebarNavItem = {
  href: string;
  labelKey: string;
  icon: string;
};

const commonNav: SidebarNavItem[] = [
  { href: "/dashboard", labelKey: "dashboard", icon: "dashboard" },
];

const roleNav: Record<UserRole, SidebarNavItem[]> = {
  patient: [
    { href: "/book-appointment", labelKey: "bookAppointment", icon: "calendar_month" },
    { href: "/my-results", labelKey: "myResults", icon: "lab_research" },
    { href: "/subscriptions", labelKey: "subscriptions", icon: "card_membership" },
    { href: "/insurance-request", labelKey: "insuranceRequest", icon: "health_and_safety" },
    { href: "/dashboard/price-calculator", labelKey: "priceCalculator", icon: "calculate" },
  ],
  doctor: [
    { href: "/doctor/request-tests", labelKey: "requestTests", icon: "assignment_add" },
    { href: "/doctor/patient-list", labelKey: "patientList", icon: "group" },
    { href: "/my-results", labelKey: "myResults", icon: "lab_research" },
  ],
  lab: [
    { href: "/lab/order-tests", labelKey: "orderTests", icon: "science" },
    { href: "/lab/accounting", labelKey: "accounting", icon: "payments" },
    { href: "/lab/store", labelKey: "store", icon: "storefront" },
    { href: "/my-results", labelKey: "myResults", icon: "lab_research" },
  ],
  special: [
    { href: "/special/new-payment", labelKey: "newPayment", icon: "add_card" },
    { href: "/special/new-expense", labelKey: "newExpense", icon: "receipt_long" },
    { href: "/special/account-statement", labelKey: "accountStatement", icon: "account_balance" },
    { href: "/special/daily-tasks", labelKey: "dailyTasks", icon: "task_alt" },
  ],
};

const bottomNav: SidebarNavItem[] = [
  // { href: "/", labelKey: "home", icon: "home" },
  { href: "/contact-us", labelKey: "contactUs", icon: "contact_support" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const locale = useLocale();
  const { data: session } = useSession();
  const t = useTranslations("sidebar");

  const userRole = (session?.user?.role as UserRole) || "patient";
  const navItems = [...commonNav, ...roleNav[userRole]];

  return (
    <aside className="fixed start-0 top-0 z-50 flex h-full w-64 flex-col border-e border-outline-variant/20 bg-slate-50 font-headline text-sm font-medium tracking-tight dark:bg-slate-900">
      <div className="px-8 py-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
          {t("brand")}
        </h2>
        <p className="text-xs text-slate-500">{t("subtitle")}</p>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const fullHref = `/${locale}${item.href}`;
          const active = pathname === fullHref || pathname.startsWith(fullHref + "/");
          return (
            <Link
              key={item.href}
              href={fullHref}
              className={cn(
                "flex items-center px-8 py-3 transition-all",
                active
                  ? "ms-4 rounded-s-full bg-white ps-4 font-semibold text-[#009CC2] dark:bg-slate-900"
                  : "text-slate-500 hover:bg-slate-200/50 hover:text-[#009CC2] dark:text-slate-400 dark:hover:bg-slate-700/50",
              )}
            >
              <Icon name={item.icon} className="me-3 text-[22px]" size="sm" />
              {t(item.labelKey)}
            </Link>
          );
        })}

        <div className="mx-6 my-4 border-t border-outline-variant/20" />

        {bottomNav.map((item) => {
          const fullHref = `/${locale}${item.href}`;
          return (
            <Link
              key={item.href}
              href={fullHref}
              className="flex items-center px-8 py-3 text-slate-500 transition-all hover:bg-slate-200/50 hover:text-[#009CC2] dark:text-slate-400 dark:hover:bg-slate-700/50"
            >
              <Icon name={item.icon} className="me-3 text-[22px]" size="sm" />
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
