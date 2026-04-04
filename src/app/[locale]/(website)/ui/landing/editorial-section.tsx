import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/icon";

const PORTRAIT =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAd0bU_bfhV4iIkRXRj3JX01knb-9F13HKB3h8OrAhg9-7WQmgfKzA6OqNmnGWtFVvRiVzncXiKMo4yt0Tf39lHxHDdkC6X4GYtLcWtsQkoRDTyWgNZDM0Bw_5A-Q3pImxLARRrhqkE7qXa_snfpZvuTZM0JZfipvilv-Z_9BKpYS1jZrbUz6xpWX5reSYM4Yr0qif77gIfNeKunnXBql3Gn6JKmmGMXtMbXcNMFBIp0bYFwF4cPTzcxvHscW9EmpHEUw9cdGu6jOoK";

export async function EditorialSection() {
  const t = await getTranslations("landing.editorial");
  const locale = await getLocale();
  const ctaArrow = locale === "ar" ? "arrow_back" : "arrow_forward";
  const ctaArrowClass =
    locale === "ar"
      ? "transition-transform duration-300 group-hover:-translate-x-1"
      : "transition-transform duration-300 group-hover:translate-x-1";

  return (
    <section
      className="relative overflow-hidden border-y border-outline-variant/15 bg-linear-to-b from-background via-surface-container-low/40 to-background py-20 md:py-28"
      aria-labelledby="editorial-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-20"
        style={{
          backgroundImage: `linear-gradient(var(--outline-variant) 1px, transparent 1px), linear-gradient(90deg, var(--outline-variant) 1px, transparent 1px)`,
          backgroundSize: "56px 56px",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute -top-32 inset-s-1/2 h-112 w-[min(100%,56rem)] -translate-x-1/2 rounded-full bg-primary/15 blur-[100px] dark:bg-primary/20" />
      <div className="pointer-events-none absolute bottom-0 inset-e-0 h-64 w-64 translate-x-1/4 translate-y-1/2 rounded-full bg-tertiary-fixed/20 blur-[80px] dark:bg-tertiary-fixed/10" />

      <div className="relative mx-auto max-w-screen-2xl px-5 md:px-8">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-12">
          <div
            className="reveal-up lg:col-span-5"
            style={{ animationDelay: "100ms" }}
          >
            <div className="mx-auto w-full max-w-md lg:sticky lg:top-28 lg:mx-0 lg:max-w-none">
              <div className="group relative overflow-hidden rounded-[1.75rem] bg-surface-container-lowest shadow-[0_32px_64px_-16px_rgba(0,36,46,0.18)] ring-1 ring-outline-variant/20 dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.45)] dark:ring-white/10 md:rounded-4xl">
                <div className="relative aspect-3/4 overflow-hidden md:aspect-4/5">
                  <Image
                    src={PORTRAIT}
                    alt={t("portraitAlt")}
                    width={600}
                    height={750}
                    className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-primary/25 via-transparent to-primary-fixed/10 mix-blend-multiply dark:mix-blend-normal dark:from-primary/40" />
                  <div className="absolute inset-s-4 top-4 flex justify-end">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-lowest/95 px-3 py-1.5 text-xs font-bold tracking-wide text-primary shadow-lg backdrop-blur-md ring-1 ring-outline-variant/20 dark:bg-surface-container-highest/90">
                      <Icon
                        name="monitoring"
                        filled
                        className="text-primary"
                        size="sm"
                      />
                      {t("precisionTitle")}
                    </span>
                  </div>
                </div>
                <div className="relative border-t border-outline-variant/15 bg-linear-to-b from-surface-container-low/90 to-surface-container-lowest p-6 md:p-8 dark:from-surface-container/80 dark:to-surface-container-lowest">
                  <p className="text-sm leading-relaxed text-on-surface-variant md:text-[0.9375rem] md:leading-relaxed">
                    {t("precisionBody")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="reveal-up flex flex-col gap-8 lg:col-span-7 lg:gap-10 lg:ps-2"
            style={{ animationDelay: "200ms" }}
          >
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
              <span className="inline-flex h-px w-10 shrink-0 bg-linear-to-e from-transparent via-primary to-primary md:w-14" />
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-primary dark:bg-primary/15">
                <Icon
                  name="clinical_notes"
                  filled
                  className="text-primary"
                  size="sm"
                />
                {t("eyebrow")}
              </div>
            </div>

            <div className="space-y-6">
              <h2
                id="editorial-heading"
                className="font-headline text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-on-surface md:text-5xl md:leading-[1.05] lg:text-[3rem] lg:leading-[1.02]"
              >
                {t("sectionTitle")}
              </h2>
              <div className="max-w-xl space-y-5 text-base leading-relaxed text-on-surface-variant md:text-lg md:leading-8">
                <p className="text-on-surface/90">{t("p1")}</p>
                <p>{t("p2")}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              <div className="relative overflow-hidden rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-lg shadow-primary/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/10 dark:border-white/5 dark:shadow-black/20 md:rounded-3xl md:p-7">
                <div className="absolute -inset-e-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
                <div className="relative flex flex-col gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-primary/15 to-primary-fixed/25 text-primary">
                    <Icon name="schedule" size="sm" />
                  </div>
                  <div>
                    <span className="block text-3xl font-black tracking-tight text-primary md:text-4xl">
                      {t("stat1Value")}
                    </span>
                    <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                      {t("stat1Label")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-lg shadow-tertiary-fixed/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-tertiary-fixed/15 dark:border-white/5 dark:shadow-black/20 md:rounded-3xl md:p-7">
                <div className="absolute -inset-e-8 -top-8 h-24 w-24 rounded-full bg-tertiary-fixed/15 blur-2xl" />
                <div className="relative flex flex-col gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-tertiary-fixed/25 to-tertiary-container/20 text-tertiary-container">
                    <Icon
                      name="workspace_premium"
                      filled
                      className="text-tertiary-container"
                      size="sm"
                    />
                  </div>
                  <div>
                    <span className="block text-3xl font-black tracking-tight text-primary md:text-4xl">
                      {t("stat2Value")}
                    </span>
                    <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                      {t("stat2Label")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Link
                href="/about"
                className="clinical-gradient group inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 text-sm font-bold tracking-wide text-on-primary shadow-xl shadow-primary/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/30 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:text-on-primary-container dark:shadow-primary/20"
              >
                {t("ctaLabel")}
                <Icon
                  name={ctaArrow}
                  className={ctaArrowClass}
                  size="sm"
                  aria-hidden
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
