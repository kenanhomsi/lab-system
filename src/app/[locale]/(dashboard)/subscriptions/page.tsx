import { CurrentPlanHero } from "./ui/current-plan-hero";
import { FamilyGroup } from "./ui/family-group";
import { PricingPlans } from "./ui/pricing-plans";
import { VouchersGrid } from "./ui/vouchers-grid";
import { useTranslations } from "next-intl";

export default function SubscriptionsPage() {
  const t = useTranslations("subscriptions");

  return (
    <div className="mx-auto max-w-7xl space-y-12 p-6 md:p-8">
      <section className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CurrentPlanHero />
        </div>
        <FamilyGroup />
      </section>
      <PricingPlans />
      <VouchersGrid />
      <div className="fixed bottom-8 right-8 z-50">
        <button
          type="button"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-2xl transition-all hover:scale-110 active:scale-95"
          aria-label={t("supportAria")}
        >
          <span
            className="material-symbols-outlined text-2xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            support_agent
          </span>
        </button>
      </div>
    </div>
  );
}
