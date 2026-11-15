"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { axiosInstanceFront } from "@/lib/clients/frontend-instance";

type UserSubscription = {
  id: string;
  packageName: string;
  startDate: string;
  endDate: string;
  lastProcedureDate?: string | null;
  nextProcedureDate?: string | null;
  remainingTests: number;
  totalTests: number;
  status: string;
};

export function MySubscriptionSummary() {
  const t = useTranslations("subscriptions");
  const locale = useLocale();
  const subscription = useQuery({
    queryKey: ["my-subscriptions"],
    queryFn: async () => {
      const response = await axiosInstanceFront.get<UserSubscription[]>("/subscriptions/my");
      return response.data.find((item) => item.status === "active") ?? null;
    },
    retry: false,
  });

  if (!subscription.data) return null;

  const formatDate = (value?: string | null) =>
    value ? new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(value)) : t("notAvailable");

  return (
    <section className="content-container mt-10">
      <div className="rounded-[1.75rem] border border-primary/20 bg-primary/6 p-6 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black tracking-[0.2em] text-primary">{t("activeSubscription")}</p>
            <h2 className="mt-2 font-headline text-2xl font-black text-on-surface">
              {subscription.data.packageName}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm md:grid-cols-3">
            <div><p className="text-on-surface-variant">{t("validUntil")}</p><p className="font-bold">{formatDate(subscription.data.endDate)}</p></div>
            <div><p className="text-on-surface-variant">{t("remainingTests")}</p><p className="font-bold">{subscription.data.remainingTests} / {subscription.data.totalTests}</p></div>
            <div><p className="text-on-surface-variant">{t("nextProcedure")}</p><p className="font-bold">{formatDate(subscription.data.nextProcedureDate)}</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}
