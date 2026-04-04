"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";

const INPUT_CLASS =
  "w-full rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20";

type LookupItem = { id: string; labelEn: string; labelAr: string };

function localISODate(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function NewPaymentPage() {
  const t = useTranslations("specialPages");
  const locale = useLocale();
  const [items, setItems] = useState<LookupItem[]>([]);
  const [loadingLookups, setLoadingLookups] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [date, setDate] = useState(localISODate);

  const labelFor = useCallback(
    (row: LookupItem) => (locale === "ar" ? row.labelAr : row.labelEn),
    [locale],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/special/lookup/descriptions");
        const data = (await res.json()) as { items?: LookupItem[] };
        if (!cancelled && data.items) setItems(data.items);
      } finally {
        if (!cancelled) setLoadingLookups(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const body = {
      date: String(fd.get("date") || ""),
      amount: Number(fd.get("amount")),
      description: String(fd.get("description") || ""),
      note: String(fd.get("note") || ""),
    };

    try {
      const res = await fetch("/api/special/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setSuccess(true);
        form.reset();
        setDate(localISODate());
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-4 pb-24 pt-6 sm:p-6 md:p-8 lg:pb-8">
      <header className="text-center sm:text-start">
        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-primary">
          <Icon name="add_card" filled size="sm" />
          {t("newPayment")}
        </span>
        <h1 className="mt-3 font-headline text-2xl font-black tracking-tight text-on-surface sm:text-3xl md:text-4xl">
          {t("newPayment")}
        </h1>
      </header>

      {success ? (
        <Card className="border-emerald-500/20 bg-emerald-500/[0.06] text-center" padding="lg">
          <Icon
            name="check_circle"
            filled
            className="mx-auto mb-4 text-emerald-600 dark:text-emerald-400"
            size="lg"
          />
          <h2 className="font-headline text-xl font-bold text-on-surface">{t("paymentSaved")}</h2>
          <p className="mt-2 text-on-surface-variant">{t("paymentSavedHint")}</p>
          <button
            type="button"
            onClick={() => setSuccess(false)}
            className="clinical-gradient mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:opacity-95 active:scale-[0.98]"
          >
            <Icon name="add" size="sm" />
            {t("recordAnother")}
          </button>
        </Card>
      ) : (
        <Card className="shadow-lg shadow-primary/5" padding="lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="date" className="mb-2 block text-sm font-bold text-on-surface">
                {t("date")}
              </label>
              <input
                type="date"
                id="date"
                name="date"
                required
                value={date}
                onChange={(ev) => setDate(ev.target.value)}
                className={INPUT_CLASS}
              />
            </div>

            <div>
              <label htmlFor="amount" className="mb-2 block text-sm font-bold text-on-surface">
                {t("amount")}
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                required
                min={0}
                step="0.01"
                inputMode="decimal"
                placeholder="0.00"
                className={INPUT_CLASS}
              />
            </div>

            <div>
              <label htmlFor="description" className="mb-2 block text-sm font-bold text-on-surface">
                {t("description")}
              </label>
              <select
                id="description"
                name="description"
                required
                disabled={loadingLookups}
                className={INPUT_CLASS}
              >
                <option value="">{loadingLookups ? t("loading") : t("selectOption")}</option>
                {items.map((row) => (
                  <option key={row.id} value={row.id}>
                    {labelFor(row)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="note" className="mb-2 block text-sm font-bold text-on-surface">
                {t("note")}
              </label>
              <textarea
                id="note"
                name="note"
                rows={3}
                placeholder={t("optionalNote")}
                className={`${INPUT_CLASS} resize-y min-h-[5rem]`}
              />
            </div>

            <button
              type="submit"
              disabled={submitting || loadingLookups}
              className="clinical-gradient flex w-full items-center justify-center gap-2 rounded-xl px-8 py-4 text-sm font-bold tracking-widest text-on-primary shadow-lg shadow-primary/20 transition-all hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Icon name="progress_activity" className="animate-spin" size="sm" />
                  {t("saving")}
                </>
              ) : (
                <>
                  <Icon name="save" size="sm" />
                  {t("save")}
                </>
              )}
            </button>
          </form>
        </Card>
      )}
    </div>
  );
}
