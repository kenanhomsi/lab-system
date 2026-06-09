import { getTranslations } from "next-intl/server";
import { Icon } from "@/components/ui/icon";

const BENEFIT_ICONS = [
  "verified_user",
  "school",
  "diversity_3",
  "health_and_safety",
] as const;

/**
 * Why-join-us strip between hero and open positions.
 */
export async function CareersBenefitsSection() {
  const t = await getTranslations("careers.benefits");

  const items = [1, 2, 3, 4] as const;

  return (
    <section className="border-y border-outline-variant/10 bg-surface-container-low py-14 md:py-16">
      <div className="content-container">
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/8 px-4 py-2 text-[10px] font-black tracking-[0.32em] text-primary uppercase">
            <Icon name="favorite" filled size="sm" />
            {t("eyebrow")}
          </span>
          <h2 className="mt-4 font-headline text-3xl font-black tracking-tight text-on-surface md:text-4xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-on-surface-variant">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((n, index) => (
            <div
              key={n}
              className="group rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/12 to-secondary/8 text-primary shadow-sm transition-transform duration-300 group-hover:scale-105">
                <Icon name={BENEFIT_ICONS[index]} filled size="md" />
              </div>
              <h3 className="font-headline text-base font-bold text-on-surface">
                {t(`item${n}Title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                {t(`item${n}Body`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
