import { Badge } from "@/components/ui/badge";
import { useLocale, useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";

type ResultRow = {
  initials: string;
  name: string;
  id: string;
  test: string;
  status: "critical" | "normal" | "pending";
};

function StatusBadge({
  status,
  t,
}: {
  status: "critical" | "normal" | "pending";
  t: (key: "critical" | "normal" | "pending") => string;
}) {
  if (status === "critical") {
    return (
      <Badge tone="critical" className="gap-1">
        <Icon name="warning" filled size="sm" className="!text-sm" />
        {t("critical")}
      </Badge>
    );
  }
  if (status === "normal") {
    return <Badge tone="success">{t("normal")}</Badge>;
  }
  return <Badge tone="muted">{t("pending")}</Badge>;
}

export function PatientResultsTable() {
  const locale = useLocale();
  const t = useTranslations("dashboard.main");
  const rows: ResultRow[] =
    locale === "ar"
      ? [
          {
            initials: "JD",
            name: "جون دو",
            id: "#44920",
            test: "لوحة الدهون الكاملة",
            status: "critical",
          },
          {
            initials: "SM",
            name: "سارة ميلر",
            id: "#44921",
            test: "الهيموغلوبين السكري HbA1c",
            status: "normal",
          },
          {
            initials: "RK",
            name: "روبرت كينغ",
            id: "#44925",
            test: "لوحة الغدة الدرقية (TSH, T3, T4)",
            status: "pending",
          },
          {
            initials: "AW",
            name: "أليس وونغ",
            id: "#44930",
            test: "تعداد دم كامل",
            status: "critical",
          },
        ]
      : [
          {
            initials: "JD",
            name: "John Doe",
            id: "#44920",
            test: "Full Lipid Profile",
            status: "critical",
          },
          {
            initials: "SM",
            name: "Sarah Miller",
            id: "#44921",
            test: "HbA1c Glycated Hemoglobin",
            status: "normal",
          },
          {
            initials: "RK",
            name: "Robert King",
            id: "#44925",
            test: "Thyroid Panel (TSH, T3, T4)",
            status: "pending",
          },
          {
            initials: "AW",
            name: "Alice Wong",
            id: "#44930",
            test: "Complete Blood Count",
            status: "critical",
          },
        ];

  return (
    <section className="overflow-hidden rounded-xl border border-outline-variant/10 bg-surface-container-lowest shadow-sm">
      <div className="flex items-center justify-between border-b border-surface-container-low px-6 py-5">
        <h2 className="flex items-center gap-2 text-lg font-bold font-headline">
          <Icon name="lab_research" className="text-primary" size="sm" />
          {t("feedTitle")}
        </h2>
        <button
          type="button"
          className="text-xs font-semibold text-primary hover:underline"
        >
          {t("viewAll")}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-surface-container-low">
              <th className="px-6 py-3 text-[0.6875rem] font-bold uppercase tracking-wider text-secondary">
                {t("colPatient")}
              </th>
              <th className="px-6 py-3 text-[0.6875rem] font-bold uppercase tracking-wider text-secondary">
                {t("colTest")}
              </th>
              <th className="px-6 py-3 text-[0.6875rem] font-bold uppercase tracking-wider text-secondary">
                {t("colStatus")}
              </th>
              <th className="px-6 py-3 text-right text-[0.6875rem] font-bold uppercase tracking-wider text-secondary">
                {t("colActions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-low">
            {rows.map((r) => (
              <tr
                key={r.id}
                className="group transition-colors hover:bg-surface-container-low"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold dark:bg-slate-800">
                      {r.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-on-surface">
                        {r.name}
                      </p>
                      <p className="text-[10px] text-on-surface-variant">
                        ID: {r.id}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-on-surface-variant">
                  {r.test}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={r.status} t={t} />
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    type="button"
                    className="rounded-lg bg-primary px-3 py-1.5 text-[10px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    {t("notify")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
