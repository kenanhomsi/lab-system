"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { frontendContainer } from "@/container";
import { slideCardModuleNames, SlideCardFrontendService } from "@/modules/slide-card";
import { Icon } from "@/components/ui/icon";
import { SectionHeader } from "@/components/ui/section-header";
import type { SlideCardItem } from "@/types/slide-card";

const isExternalLink = (href: string) => /^https?:\/\//i.test(href);

const getFinalPrice = (price: number, discount: number) => {
  if (discount <= 0) return price;
  return Math.max(0, price - (price * discount) / 100);
};

type SlideCardsVariant = "website" | "dashboard" | "sidebar";

type SlideCardsWebsiteProps = {
  variant?: SlideCardsVariant;
};

export function SlideCardsWebsite({ variant = "website" }: SlideCardsWebsiteProps = {}) {
  const t = useTranslations("landing.slideCards");
  const tServices = useTranslations("landing.services");
  const locale = useLocale();
  const slideCardService = frontendContainer.get<SlideCardFrontendService>(
    slideCardModuleNames.service,
  );
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["website-slide-cards"],
    queryFn: async () => slideCardService.findAllPublic({}),
    staleTime: 1000 * 60,
  });

  const cards = useMemo(
    () =>
      (data ?? [])
        .filter((item) => item.isActive)
        .sort((a, b) => a.displayOrder - b.displayOrder),
    [data],
  );

  const formatNumber = (value: number) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value);

  const formatDate = (value: string) => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" });
  };

  const scrollToIndex = (idx: number) => {
    const el = itemRefs.current[idx];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  };

  const safeActiveIdx = cards.length === 0 ? 0 : Math.min(activeIdx, cards.length - 1);
  const canPrev = safeActiveIdx > 0;
  const canNext = safeActiveIdx < cards.length - 1;
  const slideLabelPrefix = locale === "ar" ? "الانتقال إلى العرض" : "Go to item";

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

  if (!isLoading && cards.length === 0) return null;

  const isCompact = variant === "dashboard" || variant === "sidebar";

  if (isCompact) {
    const maxItems = variant === "sidebar" ? 3 : 4;
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
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
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

  const showGrid = !isLoading && cards.length <= 3;
  const showCarousel = !showGrid;

  const header = (
    <SectionHeader
      title={t("title")}
      description={t("subtitle")}
      action={
        showCarousel && cards.length > 1 ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollToIndex(Math.max(0, safeActiveIdx - 1))}
              disabled={!canPrev}
              aria-label={tServices("prev")}
              className="grid h-10 w-10 place-items-center rounded-full border border-outline-variant/20 bg-surface-container-lowest text-on-surface shadow-sm transition-opacity disabled:opacity-40"
            >
              <Icon name={locale === "ar" ? "arrow_forward" : "arrow_back"} size="sm" />
            </button>
            <button
              type="button"
              onClick={() => scrollToIndex(Math.min(cards.length - 1, safeActiveIdx + 1))}
              disabled={!canNext}
              aria-label={tServices("next")}
              className="grid h-10 w-10 place-items-center rounded-full border border-outline-variant/20 bg-surface-container-lowest text-on-surface shadow-sm transition-opacity disabled:opacity-40"
            >
              <Icon name={locale === "ar" ? "arrow_back" : "arrow_forward"} size="sm" />
            </button>
          </div>
        ) : null
      }
      className="mb-8 md:mb-10"
    />
  );

  const gridColsClass =
    cards.length <= 1
      ? "grid-cols-1 justify-items-center"
      : cards.length === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  const renderCard = (item: SlideCardItem, idx: number, mode: "grid" | "carousel") => {
    const hasDiscount = item.discount > 0;
    const finalPrice = getFinalPrice(item.price, item.discount);
    const saved = Math.max(0, item.price - finalPrice);

    const href = item.detailPageLink || "";
    const isExternal = href ? isExternalLink(href) : false;

    const cta = href ? (
      isExternal ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-black text-on-primary shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {t("viewMore")}
          <Icon name={locale === "ar" ? "arrow_back" : "arrow_forward"} size="sm" aria-hidden />
        </a>
      ) : (
        <Link
          href={href}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-black text-on-primary shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {t("viewMore")}
          <Icon name={locale === "ar" ? "arrow_back" : "arrow_forward"} size="sm" aria-hidden />
        </Link>
      )
    ) : null;

    const widthClass =
      mode === "grid"
        ? "w-full max-w-[520px]"
        : "w-[min(420px,calc(100%-3rem))] sm:w-[420px]";

    return (
      <article
        key={item.id}
        ref={(el) => {
          itemRefs.current[idx] = el;
        }}
        className={[
          "group snap-start shrink-0 overflow-hidden rounded-4xl border border-outline-variant/15 bg-surface-container-lowest shadow-[0_14px_40px_-22px_rgba(0,36,46,0.35)] transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_64px_-22px_rgba(0,36,46,0.35)] dark:shadow-[0_26px_60px_-30px_rgba(0,0,0,0.7)]",
          widthClass,
        ].join(" ")}
      >
        <div className="relative aspect-16/9 w-full overflow-hidden bg-surface-variant/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.imageUrl}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/55 via-black/15 to-black/0" />

          <div className="absolute inset-s-5 top-5 flex flex-wrap items-center gap-2">
            {item.badge ? (
              <span className="inline-flex items-center rounded-full bg-surface-container-lowest/90 px-3 py-1 text-xs font-black tracking-wide text-primary shadow-md backdrop-blur-md ring-1 ring-outline-variant/20">
                {item.badge}
              </span>
            ) : null}
            {hasDiscount ? (
              <span className="inline-flex items-center rounded-full bg-tertiary-fixed/90 px-3 py-1 text-xs font-black tracking-wide text-on-tertiary-fixed shadow-md backdrop-blur-md">
                -{item.discount}% {t("off")}
              </span>
            ) : null}
          </div>
        </div>

        <div className="bg-linear-to-b from-surface-container-lowest to-surface-container-low p-6">
          <div className="space-y-2">
            <h3 className="line-clamp-1 text-xl font-extrabold tracking-tight text-on-surface">
              {item.title}
            </h3>
            <p className="line-clamp-2 text-sm leading-relaxed text-on-surface-variant">
              {item.description}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-col">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-2xl font-black tracking-tight text-primary">
                  {formatNumber(finalPrice)}
                </span>
                {hasDiscount ? (
                  <span className="text-sm font-bold text-on-surface-variant line-through">
                    {formatNumber(item.price)}
                  </span>
                ) : null}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-semibold text-on-surface-variant">
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
    <section className="relative overflow-hidden border-y border-outline-variant/10 bg-linear-to-b from-background via-surface-container-low/45 to-background py-12 md:py-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.28] dark:opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(var(--outline-variant) 1px, transparent 1px), linear-gradient(90deg, var(--outline-variant) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-orb h-56 w-56 bg-primary/12 inset-s-[10%] top-[18%]" />
        <div className="bg-orb bg-orb-reverse h-64 w-64 bg-tertiary-fixed/12 inset-e-[8%] bottom-[10%]" />
      </div>

      <div className="relative mx-auto max-w-screen-2xl px-6 md:px-8">
        {header}

        {showGrid ? (
          <div className={["grid gap-6", gridColsClass].join(" ")}>
            {cards.map((item, idx) => renderCard(item, idx, "grid"))}
          </div>
        ) : (
          <>
            <div
              ref={scrollerRef}
              className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-5 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-6 px-6 md:-mx-8 md:px-8"
            >
              {(isLoading ? Array.from({ length: 4 }) : cards).map((card, idx) => {
                if (isLoading) {
                  return (
                    <div
                      key={`skeleton-${idx}`}
                      className="animate-pulse snap-start shrink-0 overflow-hidden rounded-4xl border border-outline-variant/15 bg-surface-container-lowest shadow-sm w-[min(420px,calc(100%-3rem))] sm:w-[420px]"
                    >
                      <div className="aspect-16/9 w-full bg-surface-variant/40" />
                      <div className="space-y-3 p-6">
                        <div className="h-5 w-2/3 rounded bg-surface-variant/40" />
                        <div className="h-4 w-full rounded bg-surface-variant/40" />
                        <div className="h-4 w-5/6 rounded bg-surface-variant/40" />
                        <div className="h-7 w-1/2 rounded bg-surface-variant/40" />
                      </div>
                    </div>
                  );
                }
                return renderCard(card as SlideCardItem, idx, "carousel");
              })}
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
                      idx === safeActiveIdx ? "w-7 bg-primary" : "w-2 bg-outline-variant/55",
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

export const SlideCardsSection = SlideCardsWebsite;

export function SlideCardsDashboard() {
  return <SlideCardsWebsite variant="dashboard" />;
}

export function SlideCardsSidebar() {
  return <SlideCardsWebsite variant="sidebar" />;
}
