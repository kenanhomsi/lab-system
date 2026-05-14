import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

import { BrandLogo } from "@/components/shared/brand-logo";

type WebsiteFooterProps = {
  tagline?: string;
  variant?: "light" | "dark";
};

export async function WebsiteFooter({
  tagline,
  variant = "light",
}: WebsiteFooterProps) {
  const t = await getTranslations();
  const isDark = variant === "dark";

  const displayTagline = tagline ?? t("footer.tagline");
  const year = new Date().getFullYear();

  const columns = [
    {
      title: t("footer.explore"),
      links: [
        { href: "/about", label: t("footer.about") },
        { href: "/services", label: t("footer.services") },
        { href: "/blog", label: t("footer.blog") },
        { href: "/contact", label: t("footer.contactLink") },
      ],
    },
    {
      title: t("footer.legal"),
      links: [
        { href: "#", label: t("footer.privacy") },
        { href: "#", label: t("footer.terms") },
        { href: "#", label: t("footer.quality") },
      ],
    },
    {
      title: t("footer.contactCol"),
      links: [
        { href: "tel:0991828342", label: t("footer.phone1") },
        { href: "tel:0113340604", label: t("footer.phone2") },
        { href: "mailto:metwalilab@gmail.com", label: t("footer.email") },
      ],
    },
  ];
  const visibleColumns = columns.filter((column) =>
    column.links.some((link) => link.href !== "#"),
  );

  return (
    <footer
      className={cn(
        "mt-auto w-full border-t px-6 py-12 md:px-8",
        isDark
          ? "border-white/5 bg-surface-dim"
          : "border-slate-200/50 bg-slate-50",
      )}
    >
      <div className="mx-auto flex max-w-screen-2xl flex-col items-start justify-between gap-12 md:flex-row">
        <div className="max-w-sm space-y-4">
          <BrandLogo variant="full" />
          <p
            className={cn(
              "text-xs leading-relaxed tracking-wide",
              isDark ? "text-secondary" : "text-slate-500",
            )}
          >
            {displayTagline}
          </p>
          <div
            className={cn("text-xs", isDark ? "text-secondary" : "text-slate-400")}
          >
            <p>{t("footer.address")}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 md:gap-12">
          {visibleColumns.map((col) => (
            <div key={col.title} className="space-y-4">
              <h5 className="font-headline text-xs font-bold uppercase tracking-[0.2em] text-on-surface">
                {col.title}
              </h5>
              <ul className="space-y-2 text-xs tracking-wide">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.href.startsWith("tel:") || l.href.startsWith("mailto:") ? (
                      <a
                        href={l.href}
                        className={cn(
                          "transition-colors",
                          isDark
                            ? "text-secondary hover:text-white"
                            : "text-slate-400 hover:text-primary",
                        )}
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link
                        href={
                          l.href as
                          | "/about"
                          | "/services"
                          | "/blog"
                          | "/contact"
                        }
                        className={cn(
                          "transition-colors",
                          isDark
                            ? "text-secondary hover:text-white"
                            : "text-slate-400 hover:text-primary",
                        )}
                      >
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div
        className={cn(
          "mx-auto mt-12 flex max-w-screen-2xl flex-col items-center justify-between gap-6 border-t pt-8 md:flex-row",
          isDark ? "border-white/5" : "border-slate-200/30",
        )}
      >
        <p
          className={cn(
            "text-center text-xs tracking-wide md:text-start",
            isDark ? "text-secondary opacity-80" : "text-slate-400",
          )}
        >
          {t("footer.copyright", { year })}
        </p>
        <div className="flex gap-6 text-slate-400" aria-hidden>
          <Icon name="language" size="sm" />
          <Icon name="public" size="sm" />
        </div>
      </div>
    </footer>
  );
}
