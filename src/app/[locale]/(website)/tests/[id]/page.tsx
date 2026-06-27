import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { MedicalTestItem } from "@/components/tables/medical-tests-table/types";
import { getRequestOrigin } from "@/lib/api/request-origin";
import { OrderTestRequestButton } from "./order-test-request-button";

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

async function fetchTest(id: string): Promise<MedicalTestItem | null> {
  try {
    const origin = await getRequestOrigin();
    const url = new URL(`/api/website/medical-tests/${encodeURIComponent(id)}`, origin);
    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return (await res.json()) as MedicalTestItem;
  } catch {
    return null;
  }
}

const categoryName = (test: MedicalTestItem, locale: string): string =>
  locale === "ar"
    ? test.categoryNameAr || test.categoryNameEn || test.category
    : test.categoryNameEn || test.categoryNameAr || test.category;

export async function generateMetadata({ params }: PageProps) {
  const { id, locale } = await params;
  const test = await fetchTest(id);
  if (!test) return {};
  const name = locale === "ar" ? test.nameAr : test.nameEn;
  const category = categoryName(test, locale);
  return {
    title: `${name} | Al Mutawali Lab`,
    description: `${category} - ${test.sampleType}`,
  };
}

export default async function TestDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const test = await fetchTest(id);
  if (!test) notFound();

  const t = await getTranslations("testDetails");
  const currentLocale = await getLocale();
  const numberFormatter = new Intl.NumberFormat(currentLocale);
  const name = currentLocale === "ar" ? test.nameAr : test.nameEn;
  const category = categoryName(test, currentLocale);

  return (
    <main className="bg-linear-to-b from-surface via-surface to-surface-container-low py-12 md:py-20">
      <div className="content-container">
        <nav className="mb-8 flex items-center gap-2 text-sm text-on-surface-variant">
          <Link href="/tests" className="transition-colors hover:text-primary">
            {t("breadcrumbTests")}
          </Link>
          <Icon name="chevron_right" size="sm" />
          <span className="font-semibold text-on-surface">{name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="rounded-[2rem] border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="font-headline text-3xl font-black tracking-tight text-on-surface md:text-4xl">
                    {name}
                  </h1>
                  {category ? (
                    <Badge tone="default" className="mt-4">
                      {category}
                    </Badge>
                  ) : null}
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon name="biotech" size="lg" className="text-primary" />
                </div>
              </div>
            </div>

            <Card>
              <div className="flex items-start gap-3">
                <Icon name="info" filled className="mt-0.5 text-primary" />
                <div>
                  <h2 className="mb-2 font-headline text-lg font-bold text-on-surface">
                    {t("overviewTitle")}
                  </h2>
                  <p className="leading-relaxed text-on-surface-variant">
                    {t("overviewBody", {
                      category: category || t("uncategorized"),
                      sample: test.sampleType || t("sampleUnavailable"),
                    })}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card className="text-center">
              <Icon name="payments" filled className="mx-auto mb-2 text-primary" size="lg" />
              <p className="text-sm text-on-surface-variant">{t("price")}</p>
              <p className="mt-1 font-headline text-3xl font-black text-primary">
                {numberFormatter.format(test.price)}{" "}
                <span className="text-base font-normal text-on-surface-variant">
                  {t("currency")}
                </span>
              </p>
            </Card>

            {test.sampleType ? (
              <Card>
                <div className="flex items-center gap-3">
                  <Icon name="science" filled className="text-primary" />
                  <div>
                    <p className="text-xs text-on-surface-variant">{t("requiredSample")}</p>
                    <p className="font-bold text-on-surface">{test.sampleType}</p>
                  </div>
                </div>
              </Card>
            ) : null}

            <Card>
              <div className="space-y-4">
                <h3 className="font-headline text-base font-bold text-on-surface">
                  {t("nextStepsTitle")}
                </h3>
                <p className="text-sm leading-7 text-on-surface-variant">
                  {t("nextStepsBody")}
                </p>
                <OrderTestRequestButton
                  locale={currentLocale}
                  testId={test.id}
                  label={t("orderCta")}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl clinical-gradient px-6 py-2.5 font-headline text-sm font-semibold text-on-primary-container shadow-lg shadow-primary/20 transition-all hover:opacity-95 disabled:cursor-wait disabled:opacity-70"
                />
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
