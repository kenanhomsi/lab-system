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
    <section className="border-y border-outline-variant/20 py-16 md:py-24">
      <div className="mx-auto max-w-screen-2xl px-6 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-10 opacity-50 transition-opacity hover:opacity-100 md:gap-12">
          {items.map((item, i) => (
            <div
              key={item.line1}
              className="reveal-up flex items-center gap-4"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <Icon
                name={item.icon}
                className="text-4xl text-on-surface-variant"
              />
              <div className="text-xs font-black tracking-[0.2em]">
                {item.line1} <br />
                {item.line2}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
