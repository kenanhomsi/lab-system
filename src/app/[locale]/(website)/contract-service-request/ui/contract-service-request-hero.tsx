import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Icon } from "@/components/ui/icon";

const HERO_IMG =
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=2000&q=80";

/**
 * Contract service request page hero with CTAs and highlights.
 */
export async function ContractServiceRequestHeroSection() {
  const t = await getTranslations("contractServiceRequest.hero");

  const highlights = [
    { icon: "groups", key: "highlight1" },
    { icon: "savings", key: "highlight2" },
    { icon: "verified", key: "highlight3" },
  ] as const;

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={HERO_IMG}
          alt=""
          fill
          className="object-cover opacity-25"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(165deg,rgba(248,249,252,0.9)_0%,rgba(219,234,254,0.65)_45%,rgba(248,249,252,0.95)_100%)]" />
      </div>
      <div className="absolute inset-0 z-0">
        <div className="absolute -end-32 top-0 h-[480px] w-[480px] rounded-full bg-tertiary/[0.08] blur-[80px]" />
        <div className="absolute -start-24 bottom-0 h-[360px] w-[360px] rounded-full bg-primary/[0.06] blur-[80px]" />
      </div>

      <div className="relative z-10 content-container w-full py-16 md:py-24 lg:py-28">
        <div className="max-w-3xl">
          <div
            className="reveal-up inline-flex items-center gap-3 rounded-full border border-primary/20 bg-white/70 px-5 py-2.5 shadow-sm backdrop-blur-md"
            style={{ animationDelay: "80ms" }}
          >
            <Icon name="description" filled size="sm" className="text-primary" />
            <span className="text-xs font-black tracking-[0.28em] text-primary uppercase">
              {t("badge")}
            </span>
          </div>

          <h1
            className="reveal-up mt-8 font-headline text-5xl font-black leading-[1.05] tracking-tight text-on-surface md:text-6xl lg:text-7xl"
            style={{ animationDelay: "160ms" }}
          >
            {t("titleLine1")}{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t("titleAccent")}
            </span>
          </h1>

          <p
            className="reveal-up mt-6 max-w-xl text-lg leading-relaxed text-on-surface-variant md:text-xl"
            style={{ animationDelay: "240ms" }}
          >
            {t("description")}
          </p>

          <div
            className="reveal-up mt-10 flex flex-wrap items-center gap-4"
            style={{ animationDelay: "320ms" }}
          >
            <a
              href="#contract-request-form"
              className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-primary to-primary/90 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-primary/30"
            >
              <Icon name="edit_document" size="sm" />
              {t("primaryCta")}
              <Icon
                name="arrow_downward"
                size="sm"
                className="opacity-80 transition-transform group-hover:translate-y-0.5"
              />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-3 rounded-2xl border border-outline-variant/40 bg-white/80 px-7 py-4 text-sm font-bold text-on-surface shadow-lg shadow-slate-950/5 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary"
            >
              <Icon name="info" size="sm" />
              {t("secondaryCta")}
            </a>
          </div>

          <div
            className="reveal-up mt-12 grid gap-4 sm:grid-cols-3"
            style={{ animationDelay: "400ms" }}
          >
            {highlights.map((item) => (
              <div
                key={item.key}
                className="flex items-start gap-4 rounded-2xl border border-outline-variant/20 bg-white/70 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary shadow-sm">
                  <Icon name={item.icon} filled size="sm" />
                </div>
                <p className="text-sm font-medium leading-6 text-on-surface-variant">
                  {t(item.key)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
