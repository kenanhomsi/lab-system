"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { frontendContainer } from "@/container";
import { slideCardModuleNames, SlideCardFrontendService } from "@/modules/slide-card";
import { Icon } from "@/components/ui/icon";
import type { SlideCardItem } from "@/types/slide-card";
import offerStyles from "@/components/dashboard/api-dashboard/offers-aside.module.scss";

const isExternalLink = (href: string) => /^https?:\/\//i.test(href);

const getFinalPrice = (price: number, discount: number) => {
  if (discount <= 0) return price;
  return Math.max(0, price - (price * discount) / 100);
};

type SlideCardsVariant = "dashboard" | "sidebar";

type SlideCardsWebsiteProps = {
  variant: SlideCardsVariant;
  initialCards?: SlideCardItem[];
};

/**
 * Renders dashboard and sidebar slide card surfaces.
 */
export function SlideCardsWebsite({
  variant,
  initialCards,
}: SlideCardsWebsiteProps) {
  const t = useTranslations("landing.slideCards");
  const locale = useLocale();
  const slideCardService = frontendContainer.get<SlideCardFrontendService>(
    slideCardModuleNames.service,
  );
  const [activeIdx, setActiveIdx] = useState(0);

  const { data, isLoading: isQueryLoading } = useQuery({
    queryKey: ["website-slide-cards"],
    queryFn: async () => slideCardService.findAllPublic({}),
    staleTime: 1000 * 60,
    enabled: initialCards === undefined,
  });

  const cards = useMemo(
    () =>
      (initialCards ?? data ?? [])
        .filter((item) => item.isActive)
        .sort((a, b) => a.displayOrder - b.displayOrder),
    [data, initialCards],
  );

  const isLoading = initialCards === undefined && isQueryLoading;

  const formatNumber = (value: number) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value);

  const formatDate = (value: string) => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" });
  };

  const safeActiveIdx = cards.length === 0 ? 0 : Math.min(activeIdx, cards.length - 1);
  const slideLabelPrefix = locale === "ar" ? "الانتقال إلى العرض" : "Go to item";

  if (!isLoading && cards.length === 0) return null;

  if (variant === "sidebar") {
    const items = isLoading ? [] : cards.slice(0, 6);
    const sidebarIdx = items.length === 0 ? 0 : Math.min(safeActiveIdx, items.length - 1);
    const activeItem = items[sidebarIdx];

    const renderOfferInner = (item: SlideCardItem) => {
      const hasDiscount = item.discount > 0;
      const finalPrice = getFinalPrice(item.price, item.discount);
      const href = item.detailPageLink || "";
      const isExternal = href ? isExternalLink(href) : false;

      const inner = (
        <div className={offerStyles.offerBox}>
          <div className={`${offerStyles.thumb} relative`}>
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              sizes="52px"
              className="object-cover"
            />
          </div>
          <div className={offerStyles.copy}>
            <p className={offerStyles.offerTitle}>{item.title}</p>
            <div className={offerStyles.prices}>
              <span className={offerStyles.priceNow}>{formatNumber(finalPrice)}</span>
              {hasDiscount ? (
                <span className={offerStyles.priceWas}>{formatNumber(item.price)}</span>
              ) : null}
            </div>
            <p className={offerStyles.expiry}>
              {t("expires")}: {formatDate(item.expiryDate)}
            </p>
          </div>
          <div className={offerStyles.offerActions}>
            {hasDiscount ? (
              <span className={offerStyles.discountBadge}>-{item.discount}%</span>
            ) : (
              <span />
            )}
            {href ? (
              <span className={offerStyles.cta}>
                {t("viewMore")}
                <Icon
                  name={locale === "ar" ? "arrow_back" : "arrow_forward"}
                  size="sm"
                  aria-hidden
                />
              </span>
            ) : null}
          </div>
        </div>
      );

      if (!href) return inner;
      if (isExternal) {
        return (
          <a href={href} target="_blank" rel="noreferrer" className="block">
            {inner}
          </a>
        );
      }
      return (
        <Link href={href} className="block">
          {inner}
        </Link>
      );
    };

    return (
      <section className={offerStyles.panel} aria-label={t("title")}>
        <div className={offerStyles.header}>
          <div className={offerStyles.headerMain}>
            <h2 className={offerStyles.title}>{t("title")}</h2>
            <p className={offerStyles.subtitle}>{t("subtitle")}</p>
          </div>
          {!isLoading ? (
            <span className={offerStyles.countBadge}>{sidebarIdx + 1}</span>
          ) : null}
          <span className={offerStyles.infoBtn} aria-hidden>
            <Icon name="info" size="sm" />
          </span>
        </div>

        {isLoading ? (
          <div className={offerStyles.skeleton} />
        ) : activeItem ? (
          renderOfferInner(activeItem)
        ) : null}

        {!isLoading && items.length > 1 ? (
          <div className={offerStyles.carousel}>
            {items.map((c, idx) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveIdx(idx)}
                aria-label={`${slideLabelPrefix} ${idx + 1}: ${c.title}`}
                aria-current={idx === sidebarIdx}
                className={`${offerStyles.dot} ${idx === sidebarIdx ? offerStyles.dotActive : ""}`}
              />
            ))}
          </div>
        ) : null}
      </section>
    );
  }

  const isCompact = variant === "dashboard";

  if (isCompact) {
    const maxItems = 4;
    const items = isLoading ? [] : cards.slice(0, maxItems);

    return (
      <section className="rounded-3xl border border-outline-variant/15 bg-surface-container-lowest/70 p-5 shadow-sm backdrop-blur-xl dark:bg-surface-container-highest/40 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="font-headline text-base font-extrabold tracking-tight text-on-surface md:text-lg">
              {t("title")}
            </h2>
            <p className="mt-1 text-xs text-on-surface-variant md:text-sm">{t("subtitle")}</p>
          </div>
          {!isLoading ? (
            <div className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-black tracking-wide text-primary">
              {cards.length}
            </div>
          ) : (
            <div className="h-6 w-12 animate-pulse rounded-full bg-surface-variant/40" />
          )}
        </div>

        <div className="mt-4 space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={`dash-skel-${idx}`}
                className="animate-pulse rounded-2xl border border-outline-variant/12 bg-surface-container-lowest p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-xl bg-surface-variant/40" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-surface-variant/40" />
                    <div className="h-3 w-1/2 rounded bg-surface-variant/40" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            items.map((item) => {
              const hasDiscount = item.discount > 0;
              const finalPrice = getFinalPrice(item.price, item.discount);
              const href = item.detailPageLink || "";
              const isExternal = href ? isExternalLink(href) : false;

              const row = (
                <div className="group flex items-center gap-3 rounded-2xl border border-outline-variant/12 bg-surface-container-lowest p-3 transition-colors hover:bg-surface-container-low">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface-variant/30">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="56px"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-extrabold tracking-tight text-on-surface">
                          {item.title}
                        </div>
                        <div className="mt-0.5 flex flex-wrap items-baseline gap-2 text-xs text-on-surface-variant">
                          <span className="font-black text-primary">{formatNumber(finalPrice)}</span>
                          {hasDiscount ? (
                            <span className="font-bold line-through">{formatNumber(item.price)}</span>
                          ) : null}
                        </div>
                      </div>
                      {hasDiscount ? (
                        <span className="shrink-0 rounded-full bg-tertiary-fixed/90 px-2.5 py-1 text-[11px] font-black tracking-wide text-on-tertiary-fixed">
                          -{item.discount}%
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-on-surface-variant">
                        {t("expires")}: {formatDate(item.expiryDate)}
                      </span>
                      {href ? (
                        <span className="inline-flex items-center gap-1 text-xs font-black text-primary">
                          {t("viewMore")}
                          <Icon
                            name={locale === "ar" ? "arrow_back" : "arrow_forward"}
                            size="sm"
                            aria-hidden
                          />
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              );

              if (!href) return <div key={item.id}>{row}</div>;
              if (isExternal) {
                return (
                  <a
                    key={item.id}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="block"
                  >
                    {row}
                  </a>
                );
              }
              return (
                <Link key={item.id} href={href} className="block">
                  {row}
                </Link>
              );
            })
          )}
        </div>
      </section>
    );
  }

  return null;
}

/**
 * Renders the sidebar offer carousel used in dashboard surfaces.
 */
export function SlideCardsSidebar({
  initialCards,
}: {
  initialCards?: SlideCardItem[];
} = {}) {
  return <SlideCardsWebsite variant="sidebar" initialCards={initialCards} />;
}
