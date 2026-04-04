"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Icon } from "@/components/ui/icon";
import { guestServiceMenu, serviceMenus } from "@/components/layout/mobile-service-menus";
import { cn } from "@/lib/cn";
import type { UserRole } from "@/types/user";

export function BottomNav() {
  const [showServices, setShowServices] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const { data: session } = useSession();
  const t = useTranslations("bottomNav");
  const tAbout = useTranslations("about");

  const userRole = session?.user?.role as UserRole | undefined;
  const menu = userRole ? serviceMenus[userRole] : guestServiceMenu;

  const authenticatedTabs = [
    { id: "home", href: `/${locale}`, icon: "home", label: t("home") },
    { id: "services", href: "#", icon: "apps", label: t("services") },
    { id: "account", href: `/${locale}/dashboard`, icon: "person", label: t("account") },
    { id: "settings", href: `/${locale}/dashboard`, icon: "settings", label: t("settings") },
  ];

  const guestTabs = [
    { id: "home", href: `/${locale}`, icon: "home", label: t("home") },
    {
      id: "login",
      href: `/${locale}/login`,
      icon: "person",
      label: tAbout("loginRegister"),
    },
  ];

  const tabs = session ? authenticatedTabs : guestTabs;

  return (
    <>
      {showServices && (
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setShowServices(false)} />
      )}

      {showServices && (
        <div className="fixed bottom-16 inset-x-0 z-50 mx-4 mb-2 rounded-2xl bg-surface shadow-2xl lg:hidden">
          <div className="p-4">
            <h3 className="mb-3 font-headline text-sm font-bold text-secondary">{t("services")}</h3>
            <div className="grid grid-cols-3 gap-2">
              {menu.map((item) => (
                <Link
                  key={item.href}
                  href={`/${locale}${item.href}`}
                  onClick={() => setShowServices(false)}
                  className="flex flex-col items-center gap-1 rounded-xl p-3 transition-colors hover:bg-surface-container-low"
                >
                  <Icon name={item.icon} className="text-primary" size="sm" />
                  <span className="text-[10px] font-medium text-secondary text-center leading-tight">
                    {t(`menu.${item.label}`)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-outline-variant bg-surface lg:hidden">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => {
            const isActive = tab.id === "home" ? pathname === `/${locale}` : false;
            const isServices = tab.id === "services";

            if (isServices) {
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setShowServices(!showServices)}
                  className={cn(
                    "flex flex-col items-center gap-0.5 px-3 py-1 transition-colors",
                    showServices ? "text-primary" : "text-secondary",
                  )}
                >
                  <Icon name={tab.icon} filled={showServices} size="sm" />
                  <span className="text-[10px] font-medium">{tab.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-1 transition-colors",
                  isActive ? "text-primary" : "text-secondary",
                )}
              >
                <Icon name={tab.icon} filled={isActive} size="sm" />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
