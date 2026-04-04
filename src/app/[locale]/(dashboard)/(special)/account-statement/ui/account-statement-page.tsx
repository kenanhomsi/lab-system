"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";

type LookupItem = { id: string; labelEn: string; labelAr: string };

type PaymentRow = {
  id: string;
  date: string;
  amount: number;
  description: string;
  note: string;
};

type ExpenseRow = {
  id: string;
  date: string;
  amount: number;
  expenseType: string;
  note: string;
};

type Statement = {
  payments: PaymentRow[];
  expenses: ExpenseRow[];
  totalPayments: number;
  totalExpenses: number;
  balance: number;
};

function monthStartISO() {
  const d = new Date();
  d.setDate(1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}-01`;
}

function localISODate(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const TABLE_HEAD =
  "px-4 py-3 text-start text-xs font-bold uppercase tracking-wider text-on-surface-variant";
const TABLE_CELL = "px-4 py-3 text-sm text-on-surface";

export function AccountStatementPage() {
  const t = useTranslations("specialPages");
  const locale = useLocale();
  const [from, setFrom] = useState(monthStartISO);
  const [to, setTo] = useState(localISODate);
  const [statement, setStatement] = useState<Statement | null>(null);
  const [loading, setLoading] = useState(true);
  const [descLookup, setDescLookup] = useState<LookupItem[]>([]);
  const [expLookup, setExpLookup] = useState<LookupItem[]>([]);

  const nf = useMemo(
    () =>
      new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    [locale],
  );

  const resolveDesc = useCallback(
    (id: string) => {
      const row = descLookup.find((x) => x.id === id);
      if (!row) return id;
      return locale === "ar" ? row.labelAr : row.labelEn;
    },
    [descLookup, locale],
  );

  const resolveExp = useCallback(
    (id: string) => {
      const row = expLookup.find((x) => x.id === id);
      if (!row) return id;
      return locale === "ar" ? row.labelAr : row.labelEn;
    },
    [expLookup, locale],
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ from, to });
      const [stmtRes, dRes, eRes] = await Promise.all([
        fetch(`/api/special/statement?${qs}`),
        fetch("/api/special/lookup/descriptions"),
        fetch("/api/special/lookup/expense-types"),
      ]);
      const stmt = (await stmtRes.json()) as Statement;
      const dJson = (await dRes.json()) as { items?: LookupItem[] };
      const eJson = (await eRes.json()) as { items?: LookupItem[] };
      setStatement(stmt);
      if (dJson.items) setDescLookup(dJson.items);
      if (eJson.items) setExpLookup(eJson.items);
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => {
    void load();
  }, [load]);

  function handleExportPdf() {
    console.log("[special account-statement] PDF export placeholder", { from, to, statement });
  }

  const balancePositive = (statement?.balance ?? 0) >= 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 pb-24 pt-6 sm:p-6 md:p-8 lg:pb-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-primary">
            <Icon name="account_balance" filled size="sm" />
            {t("accountStatement")}
          </span>
          <h1 className="mt-2 font-headline text-2xl font-black tracking-tight text-on-surface sm:text-3xl md:text-4xl">
            {t("accountStatement")}
          </h1>
        </div>
        <button
          type="button"
          onClick={handleExportPdf}
          className="inline-flex items-center justify-center gap-2 self-stretch rounded-xl border border-outline-variant/40 bg-surface px-5 py-3 text-sm font-bold text-on-surface shadow-sm transition-all hover:bg-surface-container-high sm:self-auto"
        >
          <Icon name="picture_as_pdf" size="sm" />
          {t("exportPDF")}
        </button>
      </header>

      <Card padding="lg" className="shadow-md">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
          <div className="sm:col-span-1">
            <label htmlFor="from" className="mb-2 block text-xs font-bold uppercase tracking-wide text-on-surface-variant">
              {t("from")}
            </label>
            <input
              id="from"
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="sm:col-span-1">
            <label htmlFor="to" className="mb-2 block text-xs font-bold uppercase tracking-wide text-on-surface-variant">
              {t("to")}
            </label>
            <input
              id="to"
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="lg:col-span-2">
            <button
              type="button"
              onClick={() => void load()}
              disabled={loading}
              className="clinical-gradient flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:opacity-95 active:scale-[0.98] disabled:opacity-50 lg:mt-6"
            >
              {loading ? (
                <Icon name="progress_activity" className="animate-spin" size="sm" />
              ) : (
                <Icon name="filter_alt" size="sm" />
              )}
              {t("applyRange")}
            </button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card
          className="border-emerald-500/25 bg-gradient-to-br from-emerald-500/10 to-transparent"
          padding="md"
        >
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-800/80 dark:text-emerald-200/80">
            {t("totalPayments")}
          </p>
          <p className="mt-2 font-headline text-2xl font-black text-emerald-700 dark:text-emerald-300">
            {loading ? "—" : nf.format(statement?.totalPayments ?? 0)}
          </p>
        </Card>
        <Card
          className="border-rose-500/25 bg-gradient-to-br from-rose-500/10 to-transparent"
          padding="md"
        >
          <p className="text-xs font-bold uppercase tracking-wide text-rose-800/80 dark:text-rose-200/80">
            {t("totalExpenses")}
          </p>
          <p className="mt-2 font-headline text-2xl font-black text-rose-700 dark:text-rose-300">
            {loading ? "—" : nf.format(statement?.totalExpenses ?? 0)}
          </p>
        </Card>
        <Card
          className={
            balancePositive
              ? "border-sky-500/25 bg-gradient-to-br from-sky-500/10 to-transparent"
              : "border-amber-500/25 bg-gradient-to-br from-amber-500/10 to-transparent"
          }
          padding="md"
        >
          <p className="text-xs font-bold uppercase tracking-wide text-on-surface-variant">
            {t("balance")}
          </p>
          <p
            className={`mt-2 font-headline text-2xl font-black ${
              balancePositive ? "text-sky-700 dark:text-sky-300" : "text-amber-700 dark:text-amber-300"
            }`}
          >
            {loading ? "—" : nf.format(statement?.balance ?? 0)}
          </p>
        </Card>
      </div>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 font-headline text-lg font-bold text-emerald-700 dark:text-emerald-400">
          <Icon name="payments" filled size="sm" />
          {t("payments")}
        </h2>
        <Card padding="none" className="overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[32rem] border-collapse text-start">
              <thead className="border-b border-outline-variant/20 bg-emerald-500/[0.07]">
                <tr>
                  <th className={TABLE_HEAD}>{t("date")}</th>
                  <th className={TABLE_HEAD}>{t("description")}</th>
                  <th className={TABLE_HEAD}>{t("note")}</th>
                  <th className={`${TABLE_HEAD} text-end`}>{t("amount")}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-on-surface-variant">
                      {t("loading")}
                    </td>
                  </tr>
                ) : !statement?.payments.length ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-on-surface-variant">
                      {t("noPaymentsInRange")}
                    </td>
                  </tr>
                ) : (
                  statement.payments.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-outline-variant/10 odd:bg-emerald-500/[0.03] hover:bg-emerald-500/[0.06]"
                    >
                      <td className={TABLE_CELL}>{row.date}</td>
                      <td className={`${TABLE_CELL} font-medium text-emerald-800 dark:text-emerald-200`}>
                        {resolveDesc(row.description)}
                      </td>
                      <td className={`${TABLE_CELL} text-on-surface-variant`}>{row.note || "—"}</td>
                      <td className={`${TABLE_CELL} text-end font-bold text-emerald-700 dark:text-emerald-300`}>
                        {nf.format(row.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 font-headline text-lg font-bold text-rose-700 dark:text-rose-400">
          <Icon name="money_off" filled size="sm" />
          {t("expenses")}
        </h2>
        <Card padding="none" className="overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[32rem] border-collapse text-start">
              <thead className="border-b border-outline-variant/20 bg-rose-500/[0.07]">
                <tr>
                  <th className={TABLE_HEAD}>{t("date")}</th>
                  <th className={TABLE_HEAD}>{t("expenseType")}</th>
                  <th className={TABLE_HEAD}>{t("note")}</th>
                  <th className={`${TABLE_HEAD} text-end`}>{t("amount")}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-on-surface-variant">
                      {t("loading")}
                    </td>
                  </tr>
                ) : !statement?.expenses.length ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-on-surface-variant">
                      {t("noExpensesInRange")}
                    </td>
                  </tr>
                ) : (
                  statement.expenses.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-outline-variant/10 odd:bg-rose-500/[0.03] hover:bg-rose-500/[0.06]"
                    >
                      <td className={TABLE_CELL}>{row.date}</td>
                      <td className={`${TABLE_CELL} font-medium text-rose-800 dark:text-rose-200`}>
                        {resolveExp(row.expenseType)}
                      </td>
                      <td className={`${TABLE_CELL} text-on-surface-variant`}>{row.note || "—"}</td>
                      <td className={`${TABLE_CELL} text-end font-bold text-rose-700 dark:text-rose-300`}>
                        {nf.format(row.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  );
}
