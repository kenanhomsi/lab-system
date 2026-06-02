"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useMemo, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { SectionHeader } from "@/components/ui/section-header";
import type { BannerItem } from "@/types/banner";

type BannerCardSliderClientProps = {
  banners: BannerItem[];
  title: string;
  description: string;
  viewAllHref?: string;
  displayMode?: "cards" | "logos";
  surface?: "plain" | "muted";
};

const isVideoUrl = (url: string) => /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);

const getHref = (banner: BannerItem) =>
  banner.internalLink || banner.externalLink || "";

const isExternalHref = (banner: BannerItem) =>
  Boolean(banner.externalLink && !banner.internalLink);

/**
 * Renders dashboard-managed banners as a customer-facing horizontal card slider.
 */
export function BannerCardSliderClient({
  banners,
  title,
  description,
  viewAllHref,
  displayMode = "cards",
  surface = "plain",
}: BannerCardSliderClientProps) {
  const locale = useLocale();
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [favoriteIds, setFavoriteIds] = useState<ReadonlySet<string>>(
    () => new Set<string>(),
  );

  const labels = useMemo(
    () =>
      locale === "ar"
        ? {
            viewAll: "عرض الكل",
            details: "التفاصيل",
            favorite: "إضافة للمفضلة",
            removeFavorite: "إزالة من المفضلة",
            endsAt: "ينتهي في",
            slide: "الانتقال إلى العنصر",
            previous: "السابق",
            next: "التالي",
          }
        : {
            viewAll: "View all",
            details: "Details",
            favorite: "Add to favorites",
            removeFavorite: "Remove from favorites",
            endsAt: "Ends",
            slide: "Go to item",
            previous: "Previous",
            next: "Next",
          },
    [locale],
  );

  const safeActiveIdx =
    banners.length === 0 ? 0 : Math.min(activeIdx, banners.length - 1);
  const arrowForward = locale === "ar" ? "arrow_back" : "arrow_forward";
  const arrowBack = locale === "ar" ? "arrow_forward" : "arrow_back";

  const scrollToIndex = (idx: number) => {
    const nextIdx = Math.max(0, Math.min(idx, banners.length - 1));
    const el = itemRefs.current[nextIdx];
    if (!el) return;
    setActiveIdx(nextIdx);
    el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  };

  const toggleFavorite = (id: string) => {
    setFavoriteIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (banners.length === 0) return null;

  return (
    <section
      className={[
        "relative overflow-hidden border-y border-outline-variant/10 py-12 md:py-16",
        surface === "muted" ? "bg-surface-container-low" : "bg-surface",
      ].join(" ")}
    >
      <div className="content-container">
        <SectionHeader
          title={title}
          description={description}
          action={
            <div className="flex items-center gap-2">
              {banners.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() => scrollToIndex(safeActiveIdx - 1)}
                    disabled={safeActiveIdx === 0}
                    aria-label={labels.previous}
                    className="grid h-10 w-10 place-items-center rounded-lg border border-outline-variant/20 bg-surface-container-lowest text-on-surface shadow-sm transition-opacity disabled:opacity-40"
                  >
                    <Icon name={arrowBack} size="sm" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToIndex(safeActiveIdx + 1)}
                    disabled={safeActiveIdx >= banners.length - 1}
                    aria-label={labels.next}
                    className="grid h-10 w-10 place-items-center rounded-lg border border-outline-variant/20 bg-surface-container-lowest text-on-surface shadow-sm transition-opacity disabled:opacity-40"
                  >
                    <Icon name={arrowForward} size="sm" />
                  </button>
                </>
              ) : null}
              {viewAllHref ? (
                <Link
                  href={viewAllHref}
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-primary/20 bg-primary/8 px-4 text-sm font-black text-primary"
                >
                  {labels.viewAll}
                  <Icon name={arrowForward} size="sm" aria-hidden />
                </Link>
              ) : null}
            </div>
          }
          className="mb-7 md:mb-8"
        />

        <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-5 pt-1 [scrollbar-width:none] md:-mx-8 md:px-8 [&::-webkit-scrollbar]:hidden">
          {banners.map((banner, idx) => {
            const href = getHref(banner);
            const isExternal = isExternalHref(banner);
            const isVideo = isVideoUrl(banner.mediaUrl);
            const isFavorite = favoriteIds.has(banner.id);
            const endDate = banner.endDate
              ? new Date(banner.endDate).toLocaleDateString(locale, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "";

            const media = isVideo ? (
              <video
                src={banner.mediaUrl}
                muted
                loop
                autoPlay
                playsInline
                className="h-full w-full object-cover"
              />
            ) : (
              <Image
                src={banner.mediaUrl}
                alt={banner.title}
                fill
                sizes={
                  displayMode === "logos"
                    ? "(max-width: 768px) 70vw, 220px"
                    : "(max-width: 768px) 82vw, 360px"
                }
                className={
                  displayMode === "logos"
                    ? "object-contain p-7"
                    : "object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                }
              />
            );

            const inner = (
              <>
                <div
                  className={[
                    "relative w-full overflow-hidden bg-surface-container",
                    displayMode === "logos" ? "aspect-[4/3]" : "aspect-[16/10]",
                  ].join(" ")}
                >
                  {media}
                  {displayMode === "cards" ? (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/55 to-transparent" />
                  ) : null}
                  {banner.type ? (
                    <span className="absolute inset-s-3 top-3 rounded bg-surface-container-lowest/92 px-2.5 py-1 text-[11px] font-black text-primary shadow-sm">
                      {banner.type}
                    </span>
                  ) : null}
                  {displayMode === "cards" ? (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        toggleFavorite(banner.id);
                      }}
                      aria-label={
                        isFavorite ? labels.removeFavorite : labels.favorite
                      }
                      className="absolute inset-e-3 top-3 grid h-9 w-9 place-items-center rounded-lg bg-surface-container-lowest/92 text-primary shadow-sm"
                    >
                      <Icon
                        name={isFavorite ? "favorite" : "favorite_border"}
                        filled={isFavorite}
                        size="sm"
                      />
                    </button>
                  ) : null}
                </div>

                <div className="flex min-h-[11rem] flex-1 flex-col p-5">
                  <h3 className="line-clamp-2 text-lg font-extrabold text-on-surface">
                    {banner.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-on-surface-variant">
                    {banner.targetType || description}
                  </p>
                  <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                    <div className="min-w-0 text-xs font-semibold text-on-surface-variant">
                      {endDate ? `${labels.endsAt}: ${endDate}` : null}
                    </div>
                    {href ? (
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-black text-on-primary">
                        {labels.details}
                        <Icon name={arrowForward} size="sm" aria-hidden />
                      </span>
                    ) : null}
                  </div>
                </div>
              </>
            );

            const className = [
              "group flex snap-start shrink-0 flex-col overflow-hidden rounded-lg border border-outline-variant/15 bg-surface-container-lowest shadow-sm transition-shadow hover:shadow-md",
              displayMode === "logos"
                ? "w-[min(240px,70vw)]"
                : "w-[min(360px,82vw)]",
            ].join(" ");

            if (!href) {
              return (
                <article
                  key={banner.id}
                  ref={(el) => {
                    itemRefs.current[idx] = el;
                  }}
                  className={className}
                >
                  {inner}
                </article>
              );
            }

            if (isExternal) {
              return (
                <a
                  key={banner.id}
                  ref={(el) => {
                    itemRefs.current[idx] = el;
                  }}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className={className}
                >
                  {inner}
                </a>
              );
            }

            return (
              <Link
                key={banner.id}
                ref={(el) => {
                  itemRefs.current[idx] = el;
                }}
                href={href}
                className={className}
              >
                {inner}
              </Link>
            );
          })}
        </div>

        {banners.length > 1 ? (
          <div className="mt-1 flex justify-center gap-2">
            {banners.map((banner, idx) => (
              <button
                key={banner.id}
                type="button"
                onClick={() => scrollToIndex(idx)}
                aria-label={`${labels.slide} ${idx + 1}: ${banner.title}`}
                aria-current={idx === safeActiveIdx}
                className={[
                  "h-2 rounded-full transition-all",
                  idx === safeActiveIdx ? "w-7 bg-primary" : "w-2 bg-outline-variant/55",
                ].join(" ")}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
