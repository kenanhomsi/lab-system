import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/icon";
import { Ripple } from "@/components/ui/ripple";
import { HeroWordRotate } from "./hero-word-rotate";

const HERO_IMG =
  "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1920&q=80";

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
  const rotateWords = [
    t("titleAccent"),
    t("titleRotate2"),
    t("titleRotate3"),
  ];

  return (
    <section className="relative flex h-[min(760px,92svh)] items-center overflow-hidden bg-surface">
      <div className="absolute inset-0 z-0">
        <Image
          src={HERO_IMG}
          alt={t("titleAccent")}
          fill
          className="hero-image-enter object-cover opacity-80"
          priority
          sizes="100vw"
          fetchPriority="high"
        />
        <div className={overlayGradientClass} />
      </div>
      <div className="pointer-events-none absolute inset-0 z-1">
        <div className="bg-orb h-44 w-44 bg-primary/14 -inset-s-10 top-24" />
        <div className="bg-orb bg-orb-reverse h-52 w-52 bg-tertiary-fixed/14 inset-e-10 bottom-16" />
      </div>
      <div
        className={`pointer-events-none absolute inset-y-0 z-2 w-[min(100%,42rem)] ${locale === "ar" ? "inset-s-0" : "inset-e-0"}`}
        aria-hidden
      >
        <Ripple
          numCircles={6}
          mainCircleSize={180}
          mainCircleOpacity={0.18}
          className="mask-none opacity-80"
        />
      </div>
      <div className="relative z-10 content-container w-full">
        <div className="max-w-2xl space-y-5">
          <div
            className="reveal-up inline-flex items-center rounded-full bg-tertiary-fixed/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-on-tertiary-fixed"
            style={{ animationDelay: "120ms" }}
          >
            <Icon name="verified" filled className="me-2 text-sm!" size="sm" />
            {t("badge")}
          </div>
          <h1
            className="font-headline reveal-up text-4xl font-extrabold tracking-tight text-on-surface sm:text-5xl md:text-6xl"
            style={{ animationDelay: "200ms" }}
          >
            {t("titleBefore")} <br />
            <HeroWordRotate words={rotateWords} /> <br />
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
              className="clinical-gradient group flex items-center gap-2 rounded-xl px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-primary/15 transition-all hover:opacity-95"
            >
              {t("ctaPrimary")}
              <Icon name={arrow} className={arrowClass} size="sm" />
            </Link>
            <Link
              href="/contact"
              className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest/92 px-7 py-3.5 text-base font-bold text-primary shadow-sm"
            >
              {t("ctaSecondary")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
