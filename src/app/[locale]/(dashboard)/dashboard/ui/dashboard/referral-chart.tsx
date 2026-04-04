import { Icon } from "@/components/ui/icon";
import { useTranslations } from "next-intl";

export function ReferralChart() {
  const t = useTranslations("dashboard.main");
  const bars = [
    { label: t("hematology"), outer: 40, inner: 60 },
    { label: t("biochem"), outer: 80, inner: 75 },
    { label: t("immunology"), outer: 60, inner: 40 },
    { label: t("microbiology"), outer: 90, inner: 85 },
    { label: t("genetics"), outer: 30, inner: 20 },
  ];

  return (
    <section className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-sm">
      <h2 className="mb-6 flex items-center gap-2 text-lg font-bold font-headline">
        <Icon name="bar_chart" className="text-primary" size="sm" />
        {t("chartTitle")}
      </h2>
      <div className="flex h-48 items-end gap-4 px-4">
        {bars.map((b) => (
          <div key={b.label} className="group flex flex-1 flex-col items-center">
            <div
              className="relative w-full rounded-t-lg bg-primary-container/20 transition-all group-hover:bg-primary/40"
              style={{ height: `${b.outer}%` }}
            >
              <div
                className="absolute inset-x-0 bottom-0 rounded-t-lg bg-primary transition-all"
                style={{ height: `${b.inner}%` }}
              />
            </div>
            <p className="mt-2 text-[10px] font-bold text-on-surface-variant">
              {b.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
