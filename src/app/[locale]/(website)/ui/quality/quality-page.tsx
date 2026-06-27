import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/icon";

const QUALITY_IMAGE = "/images/quality/quality-control-building.jpg";

/**
 * Renders the public quality-control page with accreditation and workflow details.
 */
export async function QualityControlPageView() {
  const t = await getTranslations("qualityPage");
  const locale = await getLocale();
  const arrow = locale === "ar" ? "arrow_back" : "arrow_forward";
  const arrowShiftClass =
    locale === "ar"
      ? "group-hover:-translate-x-1"
      : "group-hover:translate-x-1";

  const qualityCards = [
    {
      icon: "workspace_premium",
      title: t("system.card1Title"),
      body: t("system.card1Body"),
    },
    {
      icon: "biotech",
      title: t("system.card2Title"),
      body: t("system.card2Body"),
    },
    {
      icon: "monitoring",
      title: t("system.card3Title"),
      body: t("system.card3Body"),
    },
    {
      icon: "rule",
      title: t("system.card4Title"),
      body: t("system.card4Body"),
    },
  ] as const;

  const serviceAudience = [
    t("services.audience1"),
    t("services.audience2"),
    t("services.audience3"),
    t("services.audience4"),
    t("services.audience5"),
    t("services.audience6"),
  ];

  const scheduleItems = [
    {
      label: t("system.dailyLabel"),
      description: t("system.dailyBody"),
    },
    {
      label: t("system.weeklyLabel"),
      description: t("system.weeklyBody"),
    },
    {
      label: t("system.monthlyLabel"),
      description: t("system.monthlyBody"),
    },
  ] as const;

  return (
    <main className="overflow-x-hidden bg-background">
      <section className="relative isolate overflow-hidden border-b border-outline-variant/20 bg-[linear-gradient(180deg,rgba(0,156,194,0.08)_0%,rgba(255,255,255,0)_100%)]">
        <div className="absolute inset-0 -z-10">
          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
        </div>

        <div className="content-container py-16 md:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div className="space-y-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-4 py-2 text-xs font-black tracking-[0.24em] text-primary shadow-sm uppercase">
                <span className="h-2 w-2 rounded-full bg-primary" />
                {t("hero.badge")}
              </span>

              <div className="space-y-4">
                <h1 className="font-headline text-4xl font-black leading-tight tracking-tight text-on-surface sm:text-5xl lg:text-6xl">
                  {t("hero.titleLine1")}{" "}
                  <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                    {t("hero.titleAccent")}
                  </span>
                </h1>
                <p className="max-w-2xl text-base leading-8 text-on-surface-variant md:text-lg">
                  {t("hero.description")}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {["ISO 9001:2015", "URS", "UKAS", "IAF"].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-outline-variant/30 bg-surface px-4 py-2 text-sm font-bold text-on-surface shadow-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="rounded-3xl border border-primary/15 bg-white/80 p-6 shadow-lg shadow-slate-950/5 backdrop-blur">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon name="verified" filled size="md" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-black tracking-[0.16em] text-primary uppercase">
                      {t("hero.accreditationLabel")}
                    </p>
                    <p className="font-headline text-2xl font-black tracking-tight text-on-surface">
                      {t("hero.accreditationValue")}
                    </p>
                    <p className="text-sm leading-7 text-on-surface-variant">
                      {t("hero.accreditationBody")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-3 rounded-2xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <Icon name="support_agent" size="sm" />
                  {t("hero.primaryCta")}
                  <Icon
                    name={arrow}
                    size="sm"
                    className={`transition-transform ${arrowShiftClass}`}
                  />
                </Link>
                <Link
                  href="/tests"
                  className="inline-flex items-center gap-3 rounded-2xl border border-outline-variant/30 bg-white px-6 py-3.5 text-sm font-bold text-on-surface shadow-sm transition-colors hover:border-primary/30 hover:text-primary"
                >
                  <Icon name="science" size="sm" />
                  {t("hero.secondaryCta")}
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-[2rem] border border-outline-variant/20 bg-surface shadow-2xl shadow-slate-950/10">
                <Image
                  src={QUALITY_IMAGE}
                  alt={t("hero.imageAlt")}
                  width={1800}
                  height={1200}
                  className="h-full w-full object-cover"
                  priority
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/75 via-slate-950/35 to-transparent p-6 text-white md:p-8">
                  <p className="text-xs font-black tracking-[0.24em] uppercase text-cyan-200">
                    {t("hero.imageCaptionLabel")}
                  </p>
                  <p className="mt-2 text-lg font-bold leading-8">
                    {t("hero.imageCaptionBody")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="content-container py-16 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <div className="space-y-4">
            <p className="text-sm font-black tracking-[0.24em] text-primary uppercase">
              {t("story.eyebrow")}
            </p>
            <h2 className="font-headline text-3xl font-black tracking-tight text-on-surface md:text-4xl">
              {t("story.title")}
            </h2>
            <p className="text-base leading-8 text-on-surface-variant">
              {t("story.intro")}
            </p>
          </div>

          <div className="space-y-5">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm"
              >
                <p className="text-base leading-8 text-on-surface-variant">
                  {t(`story.paragraph${item}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-outline-variant/20 bg-surface-container-lowest/60 py-16 md:py-20">
        <div className="content-container space-y-10">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm font-black tracking-[0.24em] text-primary uppercase">
              {t("system.eyebrow")}
            </p>
            <h2 className="font-headline text-3xl font-black tracking-tight text-on-surface md:text-4xl">
              {t("system.title")}
            </h2>
            <p className="text-base leading-8 text-on-surface-variant">
              {t("system.description")}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {qualityCards.map((card) => (
              <article
                key={card.title}
                className="rounded-3xl border border-outline-variant/20 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon name={card.icon} size="md" />
                </div>
                <h3 className="mt-5 font-headline text-xl font-black tracking-tight text-on-surface">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-on-surface-variant">
                  {card.body}
                </p>
              </article>
            ))}
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {scheduleItems.map((item) => (
              <div
                key={item.label}
                className="rounded-3xl border border-primary/15 bg-primary/[0.05] p-6"
              >
                <p className="text-sm font-black tracking-[0.22em] text-primary uppercase">
                  {item.label}
                </p>
                <p className="mt-3 text-sm leading-7 text-on-surface-variant">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-container py-16 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:gap-12">
          <div className="space-y-5">
            <p className="text-sm font-black tracking-[0.24em] text-primary uppercase">
              {t("services.eyebrow")}
            </p>
            <h2 className="font-headline text-3xl font-black tracking-tight text-on-surface md:text-4xl">
              {t("services.title")}
            </h2>
            <p className="text-base leading-8 text-on-surface-variant">
              {t("services.description")}
            </p>

            <div className="flex flex-wrap gap-3">
              {serviceAudience.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-outline-variant/25 bg-surface px-4 py-2 text-sm font-semibold text-on-surface-variant"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-3xl border border-outline-variant/20 bg-surface p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                  <Icon name="science" size="md" />
                </div>
                <h3 className="font-headline text-xl font-black tracking-tight text-on-surface">
                  {t("services.card1Title")}
                </h3>
              </div>
              <p className="mt-4 text-sm leading-7 text-on-surface-variant">
                {t("services.card1Body")}
              </p>
            </div>

            <div className="rounded-3xl border border-outline-variant/20 bg-surface p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-tertiary/10 text-tertiary">
                  <Icon name="groups" size="md" />
                </div>
                <h3 className="font-headline text-xl font-black tracking-tight text-on-surface">
                  {t("services.card2Title")}
                </h3>
              </div>
              <p className="mt-4 text-sm leading-7 text-on-surface-variant">
                {t("services.card2Body")}
              </p>
            </div>

            <div className="rounded-3xl border border-primary/15 bg-primary/[0.05] p-6">
              <p className="text-sm leading-8 font-semibold text-on-surface">
                {t("services.closing")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="content-container pb-16 md:pb-24">
        <div className="rounded-[2rem] border border-outline-variant/20 bg-[linear-gradient(135deg,rgba(0,156,194,0.12)_0%,rgba(255,255,255,0.92)_100%)] p-8 shadow-sm md:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-sm font-black tracking-[0.24em] text-primary uppercase">
                {t("cta.eyebrow")}
              </p>
              <h2 className="font-headline text-3xl font-black tracking-tight text-on-surface">
                {t("cta.title")}
              </h2>
              <p className="text-base leading-8 text-on-surface-variant">
                {t("cta.body")}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 rounded-2xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
              >
                <Icon name="mail" size="sm" />
                {t("cta.primary")}
              </Link>
              <Link
                href="/tests"
                className="inline-flex items-center gap-3 rounded-2xl border border-outline-variant/30 bg-white px-6 py-3.5 text-sm font-bold text-on-surface shadow-sm transition-colors hover:border-primary/30 hover:text-primary"
              >
                <Icon name="biotech" size="sm" />
                {t("cta.secondary")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
