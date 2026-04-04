"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const INPUT_CLASS =
  "w-full rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20";

type AccountEntry = {
  id: string;
  patientName: string;
  tests: string[];
  pricePerTest: number[];
  totalPrice: number;
  payments: number;
};

type Summary = {
  totalTestsAmount: number;
  totalPayments: number;
  balanceDue: number;
};

export default function AccountingPage() {
  const t = useTranslations("labPages");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [entries, setEntries] = useState<AccountEntry[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData(from?: string, to?: string) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      const res = await fetch(`/api/lab/mock-lab-id/accounting?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setEntries(data.entries ?? []);
        setSummary(data.summary ?? null);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }

  function handleFilter() {
    fetchData(fromDate, toDate);
  }

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 text-center md:text-start">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-primary">
          <Icon name="account_balance" filled size="sm" />
          {t("accountingBadge")}
        </span>
        <h1 className="mt-4 font-headline text-3xl font-black tracking-tight text-on-surface md:text-4xl">
          {t("accounting")}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-on-surface-variant md:mx-0">
          {t("accountingDesc")}
        </p>
      </div>

      {/* Date filter */}
      <Card className="mb-6 shadow-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-bold text-on-surface">{t("from")}</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
          <div className="flex-1">
            <label className="mb-2 block text-sm font-bold text-on-surface">{t("to")}</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
          <Button onClick={handleFilter} className="sm:mb-0">
            <Icon name="filter_alt" size="sm" />
            {t("filter")}
          </Button>
        </div>
      </Card>

      {/* Table */}
      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Icon name="progress_activity" className="animate-spin text-primary" size="lg" />
        </div>
      ) : entries.length === 0 ? (
        <Card className="text-center shadow-md">
          <Icon name="search_off" className="mx-auto mb-3 text-on-surface-variant" size="lg" />
          <p className="text-on-surface-variant">{t("noEntries")}</p>
        </Card>
      ) : (
        <Card padding="none" className="overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant/10 bg-surface-container-low/50">
                  <th className="px-4 py-3.5 text-start font-bold text-on-surface">{t("patientName")}</th>
                  <th className="px-4 py-3.5 text-start font-bold text-on-surface">{t("tests")}</th>
                  <th className="px-4 py-3.5 text-end font-bold text-on-surface">{t("pricePerTest")}</th>
                  <th className="px-4 py-3.5 text-end font-bold text-on-surface">{t("payments")}</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="border-b border-outline-variant/5 transition-colors hover:bg-surface-container-low/30 last:border-0">
                    <td className="px-4 py-3 font-medium text-on-surface">{entry.patientName}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {entry.tests.map((test, i) => (
                          <Badge key={i} tone="default">{test}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-end">
                      <div className="space-y-0.5">
                        {entry.pricePerTest.map((price, i) => (
                          <p key={i} className="text-on-surface-variant">{price}</p>
                        ))}
                        <p className="border-t border-outline-variant/10 pt-1 font-bold text-on-surface">
                          {entry.totalPrice}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-end">
                      <span className={entry.payments >= entry.totalPrice ? "font-bold text-emerald-600" : "font-bold text-amber-600"}>
                        {entry.payments}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              {summary && (
                <tfoot>
                  <tr className="border-t-2 border-primary/20 bg-primary/5">
                    <td className="px-4 py-4 font-headline font-bold text-on-surface">{t("total")}</td>
                    <td className="px-4 py-4">
                      <span className="font-bold text-on-surface">
                        {t("totalTests")}: {summary.totalTestsAmount} {t("currency")}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-end">
                      <span className="font-bold text-emerald-600">
                        {t("totalPayments")}: {summary.totalPayments} {t("currency")}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-end">
                      <Badge tone={summary.balanceDue > 0 ? "warning" : "success"} className="text-sm">
                        {t("balanceDue")}: {summary.balanceDue} {t("currency")}
                      </Badge>
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </Card>
      )}

      {/* PDF actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="secondary" onClick={() => console.log("Upload PDF")}>
          <Icon name="upload_file" size="sm" />
          {t("uploadPDF")}
        </Button>
        <Button variant="secondary" onClick={() => console.log("Download PDF")}>
          <Icon name="download" size="sm" />
          {t("downloadPDF")}
        </Button>
      </div>
    </div>
  );
}
