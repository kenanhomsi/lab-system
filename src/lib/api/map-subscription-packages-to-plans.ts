import type { SubscriptionPackageItem } from "@/components/tables/subscription-packages-table/types";

const PLAN_ICONS = ["health_and_safety", "workspace_premium", "diamond"] as const;

export type PlanCard = {
  key: string;
  title: string;
  desc: string;
  price: number;
  features: string[];
  icon: string;
  eyebrow: string;
  pricePeriodLabel: string;
  recommended?: boolean;
};

type MapPlansParams = {
  packages: SubscriptionPackageItem[];
  t: (key: string) => string;
  locale: string;
};

function formatPlanDescription(
  pkg: SubscriptionPackageItem,
  locale: string,
): string {
  const days = pkg.validityDays;
  if (locale.startsWith("ar")) {
    return days <= 31
      ? `اشتراك شهري — صلاحية ${days} يوم`
      : `اشتراك سنوي — صلاحية ${days} يوم`;
  }
  return days <= 31
    ? `Monthly plan — ${days} days validity`
    : `Annual plan — ${days} days validity`;
}

export function mapSubscriptionPackagesToPlans({
  packages,
  t,
  locale,
}: MapPlansParams): PlanCard[] {
  const sorted = [...packages].sort((a, b) => a.price - b.price);
  const recommendedIndex =
    sorted.length >= 3 ? 1 : Math.max(0, Math.floor((sorted.length - 1) / 2));

  return sorted.map((pkg, index) => {
    const features = pkg.includedTests
      .split(",")
      .map((feature) => feature.trim())
      .filter(Boolean);

    const isMonthly = pkg.validityDays <= 31;
    const eyebrow = isMonthly ? t("monthly") : t("yearly");
    const pricePeriodLabel = isMonthly ? t("perMonth") : t("yearly");

    return {
      key: String(pkg.id),
      title: pkg.name,
      desc: formatPlanDescription(pkg, locale),
      price: pkg.price,
      features,
      icon: PLAN_ICONS[index] ?? PLAN_ICONS[PLAN_ICONS.length - 1],
      eyebrow,
      pricePeriodLabel,
      recommended: index === recommendedIndex,
    };
  });
}
