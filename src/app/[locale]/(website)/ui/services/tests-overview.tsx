import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/icon";
import { AnimatedNumber } from "./animated-number";

export async function TestsOverview() {
  const t = await getTranslations("servicesPage.tests");
  const testCategories = [
    { icon: "microbiology" as const, name: t("catViral") },
    { icon: "bloodtype" as const, name: t("catSero") },
    { icon: "shield_with_heart" as const, name: t("catImmune") },
    { icon: "water_drop" as const, name: t("catBlood") },
    { icon: "science" as const, name: t("catChem") },
    { icon: "biotech" as const, name: t("catHormone") },
  ];

  return (
    <section
      id="tests-catalog"
      className="bg-surface py-16 md:py-24 scroll-mt-24"
    >
      <div className="content-container">
        <div
          className="reveal-up mb-16 text-center"
          style={{ animationDelay: "80ms" }}
        >
          <span className="text-xs font-black tracking-[0.4em] text-tertiary">
            {t("eyebrow")}
          </span>
          <h2 className="mt-4 font-headline text-4xl font-black md:text-5xl">
            {t("titleBefore")}{" "}
            <span className="text-primary">
              <AnimatedNumber
                value={parseInt(t("titleHighlight"), 10) || 1000}
              />
            </span>{" "}
            {t("titleAfter")}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-on-surface-variant">
            {t("description")}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
          {testCategories.map((cat, i) => (
            <div
              key={cat.name}
              className="reveal-up group flex flex-col items-center gap-4 rounded-3xl border border-outline-variant/30 bg-surface-container-lowest p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:border-primary/20"
              style={{ animationDelay: `${160 + i * 60}ms` }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                <Icon name={cat.icon} className="text-3xl text-primary" />
              </div>
              <h4 className="text-center text-sm font-bold">{cat.name}</h4>
            </div>
          ))}
        </div>
        <div
          className="reveal-up mt-16 text-center"
          style={{ animationDelay: "520ms" }}
        >
          <div className="inline-flex flex-col items-center gap-6">
            <div className="inline-flex items-center gap-4 rounded-3xl border border-outline-variant/30 bg-surface-container-lowest px-8 py-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                <Icon name="experiment" className="text-2xl text-primary" />
              </div>
              <div className="text-start">
                <p className="text-xs font-bold tracking-widest text-on-surface-variant">
                  {t("programsLabel")}
                </p>
                <p className="mt-1 text-sm text-on-surface-variant">
                  {t("programsBody")}
                </p>
              </div>
            </div>
            <Link
              href="/tests"
              className="inline-flex items-center gap-2 text-white rounded-xl clinical-gradient px-6 py-3 font-headline text-sm font-semibold  shadow-lg shadow-primary/20 transition-all hover:opacity-95"
            >
              {t("browseCatalog")}
              <Icon name="arrow_forward" size="sm" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
