import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function ServicesCtaSection() {
  const t = await getTranslations("servicesPage.cta");

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 bg-surface" />
      <div className="absolute inset-0 border-y border-outline-variant/20" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center md:px-8">
        <h2
          className="reveal-up mb-8 font-headline text-4xl font-black leading-none tracking-tight md:text-6xl"
          style={{ animationDelay: "80ms" }}
        >
          {t("title1")} <br />
          {t("title2")}
        </h2>
        <p
          className="reveal-up mx-auto mb-10 max-w-2xl text-lg text-on-surface-variant"
          style={{ animationDelay: "160ms" }}
        >
          {t("subtitle")}
        </p>
        <div
          className="reveal-up flex flex-col justify-center gap-6 md:flex-row"
          style={{ animationDelay: "240ms" }}
        >
          <Link
            href="/contact"
            className="clinical-gradient rounded-xl px-10 py-5 text-sm font-bold tracking-widest text-on-primary shadow-2xl shadow-primary/40 transition-all hover:scale-105 active:scale-95"
          >
            {t("book")}
          </Link>
          <Link
            href="/about"
            className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-10 py-5 text-sm font-bold tracking-widest text-on-surface shadow-sm transition-all hover:shadow-lg"
          >
            {t("about")}
          </Link>
        </div>
      </div>
    </section>
  );
}
