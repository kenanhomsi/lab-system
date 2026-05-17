import { getTranslations } from "next-intl/server";
import { Icon } from "@/components/ui/icon";

export async function AboutAccreditationStrip() {
  const t = await getTranslations("aboutPage.trust");
  const items = [
    {
      icon: "workspace_premium" as const,
      line1: t("isoLine1"),
      line2: t("isoLine2"),
    },
    {
      icon: "verified_user" as const,
      line1: t("ukLine1"),
      line2: t("ukLine2"),
    },
    {
      icon: "clinical_notes" as const,
      line1: t("clinicalLine1"),
      line2: t("clinicalLine2"),
    },
    {
      icon: "shield_with_heart" as const,
      line1: t("qcLine1"),
      line2: t("qcLine2"),
    },
  ];

  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-screen-6xl px-6 md:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-around md:gap-24">
          {items.map((item, i) => (
            <div
              key={item.line1}
              className="reveal-up flex items-center gap-5"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <Icon name={item.icon} className="text-3xl text-tertiary" />
              <div className="flex flex-col">
                <span className="text-base font-bold uppercase tracking-[0.2em] text-on-surface md:text-lg">
                  {item.line1}
                </span>
                <span className="text-sm text-on-surface-variant md:text-base">
                  {item.line2}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
