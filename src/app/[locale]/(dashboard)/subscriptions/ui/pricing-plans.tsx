"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

export function PricingPlans() {
  const t = useTranslations("subscriptions");
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <section>
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-primary">
            {t("upgradeEyebrow")}
          </span>
          <h3 className="font-headline text-2xl font-bold text-on-surface md:text-3xl">
            {t("packagesTitle")}
          </h3>
        </div>
        <div className="flex rounded-xl bg-surface-container-high p-1">
          <button
            type="button"
            onClick={() => setBilling("monthly")}
            className={cn(
              "rounded-lg px-6 py-2 text-sm font-semibold transition-all",
              billing === "monthly"
                ? "bg-surface-container-lowest shadow-sm"
                : "text-slate-500",
            )}
          >
            {t("monthly")}
          </button>
          <button
            type="button"
            onClick={() => setBilling("yearly")}
            className={cn(
              "rounded-lg px-6 py-2 text-sm font-semibold transition-all",
              billing === "yearly"
                ? "bg-surface-container-lowest shadow-sm"
                : "text-slate-500",
            )}
          >
            {t("yearly")}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="flex flex-col rounded-[2rem] border border-slate-100 bg-surface-container-lowest p-8 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800">
          <h4 className="mb-2 font-headline text-lg font-bold">{t("basicTitle")}</h4>
          <p className="mb-6 text-sm text-slate-500">
            {t("basicDesc")}
          </p>
          <div className="mb-8">
            <span className="font-headline text-4xl font-extrabold">$49</span>
            <span className="text-sm text-slate-400">{t("perMonth")}</span>
          </div>
          <ul className="mb-8 flex-1 space-y-4">
            <li className="flex items-center text-sm text-slate-600 dark:text-slate-300">
              <Icon name="check_circle" className="mr-2 text-[18px] text-primary" />
              {t("basicF1")}
            </li>
            <li className="flex items-center text-sm text-slate-600 dark:text-slate-300">
              <Icon name="check_circle" className="mr-2 text-[18px] text-primary" />
              {t("basicF2")}
            </li>
            <li className="flex items-center text-sm text-slate-600 opacity-40 line-through dark:text-slate-400">
              <Icon
                name="check_circle"
                className="mr-2 text-[18px] text-slate-300"
              />
              {t("basicF3")}
            </li>
          </ul>
          <button
            type="button"
            className="w-full rounded-xl border-2 border-primary py-3 text-sm font-bold text-primary transition-colors hover:bg-primary/5"
          >
            {t("selectPlan")}
          </button>
        </div>
        <div className="relative z-10 flex scale-100 flex-col rounded-[2rem] border-2 border-primary bg-surface-container-lowest p-8 shadow-xl md:scale-105">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-6 py-1.5 text-xs font-bold uppercase tracking-widest text-white shadow-lg">
            {t("currentSelection")}
          </div>
          <h4 className="mb-2 mt-2 font-headline text-lg font-bold">{t("goldTitle")}</h4>
          <p className="mb-6 text-sm text-slate-500">
            {t("goldDesc")}
          </p>
          <div className="mb-8">
            <span className="font-headline text-4xl font-extrabold">$129</span>
            <span className="text-sm text-slate-400">{t("perMonth")}</span>
          </div>
          <ul className="mb-8 flex-1 space-y-4">
            <li className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-300">
              <Icon
                name="check_circle"
                filled
                className="mr-2 text-[18px] text-primary"
              />
              {t("goldF1")}
            </li>
            <li className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-300">
              <Icon
                name="check_circle"
                filled
                className="mr-2 text-[18px] text-primary"
              />
              {t("goldF2")}
            </li>
            <li className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-300">
              <Icon
                name="check_circle"
                filled
                className="mr-2 text-[18px] text-primary"
              />
              {t("goldF3")}
            </li>
          </ul>
          <button
            type="button"
            disabled
            className="w-full cursor-not-allowed rounded-xl bg-primary py-3 text-sm font-bold text-white opacity-50 shadow-md"
          >
            {t("activePlan")}
          </button>
        </div>
        <div className="group relative flex flex-col overflow-hidden rounded-[2rem] bg-slate-900 p-8 text-white shadow-sm">
          <div className="absolute right-0 top-0 p-4">
            <Icon
              name="verified_user"
              className="text-[48px] text-[#FFD700] opacity-20 transition-opacity group-hover:opacity-40"
            />
          </div>
          <div className="relative z-10 flex flex-1 flex-col">
            <div className="mb-2 flex items-center space-x-2">
              <h4 className="font-headline text-lg font-bold text-white">
                {t("platinumTitle")}
              </h4>
              <span className="rounded bg-[#FFD700] px-2 py-0.5 text-[10px] font-black uppercase text-slate-900">
                {t("vip")}
              </span>
            </div>
            <p className="mb-6 text-sm text-slate-400">
              {t("platinumDesc")}
            </p>
            <div className="mb-8">
              <span className="font-headline text-4xl font-extrabold">$299</span>
              <span className="text-sm text-slate-500">{t("perMonth")}</span>
            </div>
            <ul className="mb-8 flex-1 space-y-4">
              <li className="flex items-center text-sm text-slate-300">
                <Icon
                  name="star"
                  className="mr-2 text-[18px] text-[#FFD700]"
                  size="sm"
                />
                {t("platF1")}
              </li>
              <li className="flex items-center text-sm text-slate-300">
                <Icon
                  name="star"
                  className="mr-2 text-[18px] text-[#FFD700]"
                  size="sm"
                />
                {t("platF2")}
              </li>
              <li className="flex items-center text-sm text-slate-300">
                <Icon
                  name="star"
                  className="mr-2 text-[18px] text-[#FFD700]"
                  size="sm"
                />
                {t("platF3")}
              </li>
            </ul>
            <button
              type="button"
              className="w-full rounded-xl bg-[#FFD700] py-3 text-sm font-black text-slate-900 transition-all hover:shadow-[0_0_20px_rgba(255,215,0,0.4)]"
            >
              {t("upgradeVip")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
