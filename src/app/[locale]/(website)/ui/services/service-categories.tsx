import { getLocale, getTranslations } from "next-intl/server";
import { Icon } from "@/components/ui/icon";
import { SectionHeader } from "@/components/ui/section-header";

export async function ServiceCategories() {
  const locale = await getLocale();
  const t = await getTranslations("servicesPage.categories");
  const categories = [
    {
      icon: "personal_injury" as const,
      title: t("patientTitle"),
      features: [
        t("patientF1"),
        t("patientF2"),
        t("patientF3"),
        t("patientF4"),
        t("patientF5"),
        t("patientF6"),
      ],
    },
    {
      icon: "stethoscope" as const,
      title: t("doctorTitle"),
      features: [
        t("doctorF1"),
        t("doctorF2"),
        t("doctorF3"),
        t("doctorF4"),
        t("doctorF5"),
        t("doctorF6"),
      ],
    },
    {
      icon: "science" as const,
      title: t("labTitle"),
      features: [t("labF1"), t("labF2"), t("labF3"), t("labF4")],
    },
    {
      icon: "business" as const,
      title: t("companyTitle"),
      features: [
        t("companyF1"),
        t("companyF2"),
        t("companyF3"),
        t("companyF4"),
      ],
    },
  ];
  const numberFormatter = new Intl.NumberFormat(locale);

  return (
    <section className="relative overflow-hidden bg-surface-container-low py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-orb h-52 w-52 bg-primary/8 inset-s-[6%] top-[12%]" />
        <div className="bg-orb bg-orb-reverse h-64 w-64 bg-tertiary-fixed/8 inset-e-[7%] bottom-[10%]" />
      </div>
      <div className="relative mx-auto max-w-screen-2xl px-6 md:px-8">
        <div className="reveal-up" style={{ animationDelay: "80ms" }}>
          <SectionHeader
            title={t("sectionTitle")}
            description={t("sectionDesc")}
            align="center"
            className="mx-auto max-w-3xl"
          />
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:gap-8">
          {categories.map((cat, i) => (
            <div
              key={cat.title}
              className="reveal-up group relative isolate overflow-hidden rounded-[2rem] border border-outline-variant/30 bg-surface-container-lowest/95 p-7 shadow-sm ring-1 ring-white/40 transition-all duration-500 hover:-translate-y-2 hover:border-primary/20 hover:shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)] md:p-8"
              style={{ animationDelay: `${160 + i * 100}ms` }}
            >
              <div className="absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
              <div className="absolute -top-10 inset-e-8 h-28 w-28 rounded-full bg-primary/10 blur-3xl transition-transform duration-500 group-hover:scale-125" />
              <div className="relative mb-8 flex items-start justify-between gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-primary/20 via-primary/10 to-primary/5 text-primary shadow-sm ring-1 ring-primary/10 transition-all duration-500 group-hover:scale-105 group-hover:-rotate-3">
                  <Icon name={cat.icon} className="text-3xl" />
                </div>
                <div className="inline-flex h-11 min-w-11 items-center justify-center rounded-full border border-primary/15 bg-primary/6 px-4 text-xs font-black tracking-[0.22em] text-primary">
                  {numberFormatter.format(i + 1)}
                </div>
              </div>
              <h3 className="mb-6 text-2xl font-black tracking-tight text-on-surface md:text-[1.75rem]">
                {cat.title}
              </h3>
              <ul className="grid gap-3">
                {cat.features.map((f, featureIndex) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 rounded-2xl bg-surface-container-low px-4 py-4 text-on-surface-variant shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] ring-1 ring-outline-variant/15 transition-all duration-300 group-hover:bg-surface group-hover:text-on-surface"
                  >
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                      <Icon
                        name="check"
                        filled
                        className="text-sm!"
                        size="sm"
                      />
                    </div>
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="pt-0.5 text-[11px] font-black tracking-[0.2em] text-primary/60">
                        {numberFormatter.format(featureIndex + 1)}
                      </span>
                      <span className="text-sm leading-7">{f}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
