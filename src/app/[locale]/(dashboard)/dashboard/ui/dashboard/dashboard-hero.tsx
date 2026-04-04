"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";

export function DashboardHero() {
  const t = useTranslations("dashboard.main");

  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">
          {t("title")}
        </h1>
        <p className="mt-1 text-on-surface-variant" dir="auto">
          {t("subtitle")}
        </p>
      </div>
      <button
        type="button"
        className="clinical-gradient flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow-xl shadow-primary/10 transition-all hover:scale-[1.02] active:scale-95"
      >
        <Icon name="add_box" size="sm" />
        {t("createRequest")}
      </button>
    </div>
  );
}
