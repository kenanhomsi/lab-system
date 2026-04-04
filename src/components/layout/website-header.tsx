"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
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
        <Link
          href="/"
          className={cn(
            "text-xl font-bold tracking-tighter",
            isDark ? "text-primary" : "text-slate-900",
          )}
        >
          {displayBrand}
        </Link>
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
        <div className="flex items-center gap-3 md:gap-4">
          <LocaleSwitcher
            className={cn(isDark && "border-white/20 bg-surface-container-low")}
          />
          {!isDark ? (
            <div className="hidden gap-4 text-slate-500 sm:flex">
              <span className="material-symbols-outlined cursor-pointer rounded-lg p-2 transition-all hover:bg-slate-100/50 active:scale-95">
                notifications
              </span>
              <span className="material-symbols-outlined cursor-pointer rounded-lg p-2 transition-all hover:bg-slate-100/50 active:scale-95">
                settings
              </span>
            </div>
          ) : null}
          {isDark ? (
            <div className="flex items-center gap-2 sm:gap-3">
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
              className="clinical-gradient whitespace-nowrap rounded-xl px-4 py-2.5 font-headline text-sm font-semibold text-on-primary-container shadow-lg shadow-primary/20 transition-all hover:opacity-95 active:scale-[0.98] sm:px-6"
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
    </header>
  );
}
