import { useTranslations } from "next-intl";

export function PromoCard() {
  const t = useTranslations("dashboard.main");

  return (
    <div className="clinical-gradient group relative overflow-hidden rounded-2xl p-6 text-white">
      <div className="relative z-10">
        <h4 className="mb-2 text-lg font-bold font-headline">
          {t("promoTitle")}
        </h4>
        <p className="mb-4 text-xs leading-relaxed opacity-90">
          {t("promoBody")}
        </p>
        <button
          type="button"
          className="rounded-lg bg-white/20 px-4 py-2 text-xs font-bold backdrop-blur-md transition-all hover:bg-white/30"
        >
          {t("promoCta")}
        </button>
      </div>
      <span
        className="material-symbols-outlined pointer-events-none absolute -bottom-4 -right-4 text-[9rem] text-white/10 transition-transform duration-500 group-hover:scale-110"
        style={{ fontVariationSettings: "'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}
        aria-hidden
      >
        biotech
      </span>
    </div>
  );
}
