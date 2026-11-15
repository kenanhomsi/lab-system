import { getLocale, getTranslations } from "next-intl/server";
import type { SubscriptionPackageItem } from "@/components/tables/subscription-packages-table/types";
import { Icon } from "@/components/ui/icon";
import { PurchasePlanButton } from "@/components/features/subscriptions/purchase-plan-button";
import { MySubscriptionSummary } from "@/components/features/subscriptions/my-subscription-summary";
import { mapSubscriptionPackagesToPlans } from "@/lib/api/map-subscription-packages-to-plans";
import { getRequestOrigin } from "@/lib/api/request-origin";
import { BANNER_PLACEMENT } from "@/lib/banners/locations";
import { PageBannerOverflowServer, PageBannerSlotServer } from "@/components/layout/page-banner-slots-server";

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

        </div>
      </section>
      <MySubscriptionSummary />
      <PageBannerSlotServer placement={BANNER_PLACEMENT.PLANS} order={1} />

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
                  style={{
                    backgroundColor: plan.backgroundColor,
                    color: plan.textColor,
                    backgroundImage: plan.imageUrl
                      ? `linear-gradient(rgba(255,255,255,.88), rgba(255,255,255,.88)), url(${plan.imageUrl})`
                      : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
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
                    <PurchasePlanButton
                      packageId={Number(plan.key)}
                      recommended={plan.recommended}
                    />
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </section>
      <PageBannerSlotServer placement={BANNER_PLACEMENT.PLANS} order={2} />

      <PageBannerSlotServer placement={BANNER_PLACEMENT.PLANS} order={3} />
      <PageBannerOverflowServer placement={BANNER_PLACEMENT.PLANS} />
    </main>
  );
}
