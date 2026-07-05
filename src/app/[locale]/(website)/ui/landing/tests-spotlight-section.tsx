import { getLocale, getTranslations } from "next-intl/server";
import type { MedicalTestItem, MedicalTestsResponse } from "@/components/tables/medical-tests-table/types";
import type {
  MedicalTestCategory,
  MedicalTestCategoriesResponse,
} from "@/modules/medical-test-categories";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { Link } from "@/i18n/navigation";
import {
  emptyMedicalTestCategoriesResponse,
  fetchUpstreamMedicalTestCategoriesList,
  parsePublicMedicalTestCategoriesList,
} from "@/lib/api/public-medical-test-categories";
import {
  emptyMedicalTestsResponse,
  fetchUpstreamMedicalTestsList,
  parsePublicMedicalTestsList,
} from "@/lib/api/public-medical-tests";

const FEATURED_CATEGORIES_LIMIT = 5;
const FEATURED_TESTS_LIMIT = 4;

const categoryIcon = (category: string): string => {
  const value = category.trim().toLowerCase();
  if (value.includes("blood") || value.includes("hema") || value.includes("دم")) return "water_drop";
  if (value.includes("horm") || value.includes("هرم")) return "biotech";
  if (value.includes("chem") || value.includes("كيم")) return "science";
  if (value.includes("immun") || value.includes("مناع")) return "shield_with_heart";
  if (value.includes("micro") || value.includes("virus") || value.includes("فير")) return "microbiology";
  if (value.includes("sero") || value.includes("مصل")) return "bloodtype";
  return "biotech";
};

const testName = (test: MedicalTestItem, locale: string): string =>
  locale === "ar" ? test.nameAr || test.nameEn : test.nameEn || test.nameAr;

const categoryName = (test: MedicalTestItem, locale: string): string =>
  locale === "ar"
    ? test.categoryNameAr || test.categoryNameEn || test.category
    : test.categoryNameEn || test.categoryNameAr || test.category;

const categoryLabel = (category: MedicalTestCategory, locale: string): string =>
  locale === "ar"
    ? category.nameAr || category.nameEn
    : category.nameEn || category.nameAr;

async function fetchFeaturedCategories(): Promise<MedicalTestCategoriesResponse> {
  try {
    const upstream = await fetchUpstreamMedicalTestCategoriesList({
      Page: "1",
      PageSize: String(FEATURED_CATEGORIES_LIMIT),
      SortBy: "displayOrder",
      SortDesc: "false",
      activeOnly: "true",
    });

    if (!upstream.ok) {
      return emptyMedicalTestCategoriesResponse(FEATURED_CATEGORIES_LIMIT);
    }

    const response = parsePublicMedicalTestCategoriesList(upstream.payload, {
      pageNumber: 1,
      pageSize: FEATURED_CATEGORIES_LIMIT,
    });

    return {
      ...response,
      items: [...response.items]
        .sort(
          (left, right) =>
            left.displayOrder - right.displayOrder ||
            left.nameEn.localeCompare(right.nameEn) ||
            left.nameAr.localeCompare(right.nameAr),
        )
        .slice(0, FEATURED_CATEGORIES_LIMIT),
    };
  } catch {
    return emptyMedicalTestCategoriesResponse(FEATURED_CATEGORIES_LIMIT);
  }
}

async function fetchFeaturedTests(): Promise<MedicalTestsResponse> {
  try {
    const upstream = await fetchUpstreamMedicalTestsList({
      Page: "1",
      PageSize: String(FEATURED_TESTS_LIMIT),
    });

    if (!upstream.ok) {
      return emptyMedicalTestsResponse(FEATURED_TESTS_LIMIT);
    }

    const response = parsePublicMedicalTestsList(upstream.payload, {
      pageNumber: 1,
      pageSize: FEATURED_TESTS_LIMIT,
    });

    return {
      ...response,
      items: response.items.slice(0, FEATURED_TESTS_LIMIT),
    };
  } catch {
    return emptyMedicalTestsResponse(FEATURED_TESTS_LIMIT);
  }
}

/**
 * Shows a homepage preview of the medical test catalog with real featured tests.
 */
export async function TestsSpotlightSection() {
  const [tLanding, tTests, locale, categoriesResponse, testsResponse] = await Promise.all([
    getTranslations("landing.testsSpotlight"),
    getTranslations("tests"),
    getLocale(),
    fetchFeaturedCategories(),
    fetchFeaturedTests(),
  ]);

  const isAr = locale === "ar";
  const arrowIcon = isAr ? "arrow_back" : "arrow_forward";
  const categories = categoriesResponse.items;
  const tests = testsResponse.items;
  const totalCategories = categoriesResponse.totalCount;
  const totalTests = testsResponse.totalCount;

  return (
    <section className="relative overflow-hidden bg-surface py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-orb h-44 w-44 bg-primary/8 inset-s-[10%] top-[12%]" />
        <div className="bg-orb bg-orb-reverse h-56 w-56 bg-tertiary-fixed/8 inset-e-[8%] bottom-[8%]" />
      </div>

      <div className="content-container relative">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/6 px-4 py-2 text-xs font-black tracking-[0.22em] text-primary">
            <Icon name="biotech" size="sm" className="text-primary" />
            {tLanding("eyebrow")}
          </span>
          <h2 className="mt-6 font-headline text-3xl font-black tracking-tight text-on-surface md:text-5xl">
            {tLanding("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-on-surface-variant md:text-lg">
            {tLanding("description")}
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-outline-variant/15 bg-linear-to-br from-surface-container-lowest to-surface px-5 py-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon name="science" size="sm" className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-black tracking-tight text-on-surface">
                  {totalTests === 0 ? "-" : totalTests}
                </p>
                <p className="text-sm text-on-surface-variant">{tTests("statTotalTests")}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-outline-variant/15 bg-linear-to-br from-surface-container-lowest to-surface px-5 py-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon name="category" size="sm" className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-black tracking-tight text-on-surface">
                  {totalCategories === 0 ? "-" : totalCategories}
                </p>
                <p className="text-sm text-on-surface-variant">{tTests("statCategories")}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-outline-variant/15 bg-linear-to-br from-surface-container-lowest to-surface px-5 py-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon name="verified" size="sm" className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface">{tTests("statQualityTitle")}</p>
                <p className="mt-1 text-sm text-on-surface-variant">{tTests("statQualityBody")}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-[2rem] border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 border-b border-outline-variant/15 pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold tracking-[0.2em] text-primary">{tLanding("featuredLabel")}</p>
              <h3 className="mt-2 font-headline text-2xl font-black tracking-tight text-on-surface md:text-3xl">
                {tLanding("title")}
              </h3>
            </div>

            <Link
              href="/tests"
              className="clinical-gradient inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:opacity-95"
            >
              {tLanding("browseCatalog")}
              <Icon name={arrowIcon} size="sm" />
            </Link>
          </div>

          {categories.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category.id}
                  tone="default"
                  className="border border-primary/15 bg-primary-container/70 text-primary"
                >
                  {categoryLabel(category, locale)}
                </Badge>
              ))}
            </div>
          ) : null}

          {tests.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              {tests.map((test) => {
                const icon = categoryIcon(categoryName(test, locale));
                const category = categoryName(test, locale) || tTests("uncategorized");
                const name = testName(test, locale);

                return (
                  <Card
                    key={test.id}
                    className="group flex h-full flex-col border-outline-variant/15 bg-linear-to-br from-surface-container-lowest to-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    padding="lg"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <Badge
                        tone="default"
                        className="border border-primary/15 bg-primary-container/80 text-primary"
                      >
                        {category}
                      </Badge>
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                        <Icon name={icon} className="text-primary" />
                      </div>
                    </div>

                    <div className="mt-5 flex-1">
                      <h4 className="font-headline text-xl font-black tracking-tight text-on-surface">
                        {name}
                      </h4>
                      {test.sampleType ? (
                        <p className="mt-3 flex items-center gap-2 text-sm text-on-surface-variant">
                          <Icon name="science" size="sm" />
                          {test.sampleType}
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-6 flex items-end justify-between gap-4 border-t border-outline-variant/15 pt-5">
                      <div>
                        <p className="text-xs text-on-surface-variant">{tTests("price")}</p>
                        <p className="font-headline text-2xl font-black text-primary">
                          {test.price}
                          <span className="ms-1 text-sm font-semibold text-on-surface-variant">
                            {tTests("currency")}
                          </span>
                        </p>
                      </div>
                      <Link
                        href={`/tests/${test.id}`}
                        className="inline-flex items-center gap-1 rounded-xl border border-primary/20 bg-linear-to-br from-primary-container/70 to-primary/10 px-4 py-2.5 text-sm font-bold text-primary shadow-sm transition-all hover:border-primary/35 hover:from-primary-container hover:to-primary/15 hover:shadow-md hover:shadow-primary/10"
                      >
                        {tTests("details")}
                        <Icon name="arrow_forward" size="sm" />
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="mt-8 rounded-[1.75rem] border border-outline-variant/15 bg-surface p-8 text-center shadow-sm">
              <Icon name="search_off" size="lg" className="mx-auto text-on-surface-variant/50" />
              <p className="mt-4 text-on-surface-variant">{tLanding("emptyState")}</p>
            </div>
          )}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/tests"
            className="clinical-gradient inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:opacity-95"
          >
            {tLanding("browseCatalog")}
            <Icon name={arrowIcon} size="sm" />
          </Link>
        </div>
      </div>
    </section>
  );
}
