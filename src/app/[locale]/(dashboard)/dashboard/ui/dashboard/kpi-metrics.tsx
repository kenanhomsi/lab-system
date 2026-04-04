import { Icon } from "@/components/ui/icon";
import { useTranslations } from "next-intl";

export function KpiMetrics() {
  const t = useTranslations("dashboard.main");

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
      <div className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-sm">
        <div className="mb-4 flex items-start justify-between">
          <Icon name="groups" className="text-3xl text-primary" />
          <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600">
            {t("trendUp")}
          </span>
        </div>
        <p className="mb-1 text-[0.6875rem] font-bold uppercase tracking-widest text-secondary">
          {t("kpiReferred")}
        </p>
        <h3 className="text-3xl font-extrabold text-on-surface">340</h3>
        <p className="mt-2 text-xs text-on-surface-variant">
          {t("kpiReferredSub")}
        </p>
      </div>
      <div className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-sm">
        <div className="mb-4 flex items-start justify-between">
          <Icon
            name="priority_high"
            className="text-3xl text-tertiary-container"
          />
          <div className="h-2 w-2 animate-pulse rounded-full bg-tertiary-fixed" />
        </div>
        <p className="mb-1 text-[0.6875rem] font-bold uppercase tracking-widest text-secondary">
          {t("kpiPending")}
        </p>
        <h3 className="text-3xl font-extrabold text-on-surface">
          12{" "}
          <span className="text-lg font-medium text-tertiary">{t("kpiUrgent")}</span>
        </h3>
        <p className="mt-2 text-xs text-on-surface-variant">
          {t("kpiPendingSub")}
        </p>
      </div>
      <div className="relative col-span-1 flex flex-col justify-between overflow-hidden rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-sm md:col-span-2">
        <div className="relative z-10">
          <div className="mb-2 flex items-start justify-between">
            <p className="text-[0.6875rem] font-bold uppercase tracking-widest text-secondary">
              {t("kpiCommission")}
            </p>
            <Icon name="payments" className="text-emerald-500" size="sm" />
          </div>
          <h3 className="text-3xl font-extrabold text-on-surface">$4,850.00</h3>
          <p className="mt-1 text-xs text-on-surface-variant">
            {t("kpiCommissionSub")}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 opacity-10">
          <svg className="h-full w-full" viewBox="0 0 400 100" aria-hidden>
            <path
              className="text-primary"
              d="M0 80 Q 50 20, 100 70 T 200 40 T 300 80 T 400 30"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
