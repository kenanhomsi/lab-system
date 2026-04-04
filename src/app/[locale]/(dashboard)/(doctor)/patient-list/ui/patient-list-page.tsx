"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";

type PatientRow = {
  id: string;
  patientName: string;
  date: string;
  amount: number;
};

type ApiResponse = {
  patients: PatientRow[];
  totalAmount: number;
};

function defaultRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const toYmd = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return { from: toYmd(start), to: toYmd(end) };
}

export function PatientListPage() {
  const { data: session, status } = useSession();
  const locale = useLocale();
  const t = useTranslations("doctorPages");

  const [range, setRange] = useState(() => defaultRange());
  const { from, to } = range;
  const [appliedFrom, setAppliedFrom] = useState(range.from);
  const [appliedTo, setAppliedTo] = useState(range.to);
  const [showAmounts, setShowAmounts] = useState(true);
  const [rows, setRows] = useState<PatientRow[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const userId = session?.user?.id;

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (appliedFrom) params.set("from", appliedFrom);
      if (appliedTo) params.set("to", appliedTo);
      const q = params.toString();
      const res = await fetch(`/api/doctors/${encodeURIComponent(userId)}/patients${q ? `?${q}` : ""}`);
      if (!res.ok) {
        setError(t("loadError"));
        setRows([]);
        setTotalAmount(0);
        return;
      }
      const data = (await res.json()) as ApiResponse;
      setRows(Array.isArray(data.patients) ? data.patients : []);
      setTotalAmount(typeof data.totalAmount === "number" ? data.totalAmount : 0);
    } catch {
      setError(t("loadError"));
      setRows([]);
      setTotalAmount(0);
    } finally {
      setLoading(false);
    }
  }, [userId, appliedFrom, appliedTo, t]);

  function applyFilter() {
    setAppliedFrom(from);
    setAppliedTo(to);
  }

  useEffect(() => {
    if (status === "authenticated" && userId) void load();
  }, [appliedFrom, appliedTo, status, userId, load]);

  const dateFmt = new Intl.DateTimeFormat(locale === "ar" ? "ar-SY" : "en-US", {
    dateStyle: "medium",
  });

  const numFmt = new Intl.NumberFormat(locale === "ar" ? "ar-SY" : "en-US");

  function formatDate(iso: string) {
    const [y, m, d] = iso.split("-").map(Number);
    if (!y || !m || !d) return iso;
    return dateFmt.format(new Date(y, m - 1, d));
  }

  function handleDownloadPdf() {
    console.log("download pdf", { appliedFrom, appliedTo, rows, totalAmount, showAmounts });
  }

  if (status === "loading") {
    return (
      <div className="mx-auto flex min-h-[40vh] max-w-5xl items-center justify-center p-6 md:p-8">
        <Icon name="progress_activity" className="animate-spin text-primary" size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-black tracking-tight text-on-surface md:text-4xl">
            {t("patientList")}
          </h1>
          <p className="mt-1 text-sm text-on-surface-variant">{t("dateFilter")}</p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <button
            type="button"
            onClick={() => setShowAmounts((v) => !v)}
            className="inline-flex items-center gap-2 rounded-xl border border-outline-variant/40 bg-surface px-4 py-3 text-sm font-bold text-on-surface shadow-sm transition-all hover:border-primary/40 hover:bg-primary/5"
          >
            <Icon name={showAmounts ? "visibility_off" : "visibility"} size="sm" />
            {showAmounts ? t("hideAmounts") : t("showAmounts")}
          </button>
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-2 rounded-xl border border-outline-variant/40 bg-surface px-4 py-3 text-sm font-bold text-on-surface shadow-sm transition-all hover:border-primary/40 hover:bg-primary/5"
          >
            <Icon name="picture_as_pdf" size="sm" />
            {t("downloadPDF")}
          </button>
        </div>
      </div>

      <Card className="shadow-lg" padding="lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="min-w-[140px] flex-1">
            <label htmlFor="from" className="mb-2 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              {t("from")}
            </label>
            <input
              id="from"
              type="date"
              value={from}
              onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))}
              className="w-full rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="min-w-[140px] flex-1">
            <label htmlFor="to" className="mb-2 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              {t("to")}
            </label>
            <input
              id="to"
              type="date"
              value={to}
              onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))}
              className="w-full rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            type="button"
            onClick={applyFilter}
            disabled={!userId || loading}
            className="clinical-gradient inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3 text-sm font-bold tracking-widest text-on-primary shadow-lg shadow-primary/20 transition-all hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Icon name="progress_activity" className="animate-spin" size="sm" />
                {t("loading")}
              </>
            ) : (
              <>
                <Icon name="filter_alt" size="sm" />
                {t("applyFilter")}
              </>
            )}
          </button>
        </div>

        {error ? (
          <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : null}
      </Card>

      {!userId ? (
        <Card className="text-center">
          <p className="text-on-surface-variant">{t("signInRequired")}</p>
        </Card>
      ) : loading && rows.length === 0 ? (
        <div className="flex justify-center py-16">
          <Icon name="progress_activity" className="animate-spin text-primary" size="lg" />
        </div>
      ) : rows.length === 0 ? (
        <Card className="py-16 text-center shadow-md">
          <Icon name="group_off" className="mx-auto mb-4 text-on-surface-variant/40" size="lg" />
          <p className="font-medium text-on-surface-variant">{t("noPatients")}</p>
        </Card>
      ) : (
        <Card className="overflow-hidden p-0 shadow-xl" padding="none">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[320px] border-collapse text-start text-sm">
              <thead>
                <tr className="border-b border-outline-variant/20 bg-surface-container-low/80">
                  <th className="px-4 py-4 ps-6 font-headline font-bold text-on-surface">{t("patientName")}</th>
                  <th className="px-4 py-4 font-headline font-bold text-on-surface">{t("date")}</th>
                  {showAmounts ? (
                    <th className="px-4 py-4 pe-6 text-end font-headline font-bold text-on-surface">
                      {t("amount")}
                    </th>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-outline-variant/10 transition-colors hover:bg-surface-container-low/50"
                  >
                    <td className="px-4 py-3 ps-6 font-medium text-on-surface">{row.patientName}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{formatDate(row.date)}</td>
                    {showAmounts ? (
                      <td className="px-4 py-3 pe-6 text-end tabular-nums text-on-surface">
                        {numFmt.format(row.amount)} {t("currency")}
                      </td>
                    ) : null}
                  </tr>
                ))}
                <tr className="bg-primary/5">
                  <td
                    colSpan={2}
                    className="px-4 py-4 ps-6 font-headline font-bold text-on-surface"
                  >
                    {t("total")}
                  </td>
                  {showAmounts ? (
                    <td className="px-4 py-4 pe-6 text-end font-headline font-bold tabular-nums text-primary">
                      {numFmt.format(totalAmount)} {t("currency")}
                    </td>
                  ) : null}
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
