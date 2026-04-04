import { Icon } from "@/components/ui/icon";
import { useTranslations } from "next-intl";

export function RequestHistory() {
  const t = useTranslations("dashboard.main");
  const items = [
    {
      order: "MUT-99201",
      patient: "David Copperfield",
      time: t("hoursAgo", { count: 2 }),
      status: t("orderStatusProcessing"),
      sub: t("eta"),
      statusClass: "text-primary",
    },
    {
      order: "MUT-99198",
      patient: "Elena Rigby",
      time: t("hoursAgo", { count: 5 }),
      status: t("orderStatusCompleted"),
      sub: t("finalizedAm"),
      statusClass: "text-emerald-600",
    },
    {
      order: "MUT-99195",
      patient: "Mark Z.",
      time: t("yesterday"),
      status: t("orderStatusCompleted"),
      sub: t("finalizedPm"),
      statusClass: "text-emerald-600",
    },
  ];

  return (
    <section className="overflow-hidden rounded-xl border border-outline-variant/10 bg-surface-container-lowest shadow-sm">
      <div className="border-b border-surface-container-low px-6 py-5">
        <h2 className="text-lg font-bold font-headline">{t("historyTitle")}</h2>
      </div>
      <div className="divide-y divide-surface-container-low">
        {items.map((item) => (
          <div
            key={item.order + item.patient}
            className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-surface-container-low"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5 text-primary">
                <Icon name="receipt_long" size="sm" />
              </div>
              <div>
                <p className="text-sm font-semibold">#{item.order}</p>
                <p className="text-xs text-on-surface-variant">
                  {t("colPatient")}: {item.patient} | {item.time}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p
                  className={`text-[10px] font-bold uppercase tracking-wider ${item.statusClass}`}
                >
                  {item.status}
                </p>
                <p className="text-[10px] text-on-surface-variant">{item.sub}</p>
              </div>
              <Icon
                name="chevron_right"
                className="text-slate-300"
                size="sm"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
