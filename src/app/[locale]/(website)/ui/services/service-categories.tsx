import { getTranslations } from "next-intl/server";
import { Icon } from "@/components/ui/icon";
import { SectionHeader } from "@/components/ui/section-header";

export async function ServiceCategories() {
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
      features: [t("companyF1"), t("companyF2"), t("companyF3"), t("companyF4")],
    },
  ];

  return (
    <section className="bg-surface-container-low py-16 md:py-24">
      <div className="mx-auto max-w-screen-2xl px-6 md:px-8">
        <div className="reveal-up" style={{ animationDelay: "80ms" }}>
          <SectionHeader
            title={t("sectionTitle")}
            description={t("sectionDesc")}
            align="center"
          />
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {categories.map((cat, i) => (
            <div
              key={cat.title}
              className="reveal-up group rounded-2xl bg-surface-container-lowest p-8 shadow-sm transition-all duration-500 hover:shadow-xl md:p-10"
              style={{ animationDelay: `${160 + i * 100}ms` }}
            >
              <Icon name={cat.icon} className="mb-6 text-4xl text-primary" />
              <h3 className="mb-6 text-2xl font-bold">{cat.title}</h3>
              <ul className="space-y-3">
                {cat.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 text-on-surface-variant"
                  >
                    <Icon
                      name="check_circle"
                      filled
                      className="mt-0.5 shrink-0 text-primary"
                      size="sm"
                    />
                    <span className="text-sm leading-relaxed">{f}</span>
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
