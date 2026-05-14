"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useOffersFeatureStore } from "../store-context";
import { PageBanner } from "@/components/layout/page-banner";

export function OffersPage() {
  const t = useTranslations("offers");
  const offers = useOffersFeatureStore((s) => s.offers);
  const locale = useOffersFeatureStore((s) => s.locale);

  return (
    <main className="bg-background py-12 md:py-20">
      <div className="mx-auto max-w-screen-2xl px-6 md:px-8">
        <div className="mb-12 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-tertiary-fixed px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-on-tertiary-fixed">
            <Icon name="local_offer" filled size="sm" />
            {t("badge")}
          </span>
          <h1 className="mt-4 font-headline text-4xl font-black tracking-tight text-on-surface md:text-5xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-on-surface-variant">
            {t("description")}
          </p>
        </div>

        <PageBanner />

        {offers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Icon
              name="loyalty"
              className="mb-4 text-on-surface-variant/40"
              size="lg"
            />
            <p className="text-on-surface-variant">{t("noOffers")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer) => (
              <Link key={offer.id} href={`/offers/${offer.id}`}>
                <Card
                  padding="none"
                  className="group h-full overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-video bg-surface-container-high">
                    {offer.image ? (
                      <img
                        src={offer.image}
                        alt={offer.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
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
                        className="absolute inset-e-3 top-3 shadow-lg"
                      >
                        {offer.discountPercent}% {t("off")}
                      </Badge>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="font-headline text-lg font-bold text-on-surface group-hover:text-primary">
                      {offer.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-on-surface-variant">
                      {offer.description}
                    </p>

                    <div className="mt-4 flex items-end gap-3">
                      <span className="font-headline text-2xl font-black text-primary">
                        {offer.discountedPrice}{" "}
                        <span className="text-sm font-normal text-on-surface-variant">
                          {t("currency")}
                        </span>
                      </span>
                      {offer.originalPrice > offer.discountedPrice && (
                        <span className="text-sm text-on-surface-variant line-through">
                          {offer.originalPrice} {t("currency")}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex items-center gap-1.5 text-xs text-on-surface-variant">
                      <Icon name="schedule" size="sm" />
                      {t("validUntil")}{" "}
                      {new Date(offer.expiryDate).toLocaleDateString(
                        locale === "ar" ? "ar-EG" : "en-US",
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
