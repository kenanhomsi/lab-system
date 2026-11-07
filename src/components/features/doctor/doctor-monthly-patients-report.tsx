"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { axiosInstanceFront } from "@/lib/clients/frontend-instance";
import { useSyncedSessionUser } from "@/stores/use-synced-session-user";

type PatientReportRow = { id: string; patientName: string; date: string; amount: number };
type PatientReport = { patients: PatientReportRow[]; totalAmount: number };

const currentMonth = () => new Date().toISOString().slice(0, 7);

export function DoctorMonthlyPatientsReport() {
  const t = useTranslations("doctorPatientReport");
  const locale = useLocale();
  const { user } = useSyncedSessionUser();
  const [month, setMonth] = useState(currentMonth);
  const range = useMemo(() => {
    const [year, monthNumber] = month.split("-").map(Number);
    return {
      from: `${month}-01`,
      to: new Date(Date.UTC(year, monthNumber, 0)).toISOString().slice(0, 10),
    };
  }, [month]);

  const report = useQuery({
    queryKey: ["doctor-monthly-patients", user?.id, range.from, range.to],
    queryFn: async () => {
      const response = await axiosInstanceFront.get<PatientReport>(
        `/doctors/${encodeURIComponent(user!.id)}/patients`,
        { params: range },
      );
      return response.data;
    },
    enabled: Boolean(user?.id),
  });

  const money = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });

  return (
    <main className="mx-auto w-full max-w-6xl p-4 md:p-8">
      <header className="mb-6 flex flex-col gap-4 print:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold text-primary">{t("eyebrow")}</p>
          <h1 className="mt-1 font-headline text-3xl font-black text-on-surface">{t("title")}</h1>
          <p className="mt-2 text-sm text-on-surface-variant">{t("subtitle")}</p>
        </div>
        <div className="flex items-end gap-3 print:hidden">
          <label className="text-sm font-bold text-on-surface">
            {t("month")}
            <input
              type="month"
              value={month}
              onChange={(event) => setMonth(event.currentTarget.value || currentMonth())}
              className="mt-1 block rounded-xl border border-outline-variant bg-surface px-3 py-2"
            />
          </label>
          <button
            type="button"
            onClick={() => window.print()}
            disabled={!report.data?.patients.length}
            className="rounded-xl bg-primary px-5 py-2.5 font-bold text-on-primary disabled:opacity-50"
          >
            {t("savePdf")}
          </button>
        </div>
      </header>

      <section className="overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface shadow-sm print:shadow-none">
        {report.isPending ? <p className="p-8 text-center">{t("loading")}</p> : null}
        {report.isError ? <p className="p-8 text-center text-red-600">{t("error")}</p> : null}
        {report.data && report.data.patients.length === 0 ? (
          <p className="p-8 text-center text-on-surface-variant">{t("empty")}</p>
        ) : null}
        {report.data?.patients.length ? (
          <table className="w-full border-collapse text-sm">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="p-4 text-start">{t("patient")}</th>
                <th className="p-4 text-start">{t("date")}</th>
                <th className="p-4 text-start">{t("amount")}</th>
              </tr>
            </thead>
            <tbody>
              {report.data.patients.map((row) => (
                <tr key={row.id} className="border-t border-outline-variant/20">
                  <td className="p-4 font-semibold">{row.patientName}</td>
                  <td className="p-4">{row.date}</td>
                  <td className="p-4">{money.format(row.amount)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-outline-variant bg-surface-container-low font-black">
              <tr>
                <td className="p-4" colSpan={2}>{t("total")}</td>
                <td className="p-4">{money.format(report.data.totalAmount)}</td>
              </tr>
            </tfoot>
          </table>
        ) : null}
      </section>
    </main>
  );
}
