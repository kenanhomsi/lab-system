import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/icon";

const HERO_IMG =
  "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=2000&q=80";

export async function HeroSection() {
  const t = await getTranslations("landing.hero");
  const locale = await getLocale();
  const arrow = locale === "ar" ? "arrow_back" : "arrow_forward";
  const arrowClass =
    locale === "ar"
      ? "transition-transform group-hover:-translate-x-1"
      : "transition-transform group-hover:translate-x-1";
  const overlayGradientClass =
    locale === "ar"
      ? "absolute inset-0 bg-linear-to-l from-background via-background/40 to-transparent"
      : "absolute inset-0 bg-linear-to-r from-background via-background/40 to-transparent";

  return (
    <section className="relative flex h-[min(921px,100svh)] items-center overflow-hidden bg-surface">
      <div className="absolute inset-0 z-0">
        <Image
          src={HERO_IMG}
          alt=""
          fill
          className="hero-image-enter object-cover opacity-90"
          priority
          unoptimized
        />
        <div className={overlayGradientClass} />
      </div>
      <div className="pointer-events-none absolute inset-0 z-1">
        <div className="bg-orb h-64 w-64 bg-primary/25 -inset-s-16 top-20" />
        <div className="bg-orb bg-orb-reverse h-72 w-72 bg-tertiary-fixed/20 inset-e-10 bottom-16" />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-6 md:px-8">
        <div className="max-w-2xl space-y-6">
          <div
            className="gold-glow reveal-up inline-flex items-center rounded-full bg-tertiary-fixed px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-on-tertiary-fixed"
            style={{ animationDelay: "120ms" }}
          >
            <Icon name="verified" filled className="me-2 text-sm!" size="sm" />
            {t("badge")}
          </div>
          <h1
            className="font-headline leading-[1-2]  reveal-up text-4xl font-extrabold  tracking-tight text-on-surface sm:text-5xl md:text-6xl"
            style={{ animationDelay: "200ms" }}
          >
            {t("titleBefore")} <br />
            <span className="text-primary">{t("titleAccent")}</span> <br />
            {t("titleAfter")}
          </h1>
          <p
            className="reveal-up max-w-lg text-lg font-medium leading-relaxed text-on-surface-variant"
            style={{ animationDelay: "280ms" }}
          >
            {t("description")}
          </p>
          <div
            className="reveal-up flex flex-wrap items-center gap-4 pt-4"
            style={{ animationDelay: "360ms" }}
          >
            <Link
              href="/services"
              className="clinical-gradient text-white group flex items-center gap-2 rounded-xl px-8 py-4 text-lg font-bold shadow-xl shadow-primary/20 transition-all"
            >
              {t("ctaPrimary")}
              <Icon name={arrow} className={arrowClass} size="sm" />
            </Link>
            <Link
              href="/contact"
              className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-8 py-4 text-lg font-bold text-primary shadow-sm"
            >
              {t("ctaSecondary")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
