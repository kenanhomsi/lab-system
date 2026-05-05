import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/icon";

const HERO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB602t09HLOIszI3qsTP_hTw2L3nkxNOY4hgBg9p0Kv-MTlgsDAbG3jRXG2ul8YV1wNIi5qb95U_mUXHkZfPaky-I5jYGPwLLT1S2fLANXacbydaR8HA0ew6e1Z94x9-KxcqPK17qfocy-TAi2NZZeNruE90mtrbOPYg7MPGQce40oO_4JyZ3bOf8bXpva-LWtgvfAWleqm0HCOC7CQjpAO2izFCn9qAqjAb8UW4Gk3X-gOfkU8oB85pFXeBSAMp44SPlY8NIxbDs1z";

export async function AboutHeroSection() {
  const t = await getTranslations("aboutPage.hero");
  const locale = await getLocale();
  const arrow = locale === "ar" ? "arrow_back" : "arrow_forward";
  const arrowClass =
    locale === "ar"
      ? "text-primary transition-transform group-hover:-translate-x-1"
      : "text-primary transition-transform group-hover:translate-x-1";

  return (
    <section className="relative flex min-h-[600px] items-center overflow-hidden md:min-h-[700px]">
      <div className="absolute inset-0 z-0">
        <Image
          src={HERO}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-30"
          priority
        />

        <div className="absolute right-0 inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-6 md:px-8">
        <div className="max-w-3xl">
          <span
            className="reveal-up mb-6 inline-block rounded-full border border-primary/30 bg-primary/5 px-4 py-1 text-xs font-bold tracking-[0.2em] text-primary"
            style={{ animationDelay: "100ms" }}
          >
            {t("badge")}
          </span>
          <h1
            className="reveal-up mb-8 font-headline text-5xl font-black leading-[1.2] tracking-tight text-on-surface md:text-7xl"
            style={{ animationDelay: "180ms" }}
          >
            {t("titleBefore")} <br />
            <span className="text-primary">{t("titleAccent")}</span>
          </h1>
          <p
            className="reveal-up mb-10 max-w-xl text-lg leading-relaxed text-on-surface-variant md:text-xl"
            style={{ animationDelay: "260ms" }}
          >
            {t("description")}
          </p>
          <div className="reveal-up" style={{ animationDelay: "340ms" }}>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-8 py-4 shadow-sm transition-all hover:shadow-lg"
            >
              <span className="text-sm font-bold tracking-wide">
                {t("ctaContact")}
              </span>
              <Icon name={arrow} className={arrowClass} size="sm" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
