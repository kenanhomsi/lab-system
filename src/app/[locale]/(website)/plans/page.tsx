import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export default function PlansPage() {
  const t = useTranslations("subscriptions");

  const plans = [
    {
      key: "basic",
      title: t("basicTitle"),
      desc: t("basicDesc"),
      price: "29",
      features: [t("basicF1"), t("basicF2"), t("basicF3")],
      icon: "health_and_safety",
      tone: "default" as const,
    },
    {
      key: "gold",
      title: t("goldTitle"),
      desc: t("goldDesc"),
      price: "79",
      features: [t("goldF1"), t("goldF2"), t("goldF3")],
      icon: "workspace_premium",
      tone: "vip" as const,
      recommended: true,
    },
    {
      key: "platinum",
      title: t("platinumTitle"),
      desc: t("platinumDesc"),
      price: "199",
      features: [t("platF1"), t("platF2"), t("platF3")],
      icon: "diamond",
      tone: "muted" as const,
    },
  ];

  const vouchers = [
    {
      key: "v1",
      title: t("v1Title"),
      sub: t("v1Sub"),
      icon: "biotech",
      iconClass: "text-blue-600",
      bgClass: "bg-blue-50",
    },
    {
      key: "v2",
      title: t("v2Title"),
      sub: t("v2Sub"),
      icon: "medication",
      iconClass: "text-emerald-600",
      bgClass: "bg-emerald-50",
    },
    {
      key: "v3",
      title: t("v3Title"),
      sub: t("v3Sub"),
      icon: "favorite",
      iconClass: "text-rose-600",
      bgClass: "bg-rose-50",
    },
    {
      key: "v4",
      title: t("v4Title"),
      sub: t("v4Sub"),
      icon: "immunology",
      iconClass: "text-purple-600",
      bgClass: "bg-purple-50",
    },
  ];

  return (
    <main className="mx-auto max-w-7xl space-y-16 p-6 md:p-8">
      {/* Header Section */}
      <section className="rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-8 md:p-12 text-center md:text-start flex flex-col items-center md:items-start justify-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
          {t("upgradeEyebrow")}
        </p>
        <h1 className="mt-3 font-headline text-4xl font-bold text-on-surface md:text-5xl">
          {t("packagesTitle")}
        </h1>
      </section>

      {/* Packages Grid */}
      <section>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.key}
              className={`relative flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md ${plan.recommended ? "border-primary/50 shadow-sm" : ""
                }`}
              padding="lg"
            >
              {plan.recommended && (
                <div className="absolute top-0 right-0 rounded-bl-xl bg-primary px-4 py-1 text-xs font-bold text-on-primary">
                  {t("vip")}
                </div>
              )}

              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-container-high">
                <Icon name={plan.icon} size="lg" className="text-primary" />
              </div>

              <h2 className="font-headline text-2xl font-bold text-on-surface">
                {plan.title}
              </h2>
              <p className="mt-2 min-h-[3rem] text-sm text-on-surface-variant">
                {plan.desc}
              </p>

              <div className="my-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-on-surface">${plan.price}</span>
                <span className="text-sm font-medium text-secondary">{t("perMonth")}</span>
              </div>

              <ul className="mb-8 flex-1 space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Icon
                      name="check_circle"
                      size="sm"
                      filled
                      className="mt-0.5 text-primary"
                    />
                    <span className="text-sm text-on-surface">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.recommended ? "primary" : "secondary"}
                className="w-full"
              >
                {t("selectPlan")}
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Vouchers Section */}
      <section className="space-y-8">
        <div className="text-center md:text-start">
          <h2 className="font-headline text-3xl font-bold text-on-surface">
            {t("vouchersTitle")}
          </h2>
          <p className="mt-2 text-on-surface-variant">
            {t("vouchersSubtitle")}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {vouchers.map((voucher) => (
            <Card
              key={voucher.key}
              padding="sm"
              className="flex items-center gap-4 transition-colors hover:bg-surface-container-lowest"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${voucher.bgClass}`}
              >
                <Icon name={voucher.icon} className={voucher.iconClass} />
              </div>
              <div className="flex-1 overflow-hidden">
                <h3 className="truncate font-bold text-on-surface">
                  {voucher.title}
                </h3>
                <p className="truncate text-xs text-on-surface-variant">
                  {voucher.sub}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
