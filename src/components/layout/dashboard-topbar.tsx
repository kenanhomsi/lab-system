"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { signOut, useSession } from "next-auth/react";
import { Link, usePathname } from "@/i18n/navigation";
import { Icon } from "@/components/ui/icon";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { cn } from "@/lib/cn";
import type { UserRole } from "@/types/user";

export type TopbarTab = { href: string; label: string };


function resolvePageTitle(
  pathname: string,
  role: UserRole,
  t: (key: string) => string,
): string {
  if (pathname.startsWith("/profile")) {
    return t("titleProfile");
  }
  if (pathname.startsWith("/subscriptions")) {
    return t("titleSubscriptions");
  }
  switch (role) {
    case "patient":
      return t("titlePatient");
    case "lab":
      return t("titleLab");
    case "special":
      return t("titleSpecial");
    default:
      return t("titlePortal");
  }
}

type DashboardTopbarProps = {
  pageTitle?: string;
  avatarSrc?: string;
  className?: string;
};

export function DashboardTopbar({
  pageTitle,
  avatarSrc = "https://lh3.googleusercontent.com/aida-public/AB6AXuCaxelQZ0yN8nHDS6A5gkUayjdT5qU1zBi35JNzhFTu46HZ8f4_0xksn9I4KnfyVVArM5V_BLF_uoyODkcEX7LlH0BRvVyvj_BOjFkMTaZVlesxKevlRCaGvOWWKLTEdl4VkvGQ-A1CfSRjY-IklZCGH-ZmVeZdMY5BsfPLsQUKdvCVAR6_0lpfelUo3p8MeSlxn6yv3jUt2qeVWtUNGqwjgYJB-lgHjFTcuBG99JCEPYq4RBm0lPJAXOLsC3nVlZY0GppImF_5THBy",
  className,
}: DashboardTopbarProps) {
  const pathname = usePathname();
  const locale = useLocale();
  const { data: session } = useSession();
  const t = useTranslations("dashboard.topbar");
  const tRole = useTranslations("auth.roles");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const role = (session?.user?.role as UserRole) || "patient";


  const resolvedTitle = pageTitle ?? resolvePageTitle(pathname, role, t);
  const userName = session?.user?.fullName?.trim() || t("userName");
  const userRoleLabel = tRole(role);

  return (
    <header
      className={cn(
        "fixed top-0 z-40 flex h-16 items-center justify-between border-b border-outline-variant/10 bg-white/80 px-4 shadow-sm shadow-slate-200/50 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80 dark:shadow-none sm:px-6 md:px-8",
        "start-0 end-0 lg:start-64 lg:end-0",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-4 overflow-hidden">
        <h2 className="hidden shrink-0 font-headline text-lg font-bold tracking-tight text-cyan-700 dark:text-cyan-500 sm:block md:text-xl">
          {resolvedTitle}
        </h2>
        <div className="relative hidden w-full max-w-xs shrink-0 sm:block md:max-w-md">
          <Icon
            name="search"
            className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-slate-400"
            size="sm"
          />
          <input
            type="search"
            placeholder={t("searchPlaceholder")}
            className="w-full rounded-lg border-none bg-slate-100 py-2 ps-10 pe-4 text-sm focus:ring-0 dark:bg-slate-800 dark:text-slate-100"
            aria-label={t("searchAria")}
          />
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-4 md:gap-6">
        <LocaleSwitcher />
        <button
          type="button"
          className="text-slate-500 transition-colors hover:text-[#009CC2]"
          aria-label={t("notificationsAria")}
        >
          <Icon name="notifications" size="sm" />
        </button>
        <button
          type="button"
          className="hidden text-slate-500 transition-colors hover:text-[#009CC2] sm:inline-flex"
          aria-label={t("settingsAria")}
        >
          <Icon name="settings" size="sm" />
        </button>
        <div className="hidden h-8 w-px bg-slate-200 dark:bg-slate-700 sm:block" />
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-3 rounded-lg p-1 text-start transition-colors hover:bg-slate-100/80 dark:hover:bg-slate-800/80"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            aria-label={t("profileMenuAria")}
          >
            <div className="hidden text-end sm:block">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{userName}</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">{userRoleLabel}</p>
            </div>
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-200">
              <Image
                src={avatarSrc}
                alt=""
                width={40}
                height={40}
                className="h-full w-full object-cover"
                unoptimized
              />
            </div>
          </button>
          {menuOpen ? (
            <div
              role="menu"
              className="absolute end-0 top-full z-50 mt-2 min-w-[11rem] rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900"
            >
              <Link
                href="/profile"
                role="menuitem"
                className="block px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                onClick={() => setMenuOpen(false)}
              >
                {t("menuProfile")}
              </Link>
              <button
                type="button"
                role="menuitem"
                className="w-full px-4 py-2.5 text-start text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                onClick={() => {
                  setMenuOpen(false);
                  void signOut({ callbackUrl: `/${locale}` });
                }}
              >
                {t("menuLogout")}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
