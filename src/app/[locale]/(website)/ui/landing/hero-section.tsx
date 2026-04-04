import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/icon";

const HERO_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBRBY1nOHL-cPqEie9l3kD7TZqPfTcORPcokcYqzj2_DgxDqQkvT81UwZfccaFufkVLmXspvZGWh2Tq_BU_x4ilqF5JlgXEIf-BlwZaV5W6E8BwC_r9OD8lMzOe2ytzmzvo5A_HTdmqHg3SPmYbs4WXeeMNXidTn6u2weSxBDY14OevRAC0ZO3_xTbknyDggPulfkIIDLVqfevbr4CbYAHRLVk7YqUyWLiFNqtAdMMCPtj6F2sYTev4GITTOCMcZtSXmriLZDfC2BN-";

export async function HeroSection() {
  const t = await getTranslations("landing.hero");
  const locale = await getLocale();
  const arrow = locale === "ar" ? "arrow_back" : "arrow_forward";
  const arrowClass =
    locale === "ar"
      ? "transition-transform group-hover:-translate-x-1"
      : "transition-transform group-hover:translate-x-1";

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
        <div className="absolute inset-0 bg-linear-to-r from-background via-background/40 to-transparent" />
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
            className="font-headline reveal-up text-4xl font-extrabold leading-[1.1] tracking-tight text-on-surface sm:text-5xl md:text-6xl"
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
              className="clinical-gradient group flex items-center gap-2 rounded-xl px-8 py-4 text-lg font-bold text-on-primary-container shadow-xl shadow-primary/20 transition-all"
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
