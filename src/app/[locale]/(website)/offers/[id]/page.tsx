import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

async function fetchOffer(id: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/offers/${id}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const offer = await fetchOffer(id);
  if (!offer) return {};
  return {
    title: `${offer.name} | Al Mutawali Lab`,
    description: offer.description?.slice(0, 160),
  };
}

export default async function OfferDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const offer = await fetchOffer(id);
  if (!offer) notFound();

  const t = await getTranslations("offerDetails");
  const locale = await getLocale();

  const savings = offer.originalPrice - offer.discountedPrice;

  return (
    <main className="bg-background py-12 md:py-20">
      <div className="mx-auto max-w-screen-2xl px-6 md:px-8">
        <nav className="mb-8 flex items-center gap-2 text-sm text-on-surface-variant">
          <Link
            href="/offers"
            className="transition-colors hover:text-primary"
          >
            {t("breadcrumbOffers")}
          </Link>
          <Icon name="chevron_right" size="sm" />
          <span className="font-semibold text-on-surface">{offer.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="relative mb-8 overflow-hidden rounded-2xl bg-surface-container-high">
              {offer.image ? (
                <img
                  src={offer.image}
                  alt={offer.name}
                  className="aspect-video w-full object-cover"
                />
              ) : (
                <div className="flex aspect-video items-center justify-center">
                  <Icon
                    name="local_offer"
                    filled
                    className="text-on-surface-variant/20"
                    size="lg"
                  />
                </div>
              )}
              {offer.discountPercent > 0 && (
                <Badge
                  tone="critical"
                  className="absolute inset-e-4 top-4 text-sm shadow-lg"
                >
                  {offer.discountPercent}% {t("off")}
                </Badge>
              )}
            </div>

            <h1 className="mb-4 font-headline text-3xl font-black tracking-tight text-on-surface md:text-4xl">
              {offer.name}
            </h1>

            <p className="leading-relaxed text-on-surface-variant">
              {offer.description}
            </p>

            {offer.details && (
              <Card className="mt-8">
                <h2 className="mb-3 font-headline text-lg font-bold text-on-surface">
                  {t("fullDescription")}
                </h2>
                <p className="leading-relaxed text-on-surface-variant">
                  {offer.details}
                </p>
              </Card>
            )}

            {offer.includedTests?.length > 0 && (
              <Card className="mt-6">
                <h2 className="mb-4 font-headline text-lg font-bold text-on-surface">
                  {t("includedTests")}
                </h2>
                <ul className="space-y-2">
                  {offer.includedTests.map(
                    (test: { name: string }, i: number) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-on-surface-variant"
                      >
                        <Icon
                          name="check_circle"
                          filled
                          className="text-emerald-500"
                          size="sm"
                        />
                        {test.name}
                      </li>
                    ),
                  )}
                </ul>
              </Card>
            )}
          </div>

          <aside className="space-y-6">
            <Card className="text-center">
              <p className="mb-1 text-sm text-on-surface-variant">
                {t("price")}
              </p>
              <p className="font-headline text-4xl font-black text-primary">
                {offer.discountedPrice}{" "}
                <span className="text-base font-normal text-on-surface-variant">
                  {t("currency")}
                </span>
              </p>
              {savings > 0 && (
                <>
                  <p className="mt-1 text-sm text-on-surface-variant line-through">
                    {offer.originalPrice} {t("currency")}
                  </p>
                  <Badge tone="success" className="mt-3">
                    <Icon name="savings" size="sm" />
                    {t("youSave")} {savings} {t("currency")}
                  </Badge>
                </>
              )}

              <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-on-surface-variant">
                <Icon name="schedule" size="sm" />
                {t("validUntil")}{" "}
                {new Date(offer.expiryDate).toLocaleDateString(
                  locale === "ar" ? "ar-EG" : "en-US",
                )}
              </div>
            </Card>

            <Link
              href="/contact"
              className="clinical-gradient flex w-full items-center justify-center gap-2 rounded-xl px-8 py-4 text-sm font-bold tracking-widest text-on-primary shadow-lg shadow-primary/20 transition-all hover:opacity-95 active:scale-[0.98]"
            >
              <Icon name="calendar_month" size="sm" />
              {t("bookNow")}
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
