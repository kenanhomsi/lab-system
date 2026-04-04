"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";

const INPUT_CLASS =
  "w-full rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20";

export function InsuranceRequestPage() {
  const t = useTranslations("insurance");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const body = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/insurance-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
      }
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6 md:p-8">
      <div className="mb-8 text-center">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-primary">
          <Icon name="shield" filled size="sm" />
          {t("badge")}
        </span>
        <h1 className="mt-4 font-headline text-3xl font-black tracking-tight text-on-surface md:text-4xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base text-on-surface-variant">
          {t("description")}
        </p>
      </div>

      {success ? (
        <Card className="mx-auto max-w-lg text-center">
          <Icon
            name="check_circle"
            filled
            className="mx-auto mb-4 text-emerald-500"
            size="lg"
          />
          <h3 className="font-headline text-xl font-bold text-on-surface">
            {t("successTitle")}
          </h3>
          <p className="mt-2 text-on-surface-variant">
            تم إرسال طلب التأمين بنجاح، سيتم التواصل معكم قريباً
          </p>
        </Card>
      ) : (
        <Card className="shadow-xl" padding="lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="insuredName" className="mb-2 block text-sm font-bold text-on-surface">
                  {t("insuredName")}
                </label>
                <input
                  type="text"
                  id="insuredName"
                  name="insuredName"
                  required
                  placeholder={t("insuredNamePlaceholder")}
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label htmlFor="insuranceNumber" className="mb-2 block text-sm font-bold text-on-surface">
                  {t("insuranceNumber")}
                </label>
                <input
                  type="text"
                  id="insuranceNumber"
                  name="insuranceNumber"
                  required
                  placeholder={t("insuranceNumberPlaceholder")}
                  className={INPUT_CLASS}
                />
              </div>
            </div>

            <div>
              <label htmlFor="mobile" className="mb-2 block text-sm font-bold text-on-surface">
                {t("mobile")}
              </label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                required
                placeholder={t("mobilePlaceholder")}
                className={INPUT_CLASS}
              />
            </div>

            <div>
              <label htmlFor="cardImage" className="mb-2 block text-sm font-bold text-on-surface">
                {t("cardImage")}
              </label>
              <input
                type="file"
                id="cardImage"
                name="cardImage"
                accept="image/*"
                required
                className="w-full rounded-xl border border-dashed border-outline-variant/50 bg-surface px-4 py-4 text-sm text-on-surface file:me-4 file:rounded-lg file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-xs file:font-bold file:text-primary"
              />
              <p className="mt-1 text-xs text-on-surface-variant">
                {t("cardImageHint")}
              </p>
            </div>

            <div>
              <label htmlFor="prescriptionImage" className="mb-2 block text-sm font-bold text-on-surface">
                {t("prescriptionImage")}
              </label>
              <input
                type="file"
                id="prescriptionImage"
                name="prescriptionImage"
                accept="image/*"
                className="w-full rounded-xl border border-dashed border-outline-variant/50 bg-surface px-4 py-4 text-sm text-on-surface file:me-4 file:rounded-lg file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-xs file:font-bold file:text-primary"
              />
              <p className="mt-1 text-xs text-on-surface-variant">
                {t("prescriptionImageHint")}
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="clinical-gradient w-full rounded-xl px-8 py-4 text-sm font-bold tracking-widest text-on-primary shadow-lg shadow-primary/20 transition-all hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <Icon name="progress_activity" className="animate-spin" size="sm" />
                  {t("submitting")}
                </span>
              ) : (
                t("submit")
              )}
            </button>
          </form>
        </Card>
      )}
    </div>
  );
}
