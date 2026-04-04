import { useTranslations } from "next-intl";
import { PricingPlans } from "../../(dashboard)/subscriptions/ui/pricing-plans";
import { VouchersGrid } from "../../(dashboard)/subscriptions/ui/vouchers-grid";

export default function PlansPage() {
  const t = useTranslations("subscriptions");

  return (
    <main className="mx-auto max-w-7xl space-y-12 p-6 md:p-8">
      <section className="rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-6 md:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
          {t("upgradeEyebrow")}
        </p>
        <h1 className="mt-3 font-headline text-3xl font-bold text-on-surface md:text-4xl">
          {t("packagesTitle")}
        </h1>
      </section>
      <PricingPlans />
      <VouchersGrid />
    </main>
  );
}
