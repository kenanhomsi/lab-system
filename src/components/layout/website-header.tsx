"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { signOut, useSession } from "next-auth/react";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { cn } from "@/lib/cn";

import { BrandLogo } from "@/components/shared/brand-logo";
import { SparkleNavbar } from "@/components/ui/sparkle-navbar";

type WebsiteHeaderProps = {
  variant?: "light" | "dark";
  showCta?: boolean;
  ctaHref?: string;
};

/**
 * Renders the public website navigation header.
 */
export function WebsiteHeader({
  variant = "light",
  showCta = true,
  ctaHref = "/login",
}: WebsiteHeaderProps) {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isDark = variant === "dark";
  const roles = session?.user?.roles ?? [];
  const normalizedRoles = roles.map((role) => role.toLowerCase());
  const isPatient = normalizedRoles.some((role) => role.includes("patient"));
  const isAuthenticated = status === "authenticated";
  const dashboardHref = normalizedRoles.some((role) => role.includes("admin"))
    ? "/admin/dashboard"
    : normalizedRoles.some((role) => role.includes("doctor"))
      ? "/doctor/dashboard"
      : normalizedRoles.some((role) => role.includes("lab"))
        ? "/lab/dashboard"
        : normalizedRoles.some((role) => role.includes("secretary"))
          ? "/secretary/dashboard"
          : normalizedRoles.some((role) => role.includes("special"))
            ? "/special/daily-tasks"
            : "/";
  const accountLabel = session?.user?.fullName?.trim() || t("navbar.profile");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const links = [
    { href: "/", label: t("nav.home") },
    { href: "/about", label: t("nav.about") },
    { href: "/services", label: t("nav.services") },
    { href: "/order-test-request", label: t("nav.orderTestRequest") },
    { href: "/#quality-control", label: t("footer.quality") },
    { href: "/careers", label: t("nav.careers") },
    { href: "/join-as-client", label: t("nav.joinAsClient") },
    { href: "/blog", label: t("nav.blog") },
    { href: "/contact", label: t("nav.contact") },
  ];
  const isLinkActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  const activeNavIndex = links.findIndex((l) => isLinkActive(l.href));
  const navAccentColor = isDark ? "#5bd3f5" : "#009cc2";

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDrawerOpen(false);
    setProfileMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await signOut({ redirect: false, callbackUrl: `/${locale}` });
    window.location.href = `/${locale}`;
  };

  const accountMenu = (
    <div className="absolute end-0 top-full z-[80] mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-800 shadow-xl shadow-slate-900/10">
      <div className="border-b border-slate-100 px-4 py-3">
        <p className="truncate text-sm font-bold">{accountLabel}</p>
        <p className="truncate text-xs text-slate-500">{session?.user?.email}</p>
      </div>
      <Link
        href="/profile"
        className="flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors hover:bg-slate-50"
        onClick={() => setProfileMenuOpen(false)}
      >
        <span className="material-symbols-outlined text-lg" aria-hidden>
          account_circle
        </span>
        {t("navbar.profile")}
      </Link>
      {!isPatient ? (
        <Link
          href={dashboardHref}
          className="flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors hover:bg-slate-50"
          onClick={() => setProfileMenuOpen(false)}
        >
          <span className="material-symbols-outlined text-lg" aria-hidden>
            dashboard
          </span>
          {t("nav.dashboard")}
        </Link>
      ) : null}
      <button
        type="button"
        className="flex w-full items-center gap-2 px-4 py-3 text-start text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
        onClick={() => {
          setProfileMenuOpen(false);
          void handleSignOut();
        }}
      >
        <span className="material-symbols-outlined text-lg" aria-hidden>
          logout
        </span>
        {t("navbar.logout")}
      </button>
    </div>
  );

  useEffect(() => {
    if (!drawerOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full backdrop-blur-xl",
        isDark
          ? "bg-surface/80 shadow-2xl shadow-cyan-900/10"
          : "bg-slate-50/80 shadow-sm shadow-slate-200/50",
      )}
    >
      <div className="content-container flex items-center justify-between gap-4 py-4 font-headline tracking-tight antialiased">
        <div className="flex min-w-0 items-center gap-2 md:gap-0">
          <button
            type="button"
            suppressHydrationWarning
            className={cn(
              "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors md:hidden",
              isDark
                ? "text-on-surface hover:bg-white/10"
                : "text-slate-700 hover:bg-slate-200/60",
            )}
            aria-expanded={drawerOpen}
            aria-controls="website-mobile-drawer"
            aria-label={drawerOpen ? t("header.closeMenu") : t("header.openMenu")}
            onClick={() => setDrawerOpen((o) => !o)}
          >
            <span className="material-symbols-outlined text-2xl" aria-hidden>
              {drawerOpen ? "close" : "menu"}
            </span>
          </button>
          <Link
            href="/"
            className={cn(
              "min-w-0 transition-opacity hover:opacity-90",
            )}
          >
            <BrandLogo variant="full" />
          </Link>
        </div>
        <div className="hidden md:flex">
          <SparkleNavbar
            items={links}
            activeIndex={activeNavIndex}
            color={navAccentColor}
            isDark={isDark}
          />
        </div>
        <div className="flex shrink-0 items-center gap-3 md:gap-4">
          <LocaleSwitcher
            className={cn(
              "hidden md:flex",
              isDark && "border-white/20 bg-surface-container-low",
            )}
          />
          {isAuthenticated ? (
            <div className="relative hidden md:block">
              <button
                type="button"
                className={cn(
                  "inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all",
                  isDark
                    ? "border-white/20 bg-white/10 text-on-surface hover:bg-white/15"
                    : "border-slate-200 bg-white text-slate-700 shadow-sm shadow-slate-200/70 hover:bg-slate-50",
                )}
                aria-label={t("navbar.profile")}
                aria-expanded={profileMenuOpen}
                onClick={() => setProfileMenuOpen((open) => !open)}
              >
                <span className="material-symbols-outlined text-2xl" aria-hidden>
                  account_circle
                </span>
              </button>
              {profileMenuOpen ? accountMenu : null}
            </div>
          ) : isDark ? (
            <div className="hidden items-center gap-2 sm:gap-3 md:flex">
              <Link
                href="/login"
                className="rounded border border-primary/20 px-3 py-2 text-xs font-bold uppercase tracking-widest text-primary transition-all hover:bg-primary/5 sm:px-4"
              >
                  {t("about.loginRegister")}
              </Link>
              <Link
                href={dashboardHref}
                className="clinical-gradient rounded px-4 py-2 text-xs font-bold uppercase tracking-widest text-on-primary shadow-lg shadow-primary/20 transition-all hover:opacity-95 active:scale-95 sm:px-6"
              >
                {t("about.quickAccess")}
              </Link>
            </div>
          ) : showCta ? (
            <Link
              href={ctaHref}
              className="clinical-gradient text-white hidden whitespace-nowrap rounded-xl px-4 py-2.5 font-headline text-sm font-semibold  shadow-lg shadow-primary/20 transition-all hover:opacity-95 active:scale-[0.98] md:inline-flex sm:px-6"
            >
              {t("header.ctaNewLab")}
            </Link>
          ) : null}
        </div>
      </div>
      <div
        className={cn(
          "h-px w-full",
          isDark ? "bg-white/5" : "bg-slate-200/50",
        )}
      />

      {drawerOpen && mounted ? createPortal(
        <>
          <button
            type="button"
            suppressHydrationWarning
            className="fixed inset-0 z-[60] bg-black/40 md:hidden"
            aria-label={t("header.closeMenu")}
            onClick={() => setDrawerOpen(false)}
          />
          <div
            id="website-mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={t("header.menuTitle")}
            className={cn(
              "fixed inset-y-0 inset-s-0 z-[70] flex h-dvh max-h-dvh w-[min(100%,20rem)] max-w-full flex-col overflow-hidden border-e shadow-2xl md:hidden",
              isDark
                ? "border-white/10 bg-surface"
                : "border-slate-200 bg-white",
            )}
          >
            <div
              className={cn(
                "flex items-center justify-between border-b px-4 py-3",
                isDark ? "border-white/10" : "border-slate-100",
              )}
            >
              <span className="font-headline text-sm font-bold text-secondary">
                {t("header.menuTitle")}
              </span>
              <button
                type="button"
                suppressHydrationWarning
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                  isDark ? "hover:bg-white/10" : "hover:bg-slate-100",
                )}
                aria-label={t("header.closeMenu")}
                onClick={() => setDrawerOpen(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <nav
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4"
              aria-label={t("header.menuTitle")}
            >
              <ul className="space-y-1">
                {links.map((l) => {
                  const active = isLinkActive(l.href);
                  return (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className={cn(
                          "block rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
                          active
                            ? isDark
                              ? "bg-[#009cc2]/15 text-[#009cc2]"
                              : "bg-[#009cc2]/10 text-[#009cc2]"
                            : isDark
                              ? "text-on-surface hover:bg-white/10"
                              : "text-slate-700 hover:bg-slate-100",
                        )}
                        onClick={() => setDrawerOpen(false)}
                      >
                        {l.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div
              className={cn(
                "space-y-3 border-b px-4 py-4 md:hidden",
                isDark ? "border-white/10" : "border-slate-100",
              )}
            >
              <LocaleSwitcher
                stretch
                className={cn(
                  isDark
                    ? "border-white/15 bg-white/5"
                    : "border-slate-200/90 bg-slate-100/80 shadow-sm shadow-slate-200/40",
                )}
              />
              {!isDark && showCta ? (
                isAuthenticated ? null : (
                  <Link
                    href={ctaHref}
                    className="clinical-gradient block w-full rounded-xl px-4 py-3 text-center font-headline text-sm font-semibold text-on-primary-container shadow-lg shadow-primary/25 transition-all hover:opacity-95 active:scale-[0.99]"
                    onClick={() => setDrawerOpen(false)}
                  >
                    {t("header.ctaNewLab")}
                  </Link>
                )
              ) : null}
              {isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/profile"
                    className="rounded-xl border border-primary/25 px-4 py-2.5 text-center text-sm font-bold text-primary transition-colors hover:bg-primary/10"
                    onClick={() => setDrawerOpen(false)}
                  >
                    {t("navbar.profile")}
                  </Link>
                  {!isPatient ? (
                    <Link
                      href={dashboardHref}
                      className="clinical-gradient block w-full rounded-xl px-4 py-3 text-center text-sm font-bold uppercase tracking-wide text-on-primary shadow-lg shadow-primary/25 transition-all hover:opacity-95"
                      onClick={() => setDrawerOpen(false)}
                    >
                      {t("about.quickAccess")}
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    className="rounded-xl px-4 py-2.5 text-center text-sm font-bold text-red-600 transition-colors hover:bg-red-50"
                    onClick={() => {
                      setDrawerOpen(false);
                      void handleSignOut();
                    }}
                  >
                    {t("navbar.logout")}
                  </button>
                </div>
              ) : isDark ? (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    className="rounded-xl border border-primary/25 px-4 py-2.5 text-center text-sm font-bold text-primary transition-colors hover:bg-primary/10"
                    onClick={() => setDrawerOpen(false)}
                  >
                    {t("about.loginRegister")}
                  </Link>
                  <Link
                    href={dashboardHref}
                    className="clinical-gradient block w-full rounded-xl px-4 py-3 text-center text-sm font-bold uppercase tracking-wide text-on-primary shadow-lg shadow-primary/25 transition-all hover:opacity-95"
                    onClick={() => setDrawerOpen(false)}
                  >
                    {t("about.quickAccess")}
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </>,
        document.body
      ) : null}
    </header>
  );
}
