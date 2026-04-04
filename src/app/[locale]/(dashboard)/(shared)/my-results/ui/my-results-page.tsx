"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";

const INPUT_CLASS =
  "w-full rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20";

type Result = {
  id: string;
  testName: string;
  result: string;
  normalRange: string;
  unit: string;
  note: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientSex: string;
  doctorId: string;
  labId: string;
  date: string;
};

export function MyResultsPage() {
  const t = useTranslations("results");
  const { data: session } = useSession();
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [testName, setTestName] = useState("");

  const fetchResults = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();

    const user = session?.user as { role?: string; id?: string } | undefined;
    const role = user?.role;
    const userId = user?.id;

    if (role === "patient" && userId) params.set("patientId", userId);
    else if (role === "doctor" && userId) params.set("doctorId", userId);
    else if (role === "lab" && userId) params.set("labId", userId);

    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    if (testName) params.set("testName", testName);

    try {
      const res = await fetch(`/api/results?${params.toString()}`);
      const data: Result[] = await res.json();
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [session, dateFrom, dateTo, testName]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const grouped = results.reduce<Record<string, Result[]>>((acc, r) => {
    const key = `${r.patientId}-${r.date}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  function handleDownloadPDF() {
    console.log("Download PDF - placeholder");
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6 md:p-8">
      <div className="mb-8">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-primary">
          <Icon name="lab_research" filled size="sm" />
          {t("badge")}
        </span>
        <h1 className="mt-4 font-headline text-3xl font-black tracking-tight text-on-surface md:text-4xl">
          {t("title")}
        </h1>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="dateFrom" className="mb-1.5 block text-xs font-bold text-on-surface">
              {t("dateFrom")}
            </label>
            <input
              type="date"
              id="dateFrom"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label htmlFor="dateTo" className="mb-1.5 block text-xs font-bold text-on-surface">
              {t("dateTo")}
            </label>
            <input
              type="date"
              id="dateTo"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <label htmlFor="testSearch" className="mb-1.5 block text-xs font-bold text-on-surface">
              {t("testName")}
            </label>
            <div className="relative">
              <Icon
                name="search"
                size="sm"
                className="absolute inset-s-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50"
              />
              <input
                type="text"
                id="testSearch"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className={`${INPUT_CLASS} ps-9`}
              />
            </div>
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm font-bold text-primary transition-all hover:bg-primary/10"
            >
              <Icon name="picture_as_pdf" size="sm" />
              {t("downloadPDF")}
            </button>
          </div>
        </div>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Icon name="progress_activity" className="animate-spin text-primary" size="lg" />
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <Card className="py-12 text-center">
          <Icon name="search_off" className="mx-auto mb-3 text-on-surface-variant/40" size="lg" />
          <p className="text-on-surface-variant">{t("noResults")}</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([key, items]) => {
            const first = items[0];
            return (
              <Card key={key} padding="none" className="overflow-hidden">
                {/* Patient Header */}
                <div className="flex flex-wrap items-center gap-4 border-b border-outline-variant/10 bg-surface-container/50 px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Icon name="person" filled size="sm" className="text-primary" />
                    <span className="text-sm font-bold text-on-surface">{first.patientName}</span>
                  </div>
                  <span className="text-xs text-on-surface-variant">
                    {t("age")}: {first.patientAge}
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    {t("sex")}: {first.patientSex === "male" ? t("male") : t("female")}
                  </span>
                  <span className="ms-auto text-xs text-on-surface-variant">
                    <Icon name="calendar_today" size="sm" className="me-1 align-middle" />
                    {first.date}
                  </span>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-start text-sm">
                    <thead>
                      <tr className="border-b border-outline-variant/10 bg-surface-container/30 text-xs font-bold text-on-surface-variant">
                        <th className="px-6 py-3 text-start">{t("test")}</th>
                        <th className="px-6 py-3 text-start">{t("result")}</th>
                        <th className="px-6 py-3 text-start">{t("normalRange")}</th>
                        <th className="px-6 py-3 text-start">{t("unit")}</th>
                        <th className="px-6 py-3 text-start">{t("note")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((r) => (
                        <tr
                          key={r.id}
                          className="border-b border-outline-variant/5 transition-colors hover:bg-surface-container/20"
                        >
                          <td className="px-6 py-3 font-medium text-on-surface">{r.testName}</td>
                          <td className="px-6 py-3 font-bold text-primary">{r.result}</td>
                          <td className="px-6 py-3 text-on-surface-variant">{r.normalRange}</td>
                          <td className="px-6 py-3 text-on-surface-variant">{r.unit}</td>
                          <td className="px-6 py-3 text-on-surface-variant">{r.note || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
