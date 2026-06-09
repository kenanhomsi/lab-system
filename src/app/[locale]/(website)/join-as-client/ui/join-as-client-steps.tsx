import { getTranslations } from "next-intl/server";
import { Icon } from "@/components/ui/icon";

const STEP_ICONS = ["edit_note", "fact_check", "rocket_launch"] as const;

/**
 * Three-step partnership process overview.
 */
export async function JoinAsClientStepsSection() {
  const t = await getTranslations("joinAsClient.steps");

  const items = [1, 2, 3] as const;

  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 bg-background py-14 md:py-20"
    >
      <div className="content-container">
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-tertiary-fixed px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-on-tertiary-fixed">
            <Icon name="route" filled size="sm" />
            {t("eyebrow")}
          </span>
          <h2 className="mt-3 font-headline text-3xl font-black tracking-tight text-on-surface md:text-4xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-on-surface-variant">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((n, index) => (
            <div
              key={n}
              className="relative rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg"
            >
              <span className="absolute -top-3 start-6 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-black text-on-primary shadow-md">
                {n}
              </span>
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/12 to-secondary/8 text-primary">
                <Icon name={STEP_ICONS[index]} size="md" />
              </div>
              <h3 className="font-headline text-lg font-bold text-on-surface">
                {t(`step${n}Title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                {t(`step${n}Body`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
