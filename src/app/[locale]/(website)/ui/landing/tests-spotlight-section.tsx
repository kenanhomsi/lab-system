import { getLocale, getTranslations } from "next-intl/server";
import type {
  MedicalTestCategoriesResponse,
  MedicalTestCategory,
} from "@/modules/medical-test-categories";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Link } from "@/i18n/navigation";
import { getRequestOrigin } from "@/lib/api/request-origin";

const FEATURED_CATEGORIES_LIMIT = 3;

const categoryIcon = (category: string): string => {
  const value = category.trim().toLowerCase();
  if (value.includes("blood") || value.includes("hema") || value.includes("دمو")) return "water_drop";
  if (value.includes("horm") || value.includes("هرم")) return "biotech";
  if (value.includes("chem") || value.includes("كيم")) return "science";
  if (value.includes("immun") || value.includes("مناع")) return "shield_with_heart";
  if (value.includes("micro") || value.includes("virus") || value.includes("فير")) return "microbiology";
  if (value.includes("sero") || value.includes("مصل")) return "bloodtype";
  return "biotech";
};

const categoryLabel = (category: MedicalTestCategory, locale: string): string =>
  locale === "ar"
    ? category.nameAr || category.nameEn
    : category.nameEn || category.nameAr;

async function fetchFeaturedCategories(): Promise<MedicalTestCategory[]> {
  try {
    const origin = await getRequestOrigin();
    const url = new URL("/api/website/category-medical", origin);
    url.searchParams.set("Page", "1");
    url.searchParams.set("PageSize", String(FEATURED_CATEGORIES_LIMIT));
    url.searchParams.set("activeOnly", "true");

    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as MedicalTestCategoriesResponse;
    if (!Array.isArray(payload.items)) {
      return [];
    }

    return [...payload.items]
      .sort(
        (a, b) =>
          a.displayOrder - b.displayOrder ||
          a.nameEn.localeCompare(b.nameEn) ||
          a.nameAr.localeCompare(b.nameAr),
      )
      .slice(0, FEATURED_CATEGORIES_LIMIT);
  } catch {
    return [];
  }
}

/**
 * Shows a compact preview of featured medical test categories on the homepage.
 */
export async function TestsSpotlightSection() {
  const [t, locale] = await Promise.all([
    getTranslations("landing.testsSpotlight"),
    getLocale(),
  ]);

  const categories = await fetchFeaturedCategories();
  const isAr = locale === "ar";
  const arrowIcon = isAr ? "arrow_back" : "arrow_forward";

  return (
    <section className="relative overflow-hidden bg-surface py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-orb h-44 w-44 bg-primary/8 inset-s-[10%] top-[12%]" />
        <div className="bg-orb bg-orb-reverse h-56 w-56 bg-tertiary-fixed/8 inset-e-[8%] bottom-[8%]" />
      </div>

      <div className="content-container relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/6 px-4 py-2 text-xs font-black tracking-[0.22em] text-primary">
            <Icon name="biotech" size="sm" className="text-primary" />
            {t("eyebrow")}
          </span>
          <h2 className="mt-6 font-headline text-3xl font-black tracking-tight text-on-surface md:text-5xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-on-surface-variant md:text-lg">
            {t("description")}
          </p>
        </div>

        {categories.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {categories.map((category) => {
              const name = categoryLabel(category, locale);
              const icon = categoryIcon(`${category.nameEn} ${category.nameAr}`);

              return (
                <Card
                  key={category.id}
                  className="group relative overflow-hidden border border-outline-variant/15 bg-surface-container-lowest transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  padding="lg"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary via-tertiary to-primary/50" />
                  <div className="flex h-full flex-col gap-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                        <Icon name={icon} size="sm" className="text-primary" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-headline text-xl font-black tracking-tight text-on-surface">
                        {name}
                      </h3>
                      {category.description ? (
                        <p className="mt-3 line-clamp-2 text-sm leading-7 text-on-surface-variant">
                          {category.description}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex items-center justify-between border-t border-outline-variant/15 pt-4">
                      <span className="text-xs font-bold tracking-[0.2em] text-on-surface-variant">
                        {t("cardHint")}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="mt-12 rounded-[1.75rem] border border-outline-variant/15 bg-surface-container-lowest p-8 text-center shadow-sm">
            <Icon name="search_off" size="lg" className="mx-auto text-on-surface-variant/50" />
            <p className="mt-4 text-on-surface-variant">{t("emptyState")}</p>
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Link
            href="/tests"
            className="clinical-gradient inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:opacity-95"
          >
            {t("moreInfo")}
            <Icon name={arrowIcon} size="sm" />
          </Link>
        </div>
      </div>
    </section>
  );
}
