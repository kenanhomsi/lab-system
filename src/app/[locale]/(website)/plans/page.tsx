import { getLocale, getTranslations } from "next-intl/server";
import type { SubscriptionPackageItem } from "@/components/tables/subscription-packages-table/types";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { mapSubscriptionPackagesToPlans } from "@/lib/api/map-subscription-packages-to-plans";
import { getRequestOrigin } from "@/lib/api/request-origin";

async function fetchPublicPackages(): Promise<SubscriptionPackageItem[]> {
  const origin = await getRequestOrigin();
  const res = await fetch(`${origin}/api/subscriptions/packages`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return (await res.json()) as SubscriptionPackageItem[];
}

export default async function PlansPage() {
  const t = await getTranslations("subscriptions");
  const locale = await getLocale();
  const numberFormatter = new Intl.NumberFormat(locale);

  const packages = await fetchPublicPackages();
  const plans = mapSubscriptionPackagesToPlans({ packages, t, locale });

  const subscriptionHighlights = [
    {
      label: t("remainingTests"),
      value: numberFormatter.format(24),
      icon: "biotech",
    },
    {
      label: t("familyMembers"),
      value: numberFormatter.format(3),
      icon: "groups_2",
      detail: t("activeMembers", { count: numberFormatter.format(2) }),
    },
    {
      label: t("totalSavings"),
      value: `$${numberFormatter.format(180)}`,
      icon: "savings",
    },
  ];

  const vouchers = [
    {
      key: "v1",
      title: t("v1Title"),
      sub: t("v1Sub"),
      icon: "biotech",
    },
    {
      key: "v2",
      title: t("v2Title"),
      sub: t("v2Sub"),
      icon: "medication",
    },
    {
      key: "v3",
      title: t("v3Title"),
      sub: t("v3Sub"),
      icon: "immunology",
    },
    {
      key: "v4",
      title: t("v4Title"),
      sub: t("v4Sub"),
      icon: "favorite",
    },
  ];

  return (
    <main className="bg-linear-to-b from-surface via-surface to-surface-container-low pb-24">
      <section className="pt-10 md:pt-14">
        <div className="content-container">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/6 px-4 py-2 text-xs font-black tracking-[0.22em] text-primary">
              <Icon
                name="workspace_premium"
                size="sm"
                className="text-primary"
              />
              {t("upgradeEyebrow")}
            </div>
            <h1 className="mt-6 font-headline text-4xl font-black tracking-tight text-on-surface md:text-6xl">
              {t("packagesTitle")}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-on-surface-variant md:text-lg">
              {t("vouchersSubtitle")}
            </p>
            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-outline-variant/20 bg-surface-container-lowest p-1 shadow-sm">
              <span className="rounded-full bg-surface px-4 py-2 text-sm font-bold text-on-surface shadow-sm">
                {t("monthly")}
              </span>
              <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
                {t("yearly")}
              </span>
            </div>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
            {subscriptionHighlights.map((item) => (
              <div
                key={item.label}
                className="rounded-[1.5rem] border border-outline-variant/15 bg-linear-to-br from-surface-container-lowest to-surface px-5 py-5 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon name={item.icon} size="sm" className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-2xl font-black tracking-tight text-on-surface">
                      {item.value}
                    </p>
                    <p className="text-sm text-on-surface-variant">
                      {item.label}
                    </p>
                  </div>
                </div>
                {item.detail ? (
                  <p className="mt-3 text-xs text-on-surface-variant">
                    {item.detail}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-16 md:pt-20">
        <div className="content-container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black tracking-[0.22em] text-primary">
              {t("activePlan")}
            </p>
            <h2 className="mt-3 font-headline text-3xl font-black tracking-tight text-on-surface md:text-5xl">
              {t("packagesTitle")}
            </h2>
          </div>

          {plans.length === 0 ? (
            <p className="mt-12 text-center text-base text-on-surface-variant">
              {locale.startsWith("ar")
                ? "لا توجد باقات اشتراك متاحة حالياً."
                : "No subscription packages are available at the moment."}
            </p>
          ) : (
            <div className="mt-12 grid gap-6 xl:grid-cols-3">
              {plans.map((plan) => (
                <section
                  key={plan.key}
                  className={[
                    "relative flex h-full flex-col rounded-[2rem] border bg-surface-container-lowest p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
                    plan.recommended
                      ? "border-primary/35 bg-linear-to-b from-primary/8 via-surface-container-lowest to-surface-container-lowest ring-1 ring-primary/12 xl:-translate-y-4 xl:shadow-[0_30px_70px_-40px_rgba(15,23,42,0.35)]"
                      : "border-outline-variant/20",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-primary/16 to-primary/6 text-primary">
                      <Icon
                        name={plan.icon}
                        size="lg"
                        className="text-primary"
                      />
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      {plan.recommended ? (
                        <div className="rounded-full bg-primary px-4 py-1.5 text-xs font-black tracking-[0.2em] text-on-primary">
                          {t("vip")}
                        </div>
                      ) : null}
                      <div className="rounded-full border border-outline-variant/20 bg-surface px-4 py-2 text-xs font-black tracking-[0.18em] text-on-surface-variant">
                        {plan.eyebrow}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 border-b border-outline-variant/15 pb-8">
                    <h3 className="font-headline text-3xl font-black tracking-tight text-on-surface">
                      {plan.title}
                    </h3>
                    <p className="mt-3 min-h-[3.5rem] text-sm leading-7 text-on-surface-variant">
                      {plan.desc}
                    </p>
                    <div className="mt-7 flex items-end gap-2">
                      <span
                        className={[
                          "text-5xl font-black tracking-tight text-on-surface",
                          plan.recommended && "text-primary",
                        ].join(" ")}
                      >
                        ${numberFormatter.format(plan.price)}
                      </span>
                      <span className="pb-2 text-sm font-semibold text-on-surface-variant">
                        {plan.pricePeriodLabel}
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 flex-1 space-y-4">
                    {plan.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-start gap-3 text-sm leading-7 text-on-surface"
                      >
                        <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Icon name="check" size="sm" className="text-sm!" />
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10">
                    <Button
                      variant={plan.recommended ? "primary" : "secondary"}
                      className="w-full"
                    >
                      {plan.recommended
                        ? t("currentSelection")
                        : t("selectPlan")}
                    </Button>
                    {plan.recommended ? (
                      <p className="mt-3 text-center text-xs font-medium text-primary">
                        {t("activePlan")}
                      </p>
                    ) : null}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="pt-16 md:pt-20">
        <div className="content-container rounded-[2rem] border border-outline-variant/20 bg-linear-to-br from-surface-container-lowest via-surface-container-lowest to-primary/5 p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 border-b border-outline-variant/15 pb-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-black tracking-[0.22em] text-primary">
                {t("vip")}
              </p>
              <h2 className="mt-3 font-headline text-3xl font-black tracking-tight text-on-surface md:text-4xl">
                {t("vouchersTitle")}
              </h2>
              <p className="mt-3 text-base leading-7 text-on-surface-variant">
                {t("vouchersSubtitle")}
              </p>
            </div>
            <div className="rounded-[1.25rem] border border-primary/15 bg-primary/6 px-5 py-4">
              <p className="text-sm font-bold text-on-surface">
                {t("planName")}
              </p>
              <p className="mt-1 text-xs text-on-surface-variant">
                {t("activePlan")}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {vouchers.map((voucher) => (
              <article
                key={voucher.key}
                className="flex items-start gap-4 rounded-[1.5rem] border border-outline-variant/15 bg-linear-to-br from-surface to-surface-container-low px-5 py-5 transition-colors hover:bg-surface-container-low"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-primary/16 to-primary/6 text-primary">
                  <Icon name={voucher.icon} className="text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-headline text-xl font-black text-on-surface">
                    {voucher.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-on-surface-variant">
                    {voucher.sub}
                  </p>
                </div>
                <Button variant="secondary" className="shrink-0">
                  {t("claim")}
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
