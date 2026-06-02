import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRequestOrigin } from "@/lib/api/request-origin";

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

async function fetchTest(id: string) {
  try {
    const origin = await getRequestOrigin();
    const url = new URL(`/api/tests/${encodeURIComponent(id)}`, origin);
    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { id, locale } = await params;
  const test = await fetchTest(id);
  if (!test) return {};
  const name = locale === "ar" ? test.nameAr : test.nameEn;
  return {
    title: `${name} | Al Mutawali Lab`,
    description: test.description?.slice(0, 160),
  };
}

export default async function TestDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const test = await fetchTest(id);
  if (!test) notFound();

  const t = await getTranslations("testDetails");
  const currentLocale = await getLocale();
  const name = currentLocale === "ar" ? test.nameAr : test.nameEn;

  return (
    <main className="bg-background py-12 md:py-20">
      <div className="content-container">
        <nav className="mb-8 flex items-center gap-2 text-sm text-on-surface-variant">
          <Link
            href="/tests"
            className="transition-colors hover:text-primary"
          >
            {t("breadcrumbTests")}
          </Link>
          <Icon name="chevron_right" size="sm" />
          <span className="font-semibold text-on-surface">{name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="font-headline text-3xl font-black tracking-tight text-on-surface md:text-4xl">
                {name}
              </h1>
              {test.category && (
                <Badge tone="default" className="mt-3">
                  {test.category}
                </Badge>
              )}
            </div>

            {test.description && (
              <Card>
                <div className="flex items-start gap-3">
                  <Icon
                    name="description"
                    filled
                    className="mt-0.5 text-primary"
                  />
                  <div>
                    <h2 className="mb-2 font-headline text-lg font-bold text-on-surface">
                      {t("descriptionTitle")}
                    </h2>
                    <p className="leading-relaxed text-on-surface-variant">
                      {test.description}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {test.normalRanges && (
              <Card>
                <div className="flex items-start gap-3">
                  <Icon
                    name="vital_signs"
                    filled
                    className="mt-0.5 text-emerald-600"
                  />
                  <div>
                    <h2 className="mb-2 font-headline text-lg font-bold text-on-surface">
                      {t("normalRanges")}
                    </h2>
                    <p className="leading-relaxed text-on-surface-variant">
                      {test.normalRanges}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {test.preparation && (
              <Card>
                <div className="flex items-start gap-3">
                  <Icon
                    name="checklist"
                    filled
                    className="mt-0.5 text-amber-600"
                  />
                  <div>
                    <h2 className="mb-2 font-headline text-lg font-bold text-on-surface">
                      {t("preparation")}
                    </h2>
                    <p className="leading-relaxed text-on-surface-variant">
                      {test.preparation}
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          <aside className="space-y-6">
            {test.price != null && (
              <Card className="text-center">
                <Icon
                  name="payments"
                  filled
                  className="mx-auto mb-2 text-primary"
                  size="lg"
                />
                <p className="text-sm text-on-surface-variant">
                  {t("price")}
                </p>
                <p className="mt-1 font-headline text-3xl font-black text-primary">
                  {test.price}{" "}
                  <span className="text-base font-normal text-on-surface-variant">
                    {t("currency")}
                  </span>
                </p>
              </Card>
            )}

            {test.requiredSample && (
              <Card>
                <div className="flex items-center gap-3">
                  <Icon name="science" filled className="text-primary" />
                  <div>
                    <p className="text-xs text-on-surface-variant">
                      {t("requiredSample")}
                    </p>
                    <p className="font-bold text-on-surface">
                      {test.requiredSample}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {test.relatedTests?.length > 0 && (
              <Card>
                <h3 className="mb-4 flex items-center gap-2 font-headline text-base font-bold text-on-surface">
                  <Icon name="link" className="text-primary" size="sm" />
                  {t("relatedTests")}
                </h3>
                <div className="space-y-2">
                  {test.relatedTests.map(
                    (rt: { id: string; nameEn: string; nameAr: string }) => (
                      <Link
                        key={rt.id}
                        href={`/tests/${rt.id}`}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
                      >
                        <Icon name="arrow_forward" size="sm" />
                        {currentLocale === "ar" ? rt.nameAr : rt.nameEn}
                      </Link>
                    ),
                  )}
                </div>
              </Card>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
