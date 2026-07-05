"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { SectionHeader } from "@/components/ui/section-header";
import type { SlideCardItem } from "@/types/slide-card";

const isExternalLink = (href: string) => /^https?:\/\//i.test(href);

const getFinalPrice = (price: number, discount: number) => {
  if (discount <= 0) return price;
  return Math.max(0, price - (price * discount) / 100);
};

type SlideCardsWebsiteClientProps = {
  initialCards: SlideCardItem[];
};

/**
 * Public homepage slide cards — no DI container; data is server-fetched.
 */
export function SlideCardsWebsiteClient({
  initialCards,
}: SlideCardsWebsiteClientProps) {
  const t = useTranslations("landing.slideCards");
  const tServices = useTranslations("landing.services");
  const locale = useLocale();
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [favoriteIds, setFavoriteIds] = useState<ReadonlySet<number>>(
    () => new Set<number>(),
  );

  const cards = useMemo(
    () =>
      initialCards
        .filter((item) => item.isActive)
        .sort((a, b) => a.displayOrder - b.displayOrder),
    [initialCards],
  );

  const formatNumber = (value: number) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value);

  const formatDate = (value: string) => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const scrollToIndex = (idx: number) => {
    const el = itemRefs.current[idx];
    if (!el) return;
    el.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  const toggleFavorite = (id: number) => {
    setFavoriteIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const safeActiveIdx =
    cards.length === 0 ? 0 : Math.min(activeIdx, cards.length - 1);
  const canPrev = safeActiveIdx > 0;
  const canNext = safeActiveIdx < cards.length - 1;
  const slideLabelPrefix =
    locale === "ar" ? "الانتقال إلى العرض" : "Go to item";

  const favoriteLabel =
    locale === "ar" ? "إضافة للمفضلة" : "Add to favorites";
  const removeFavoriteLabel =
    locale === "ar" ? "إزالة من المفضلة" : "Remove from favorites";

  useEffect(() => {
    if (cards.length === 0) {
      itemRefs.current = [];
      return;
    }

    const root = scrollerRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        const target = visible?.target;
        if (!target) return;

        const idx = itemRefs.current.findIndex((el) => el === target);
        if (idx >= 0) setActiveIdx(idx);
      },
      { root, threshold: [0.4, 0.6, 0.8] },
    );

    for (const el of itemRefs.current) {
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [cards.length]);

  if (cards.length === 0) return null;

  const showGrid = cards.length <= 3;
  const showCarousel = !showGrid;

  const header = (
    <SectionHeader
      title={t("title")}
      description={t("subtitle")}
      action={
        showCarousel && cards.length > 1 ? (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => scrollToIndex(Math.max(0, safeActiveIdx - 1))}
              disabled={!canPrev}
              aria-label={tServices("prev")}
              className="grid h-9 w-9 place-items-center rounded-lg border border-outline-variant/20 bg-surface-container-lowest text-on-surface shadow-sm transition-opacity disabled:opacity-40"
            >
              <Icon
                name={locale === "ar" ? "arrow_forward" : "arrow_back"}
                size="sm"
              />
            </button>
            <button
              type="button"
              onClick={() =>
                scrollToIndex(Math.min(cards.length - 1, safeActiveIdx + 1))
              }
              disabled={!canNext}
              aria-label={tServices("next")}
              className="grid h-9 w-9 place-items-center rounded-lg border border-outline-variant/20 bg-surface-container-lowest text-on-surface shadow-sm transition-opacity disabled:opacity-40"
            >
              <Icon
                name={locale === "ar" ? "arrow_back" : "arrow_forward"}
                size="sm"
              />
            </button>
            <Link
              href="/offers"
              className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-primary/20 bg-primary/8 px-3.5 text-sm font-black text-primary"
            >
              {locale === "ar" ? "عرض الكل" : "View all"}
              <Icon
                name={locale === "ar" ? "arrow_back" : "arrow_forward"}
                size="sm"
                aria-hidden
              />
            </Link>
          </div>
        ) : null
      }
      className="mb-5 md:mb-6"
    />
  );

  const gridColsClass =
    cards.length <= 1
      ? "grid-cols-1 justify-items-center"
      : cards.length === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  const renderCard = (
    item: SlideCardItem,
    idx: number,
    mode: "grid" | "carousel",
  ) => {
    const hasDiscount = item.discount > 0;
    const finalPrice = getFinalPrice(item.price, item.discount);
    const saved = Math.max(0, item.price - finalPrice);
    const isFavorite = favoriteIds.has(item.id);

    const href = item.detailPageLink || "";
    const isExternal = href ? isExternalLink(href) : false;

    const cta = href ? (
      isExternal ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-black text-on-primary shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {t("viewMore")}
          <Icon
            name={locale === "ar" ? "arrow_back" : "arrow_forward"}
            size="sm"
            aria-hidden
          />
        </a>
      ) : (
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-black text-on-primary shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {t("viewMore")}
          <Icon
            name={locale === "ar" ? "arrow_back" : "arrow_forward"}
            size="sm"
            aria-hidden
          />
        </Link>
      )
    ) : null;

    const widthClass =
      mode === "grid"
        ? "w-full max-w-[420px]"
        : "w-[min(340px,calc(100%-2rem))] sm:w-[340px]";

    return (
      <article
        key={item.id}
        ref={(el) => {
          itemRefs.current[idx] = el;
        }}
        className={[
          "group snap-start shrink-0 overflow-hidden rounded-lg border border-outline-variant/15 bg-surface-container-lowest shadow-sm transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-md",
          widthClass,
        ].join(" ")}
      >
        <div className="relative aspect-[2/1] w-full overflow-hidden bg-surface-variant/30">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, 340px"
            loading="lazy"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/55 via-black/15 to-black/0" />

          <div className="absolute inset-s-3 top-3 flex flex-wrap items-center gap-2">
            {item.badge ? (
              <span className="inline-flex items-center rounded bg-surface-container-lowest/90 px-2.5 py-1 text-[11px] font-black tracking-wide text-primary shadow-md backdrop-blur-md ring-1 ring-outline-variant/20">
                {item.badge}
              </span>
            ) : null}
            {hasDiscount ? (
              <span className="inline-flex items-center rounded bg-tertiary-fixed/90 px-2.5 py-1 text-[11px] font-black tracking-wide text-on-tertiary-fixed shadow-md backdrop-blur-md">
                -{item.discount}% {t("off")}
              </span>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => toggleFavorite(item.id)}
            aria-label={isFavorite ? removeFavoriteLabel : favoriteLabel}
            className="absolute inset-e-3 top-3 grid h-9 w-9 place-items-center rounded-lg bg-surface-container-lowest/92 text-primary shadow-sm"
          >
            <Icon
              name={isFavorite ? "favorite" : "favorite_border"}
              filled={isFavorite}
              size="sm"
            />
          </button>
        </div>

        <div className="bg-linear-to-b from-surface-container-lowest to-surface-container-low p-4">
          <div className="space-y-1.5">
            <h3 className="line-clamp-1 text-lg font-extrabold tracking-tight text-on-surface">
              {item.title}
            </h3>
            <p className="line-clamp-1 text-sm leading-6 text-on-surface-variant">
              {item.description}
            </p>
          </div>

          <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-col">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-xl font-black tracking-tight text-primary">
                  {formatNumber(finalPrice)}
                </span>
                {hasDiscount ? (
                  <span className="text-sm font-bold text-on-surface-variant line-through">
                    {formatNumber(item.price)}
                  </span>
                ) : null}
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-on-surface-variant">
                <span>
                  {t("expires")}: {formatDate(item.expiryDate)}
                </span>
                {hasDiscount && saved > 0 ? (
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-primary">
                    {t("save")} {formatNumber(saved)}
                  </span>
                ) : null}
              </div>
            </div>
            {cta}
          </div>
        </div>
      </article>
    );
  };

  return (
    <section className="relative overflow-hidden border-y border-outline-variant/10 bg-surface py-8 md:py-10">
      <div className="relative content-container">
        {header}

        {showGrid ? (
          <div className={["grid gap-6", gridColsClass].join(" ")}>
            {cards.map((item, idx) => renderCard(item, idx, "grid"))}
          </div>
        ) : (
          <>
            <div
              ref={scrollerRef}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-6 px-6 md:-mx-8 md:px-8"
            >
              {cards.map((card, idx) => renderCard(card, idx, "carousel"))}
            </div>

            {cards.length > 1 ? (
              <div className="mt-1 flex justify-center gap-2">
                {cards.map((c, idx) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => scrollToIndex(idx)}
                    aria-label={`${slideLabelPrefix} ${idx + 1}: ${c.title}`}
                    aria-current={idx === safeActiveIdx}
                    className={[
                      "h-2 rounded-full transition-all",
                      idx === safeActiveIdx
                        ? "w-7 bg-primary"
                        : "w-2 bg-outline-variant/55",
                    ].join(" ")}
                  />
                ))}
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
