import { Icon } from "@/components/ui/icon";
import { useLocale, useTranslations } from "next-intl";

export function TestCatalog() {
  const locale = useLocale();
  const t = useTranslations("dashboard.main");
  const isArabic = locale === "ar";
  const tests = isArabic
    ? [
        {
          name: "سكر الدم (صيامي)",
          ref: "المرجع: 70 - 100 mg/dL",
          tag: "كيمياء حيوية",
          price: "$12.00",
        },
        {
          name: "كرياتينين المصل",
          ref: "المرجع: 0.7 - 1.3 mg/dL",
          tag: "وظائف الكلى",
          price: "$18.00",
        },
        {
          name: "وظائف الكبد (LFT)",
          ref: "لوحة شاملة",
          tag: "كبدي",
          price: "$45.00",
        },
        {
          name: "فيتامين D (25-OH)",
          ref: "المرجع: 30 - 100 ng/mL",
          tag: "خاص",
          price: "$65.00",
        },
      ]
    : [
        {
          name: "Glucose (Fasting)",
          ref: "Ref: 70 - 100 mg/dL",
          tag: "Biochem",
          price: "$12.00",
        },
        {
          name: "Creatinine, Serum",
          ref: "Ref: 0.7 - 1.3 mg/dL",
          tag: "Renal Panel",
          price: "$18.00",
        },
        {
          name: "Liver Function (LFT)",
          ref: "Comprehensive Panel",
          tag: "Hepatic",
          price: "$45.00",
        },
        {
          name: "Vitamin D (25-OH)",
          ref: "Ref: 30 - 100 ng/mL",
          tag: "Special",
          price: "$65.00",
        },
      ];

  return (
    <section className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold font-headline">
        <Icon name="menu_book" className="text-primary" size="sm" />
        {t("catalogTitle")}
      </h2>
      <div className="relative mb-4">
        <Icon
          name="search"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400"
          size="sm"
        />
        <input
          type="search"
          placeholder={t("catalogSearch")}
          className="w-full rounded-lg border-none bg-surface-container-low py-2 pl-9 pr-3 text-xs focus:ring-1 focus:ring-primary"
          aria-label={t("catalogSearch")}
        />
      </div>
      <div className="custom-scrollbar max-h-96 space-y-4 overflow-y-auto pr-2">
        {tests.map((t) => (
          <div
            key={t.name}
            className="cursor-pointer rounded-lg bg-surface-container-low p-3 transition-colors hover:bg-surface-container-high"
          >
            <p className="text-xs font-bold text-on-surface">{t.name}</p>
            <p className="mt-1 text-[10px] text-on-surface-variant">{t.ref}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="rounded bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary">
                {t.tag}
              </span>
              <span className="text-[10px] font-bold">{t.price}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
