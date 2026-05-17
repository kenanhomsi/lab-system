import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

import { BrandLogo } from "@/components/shared/brand-logo";

type WebsiteFooterProps = {
  tagline?: string;
  variant?: "light" | "dark";
};

/**
 * Website footer with brand, navigation, and contact details.
 */
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
        { href: "/", label: t("nav.home") },
        { href: "/about", label: t("footer.about") },
        { href: "/services", label: t("footer.services") },
        { href: "/plans", label: t("nav.plans") },
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
        "mt-auto w-full border-t",
        isDark
          ? "border-white/5"
          : "border-outline-variant/25",
      )}
    >
      <div className="mx-auto w-full max-w-screen-2xl px-6 py-12 md:px-8">
        <div
          className={cn(
            "relative overflow-hidden rounded-3xl border px-6 py-10 shadow-sm md:px-10",
            isDark
              ? "border-white/10 bg-surface"
              : "border-outline-variant/20 bg-surface-container-lowest",
          )}
        >
          <div
            className={cn(
              "pointer-events-none absolute inset-0 opacity-70",
              isDark
                ? "[background:radial-gradient(ellipse_at_top,rgba(96,165,250,0.18),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(167,139,250,0.12),transparent_55%)]"
                : "[background:radial-gradient(ellipse_at_top,rgba(59,130,246,0.12),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(139,92,246,0.10),transparent_55%)]",
            )}
            aria-hidden
          />
          <div className="relative grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4">
              <BrandLogo variant="full" />
              <p
                className={cn(
                  "mt-4 text-sm leading-relaxed text-on-surface-variant",
                  isDark && "text-on-surface-variant/90",
                )}
              >
                {displayTagline}
              </p>
              <div className="mt-6 space-y-3">
                <p className="flex items-start gap-2 text-xs text-on-surface-variant">
                  <Icon name="location_on" size="sm" />
                  <span>{t("footer.address")}</span>
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="muted" className="gap-1.5">
                    <Icon name="verified" size="sm" />
                    <span>ISO 9001:2015</span>
                  </Badge>
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className={cn(
                    "clinical-gradient inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-headline text-sm font-semibold text-on-primary shadow-lg shadow-primary/20 transition-all hover:opacity-95 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  )}
                >
                  <Icon name="support_agent" size="sm" />
                  {t("footer.contactLink")}
                </Link>
                <Link
                  href="/login"
                  className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-low px-5 py-2.5 font-headline text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-high focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    isDark && "border-white/15 bg-white/5 hover:bg-white/10",
                  )}
                >
                  <Icon name="add_task" size="sm" />
                  {t("header.ctaNewLab")}
                </Link>
              </div>
            </div>

            <div className="grid gap-10 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
              {visibleColumns.map((col) => (
                <div key={col.title} className="space-y-4">
                  <h5 className="font-headline text-xs font-bold uppercase tracking-[0.2em] text-on-surface">
                    {col.title}
                  </h5>
                  <ul className="space-y-2.5 text-sm">
                    {col.links.map((l) => {
                      const isContact =
                        l.href.startsWith("tel:") || l.href.startsWith("mailto:");
                      const iconName = l.href.startsWith("tel:")
                        ? "call"
                        : l.href.startsWith("mailto:")
                          ? "mail"
                          : "arrow_outward";

                      const commonClassName = cn(
                        "inline-flex items-center gap-2 rounded-lg text-on-surface-variant transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                        isDark && "text-on-surface-variant/90 hover:text-white",
                      );

                      return (
                        <li key={`${col.title}-${l.href}-${l.label}`}>
                          {isContact ? (
                            <a href={l.href} className={commonClassName}>
                              <Icon name={iconName} size="sm" />
                              <span>{l.label}</span>
                            </a>
                          ) : (
                            <Link href={l.href} className={commonClassName}>
                              <span>{l.label}</span>
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className={cn(
            "mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 md:flex-row",
            isDark ? "border-white/8" : "border-outline-variant/20",
          )}
        >
          <p
            className={cn(
              "text-center text-xs text-on-surface-variant md:text-start",
              isDark && "text-on-surface-variant/80",
            )}
          >
            {t("footer.copyright", { year })}
          </p>
          <a
            href="#website-page-content"
            className={cn(
              "inline-flex items-center gap-2 text-xs font-semibold text-on-surface-variant transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              isDark && "text-on-surface-variant/80 hover:text-white",
            )}
          >
            <Icon name="north" size="sm" />
            {t("footer.backToTop")}
          </a>
        </div>
      </div>
    </footer>
  );
}
