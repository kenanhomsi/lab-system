import { useTranslations } from "next-intl";

export function CurrentPlanHero() {
  const t = useTranslations("subscriptions");

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary to-primary-container p-8 text-white shadow-xl md:p-10">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="relative z-10">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <span className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider">
              {t("activeBadge")}
            </span>
            <h3 className="mt-4 font-headline text-3xl font-extrabold md:text-4xl">
              {t("planName")}
            </h3>
            <p className="mt-2 font-medium text-primary-fixed-dim">
              {t("renewal")}
            </p>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-primary shadow-lg transition-colors hover:bg-slate-100"
          >
            {t("manage")}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-6 border-t border-white/20 pt-8">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-tighter text-primary-fixed-dim">
              {t("remainingTests")}
            </p>
            <p className="font-headline text-2xl font-bold">04 / 06</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-tighter text-primary-fixed-dim">
              {t("familyMembers")}
            </p>
            <p className="font-headline text-2xl font-bold">{t("activeMembers", { count: 2 })}</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-tighter text-primary-fixed-dim">
              {t("totalSavings")}
            </p>
            <p className="font-headline text-2xl font-bold">$1,240.00</p>
          </div>
        </div>
      </div>
    </div>
  );
}
