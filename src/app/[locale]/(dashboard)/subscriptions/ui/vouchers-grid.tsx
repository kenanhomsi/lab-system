import { Icon } from "@/components/ui/icon";
import { GlassCard } from "@/components/ui/glass-card";
import { useTranslations } from "next-intl";

export function VouchersGrid() {
  const t = useTranslations("subscriptions");
  const vouchers = [
    {
      icon: "biotech" as const,
      iconClass: "text-primary",
      title: t("v1Title"),
      subtitle: t("v1Sub"),
      blobClass: "bg-primary/5",
    },
    {
      icon: "bloodtype" as const,
      iconClass: "text-tertiary",
      title: t("v2Title"),
      subtitle: t("v2Sub"),
      blobClass: "bg-tertiary-fixed/20",
    },
    {
      icon: "ecg_heart" as const,
      iconClass: "text-error",
      title: t("v3Title"),
      subtitle: t("v3Sub"),
      blobClass: "bg-error/5",
    },
    {
      icon: "vaccines" as const,
      iconClass: "text-primary",
      title: t("v4Title"),
      subtitle: t("v4Sub"),
      blobClass: "bg-primary/5",
    },
  ];

  return (
    <section>
      <div className="mb-8">
        <h3 className="font-headline text-2xl font-bold text-on-surface">
          {t("vouchersTitle")}
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          {t("vouchersSubtitle")}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {vouchers.map((v) => (
          <GlassCard
            key={v.title}
            className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-white p-6 shadow-sm dark:border-slate-200/10"
          >
            <div
              className={`absolute -right-4 -top-4 h-20 w-20 rounded-full transition-transform group-hover:scale-110 ${v.blobClass}`}
            />
            <div className="mb-4">
              <Icon name={v.icon} className={v.iconClass} size="sm" />
            </div>
            <h5 className="mb-1 font-bold text-slate-900 dark:text-slate-100">
              {v.title}
            </h5>
            <p className="mb-4 text-[11px] font-medium uppercase tracking-wider text-slate-500">
              {v.subtitle}
            </p>
            <div className="mt-auto">
              <button
                type="button"
                className="w-full rounded-lg bg-surface-container-high py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-primary hover:text-white dark:text-slate-200"
              >
                {t("claim")}
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
