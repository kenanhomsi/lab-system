import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import { getRequestOrigin } from "@/lib/api/request-origin";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

async function fetchTestBySlug(slug: string) {
  try {
    const origin = await getRequestOrigin();
    const url = new URL(`/api/tests/${encodeURIComponent(slug)}`, origin);
    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, locale } = await params;
  const test = await fetchTestBySlug(slug);
  if (!test) return {};
  const name = locale === "ar" ? test.nameAr : test.nameEn;
  return {
    title: `${name} - ${locale === "ar" ? "اعرف تحليلك" : "Lab Encyclopedia"} | Al Mutawali Lab`,
    description: test.whatIsIt?.slice(0, 160) || test.description?.slice(0, 160),
  };
}

function JsonLd({ test, locale }: { test: Record<string, unknown>; locale: string }) {
  const name = locale === "ar" ? test.nameAr : test.nameEn;
  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalTest",
    name,
    description: test.whatIsIt || test.description,
    usedToDiagnose: test.whenOrdered,
    normalRange: test.normalValues,
    relevantSpecialty: test.category,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

const SECTIONS = [
  { key: "whatIsIt", icon: "info", color: "text-primary" },
  { key: "whenOrdered", icon: "event_note", color: "text-primary" },
  { key: "normalValues", icon: "vital_signs", color: "text-emerald-600" },
  { key: "highMeaning", icon: "trending_up", color: "text-red-500" },
  { key: "lowMeaning", icon: "trending_down", color: "text-amber-600" },
] as const;

export default async function LabEncyclopediaDetailPage({
  params,
}: PageProps) {
  const { slug } = await params;
  const test = await fetchTestBySlug(slug);
  if (!test) notFound();

  const t = await getTranslations("labEncyclopediaDetail");
  const locale = await getLocale();
  const name = locale === "ar" ? test.nameAr : test.nameEn;

  return (
    <main className="bg-background py-12 md:py-20">
      <JsonLd test={test} locale={locale} />

      <div className="mx-auto max-w-screen-2xl px-6 md:px-8">
        <nav className="mb-8 flex items-center gap-2 text-sm text-on-surface-variant">
          <Link
            href="/lab-encyclopedia"
            className="transition-colors hover:text-primary"
          >
            {t("breadcrumbEncyclopedia")}
          </Link>
          <Icon name="chevron_right" size="sm" />
          <span className="font-semibold text-on-surface">{name}</span>
        </nav>

        <h1 className="mb-10 font-headline text-3xl font-black tracking-tight text-on-surface md:text-4xl">
          {name}
        </h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {SECTIONS.map(({ key, icon, color }) =>
              test[key] ? (
                <Card key={key}>
                  <div className="flex items-start gap-3">
                    <Icon name={icon} filled className={`mt-0.5 ${color}`} />
                    <div>
                      <h2 className="mb-2 font-headline text-lg font-bold text-on-surface">
                        {t(key)}
                      </h2>
                      <p className="leading-relaxed text-on-surface-variant">
                        {test[key] as string}
                      </p>
                    </div>
                  </div>
                </Card>
              ) : null,
            )}
          </div>

          <aside>
            {test.relatedTests?.length > 0 && (
              <Card>
                <h3 className="mb-4 flex items-center gap-2 font-headline text-base font-bold text-on-surface">
                  <Icon name="link" className="text-primary" size="sm" />
                  {t("relatedTests")}
                </h3>
                <div className="space-y-2">
                  {test.relatedTests.map(
                    (rt: {
                      id: string;
                      slug: string;
                      nameEn: string;
                      nameAr: string;
                    }) => (
                      <Link
                        key={rt.id}
                        href={`/lab-encyclopedia/${rt.slug || rt.id}`}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
                      >
                        <Icon name="arrow_forward" size="sm" />
                        {locale === "ar" ? rt.nameAr : rt.nameEn}
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
