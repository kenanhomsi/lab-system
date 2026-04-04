import { getTranslations } from "next-intl/server";

export async function PartnersStrip() {
  const t = await getTranslations("landing.partners");
  const stats = [
    { value: t("stat1Value"), label: t("stat1Label") },
    { value: t("stat2Value"), label: t("stat2Label") },
    { value: t("stat3Value"), label: t("stat3Label") },
    { value: t("stat4Value"), label: t("stat4Label") },
  ] as const;

  return (
    <section className="relative overflow-hidden bg-surface py-12 md:py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-orb h-48 w-48 bg-primary/12 inset-s-[14%] top-[10%]" />
        <div className="bg-orb bg-orb-reverse h-56 w-56 bg-primary-fixed/12 inset-e-[12%] bottom-[8%]" />
      </div>
      <div className="relative mx-auto max-w-screen-2xl px-6 md:px-8">
        <p
          className="reveal-up mb-10 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"
          style={{ animationDelay: "80ms" }}
        >
          {t("statsEyebrow")}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-20">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="reveal-up text-center"
              style={{ animationDelay: `${160 + i * 80}ms` }}
            >
              <div className="text-3xl font-black tracking-tighter text-primary md:text-4xl">
                {s.value}
              </div>
              <div className="mt-2 text-xs font-bold tracking-wide text-slate-500">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
