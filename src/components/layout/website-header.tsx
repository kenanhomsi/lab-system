"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { cn } from "@/lib/cn";

type WebsiteHeaderProps = {
  brand?: string;
  variant?: "light" | "dark";
  showCta?: boolean;
  ctaHref?: string;
};

export function WebsiteHeader({
  brand,
  variant = "light",
  showCta = true,
  ctaHref = "/login",
}: WebsiteHeaderProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isDark = variant === "dark";

  const displayBrand = brand ?? t("header.brand");
  const links = [
    { href: "/", label: t("nav.home") },
    { href: "/about", label: t("nav.about") },
    { href: "/services", label: t("nav.services") },
    { href: "/plans", label: t("nav.plans") },
    { href: "/blog", label: t("nav.blog") },
    { href: "/contact", label: t("nav.contact") },
  ];

  useEffect(() => {
    if (!drawerOpen) return;
    const timer = window.setTimeout(() => setDrawerOpen(false), 0);
    return () => window.clearTimeout(timer);
  }, [pathname, drawerOpen]);

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
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4 px-6 py-4 font-headline tracking-tight antialiased md:px-8">
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
              "min-w-0 truncate text-xl font-bold tracking-tighter",
              isDark ? "text-primary" : "text-slate-900",
            )}
          >
            {displayBrand}
          </Link>
        </div>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm font-semibold tracking-tight transition-colors",
                isDark
                  ? "text-secondary hover:text-primary"
                  : "text-slate-500 hover:text-cyan-600",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-3 md:gap-4">
          <LocaleSwitcher
            className={cn(
              "hidden md:flex",
              isDark && "border-white/20 bg-surface-container-low",
            )}
          />
          {isDark ? (
            <div className="hidden items-center gap-2 sm:gap-3 md:flex">
              <Link
                href="/login"
                className="rounded border border-primary/20 px-3 py-2 text-xs font-bold uppercase tracking-widest text-primary transition-all hover:bg-primary/5 sm:px-4"
              >
                {t("about.loginRegister")}
              </Link>
              <Link
                href="/dashboard"
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

      {drawerOpen ? (
        <>
          <button
            type="button"
            suppressHydrationWarning
            className="fixed inset-0 z-60 bg-black/40 md:hidden"
            aria-label={t("header.closeMenu")}
            onClick={() => setDrawerOpen(false)}
          />
          <div
            id="website-mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={t("header.menuTitle")}
            className={cn(
              "fixed inset-y-0 inset-s-0 z-70 flex h-dvh max-h-dvh w-[min(100%,20rem)] max-w-full flex-col overflow-hidden border-e shadow-2xl md:hidden",
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
                  const active =
                    l.href === "/"
                      ? pathname === "/"
                      : pathname === l.href || pathname.startsWith(`${l.href}/`);
                  return (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className={cn(
                          "block rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
                          active
                            ? isDark
                              ? "bg-primary/15 text-primary"
                              : "bg-cyan-50 text-cyan-800"
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
                <Link
                  href={ctaHref}
                  className="clinical-gradient block w-full rounded-xl px-4 py-3 text-center font-headline text-sm font-semibold text-on-primary-container shadow-lg shadow-primary/25 transition-all hover:opacity-95 active:scale-[0.99]"
                  onClick={() => setDrawerOpen(false)}
                >
                  {t("header.ctaNewLab")}
                </Link>
              ) : null}
              {isDark ? (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    className="rounded-xl border border-primary/25 px-4 py-2.5 text-center text-sm font-bold text-primary transition-colors hover:bg-primary/10"
                    onClick={() => setDrawerOpen(false)}
                  >
                    {t("about.loginRegister")}
                  </Link>
                  <Link
                    href="/dashboard"
                    className="clinical-gradient block w-full rounded-xl px-4 py-3 text-center text-sm font-bold uppercase tracking-wide text-on-primary shadow-lg shadow-primary/25 transition-all hover:opacity-95"
                    onClick={() => setDrawerOpen(false)}
                  >
                    {t("about.quickAccess")}
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </>
      ) : null}
    </header>
  );
}
