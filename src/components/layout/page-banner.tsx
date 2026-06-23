"use client";

import Image from "next/image";
import { type ReactNode } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useBannerCarousel } from "@/lib/banners";
import type { BannerItem } from "@/types/banner";

const isVideoUrl = (url: string) => /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);

type PageBannerProps = {
  banners: BannerItem[];
};

/**
 * Full-width promotional banner using theme scrims (background / primary tints)
 * so light and dark modes stay consistent with the rest of the app.
 */
export function PageBanner({ banners }: PageBannerProps) {
  const t = useTranslations("landing.banners");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const slideLabelPrefix = locale === "ar" ? "الانتقال إلى الشريحة" : "Go to slide";

  const { activeIdx, setActiveIdx } = useBannerCarousel({
    count: banners.length,
    enabled: banners.length > 1,
  });

  if (banners.length === 0) return null;

  const banner = banners[activeIdx] as BannerItem;
  const href = banner.internalLink || banner.externalLink || "";
  const isExternal = !!banner.externalLink && !banner.internalLink;
  const target =
    banner.targetType === "_blank" || banner.targetType === "_self"
      ? banner.targetType
      : undefined;
  const rel = target === "_blank" ? "noreferrer" : undefined;
  const mediaIsVideo = isVideoUrl(banner.mediaUrl);

  const ctaLabel = isExternal ? t("ctaExternal") : t("cta");

  const mediaClassName =
    "absolute inset-0 h-full w-full scale-[1.06] object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-[1.1]";

  const media = mediaIsVideo ? (
    <video
      key={banner.id}
      src={banner.mediaUrl}
      muted
      loop
      autoPlay
      playsInline
      className={mediaClassName}
    />
  ) : (
    <Image
      key={banner.id}
      src={banner.mediaUrl}
      alt={banner.title}
      fill
      sizes="(max-width: 768px) 100vw, min(1200px, 92vw)"
      quality={90}
      priority
      className={mediaClassName}
    />
  );

  const textScrimClass = isRtl
    ? "absolute inset-0 bg-linear-to-l from-background/85 via-background/35 to-transparent"
    : "absolute inset-0 bg-linear-to-r from-background/85 via-background/35 to-transparent";

  const contentAlign = "items-start text-start";

  const textInner: ReactNode = (
    <div
      className={`relative flex w-full max-w-lg flex-col gap-3.5 rounded-2xl bg-transparent p-5 md:max-w-[min(34rem,52%)] md:gap-4 md:p-7 ${contentAlign}`}
    >
      <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-bold tracking-wide text-primary dark:bg-primary-container/50 dark:text-primary-fixed">
        <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_color-mix(in_srgb,var(--primary)_70%,transparent)]" aria-hidden />
        {banner.type || t("fallback")}
      </span>

      <h2 className="font-headline text-2xl font-extrabold leading-[1.15] tracking-tight text-on-surface md:text-3xl lg:text-[2rem]">
        {banner.title}
      </h2>

      <p className="text-sm leading-relaxed text-on-surface-variant md:text-[15px]">{t("learnMore")}</p>

      {href ? (
        <span
          className={`clinical-gradient mt-0.5 inline-flex w-fit items-center gap-2.5 rounded-xl px-5 py-2.5 text-sm font-bold text-on-primary shadow-sm shadow-primary/15 ring-1 ring-primary/15 transition-all duration-200 group-hover:shadow-primary/25 group-hover:brightness-105 ${isRtl ? "flex-row-reverse" : ""}`}
        >
          {ctaLabel}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isRtl ? "-scale-x-100 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      ) : null}
    </div>
  );

  const panelClassName = `group relative z-10 flex min-h-[240px] flex-1 flex-col justify-center px-5 py-8 md:min-h-[280px] md:px-10 md:py-10 ${contentAlign}`;

  const contentPanel = href ? (
    isExternal ? (
      <a
        href={href}
        target={target ?? "_blank"}
        rel={rel ?? "noreferrer"}
        className={`${panelClassName} no-underline`}
      >
        {textInner}
      </a>
    ) : (
      <Link href={href} target={target} rel={rel} className={`${panelClassName} no-underline`}>
        {textInner}
      </Link>
    )
  ) : (
    <div className={panelClassName}>{textInner}</div>
  );

  const carouselDots =
    banners.length > 1 ? (
      <div
        className={`relative z-10 flex items-center gap-2 border-t border-outline-variant/15 bg-transparent px-5 py-3.5 md:px-10 ${isRtl ? "flex-row-reverse" : ""}`}
      >
        {banners.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setActiveIdx(idx);
            }}
            aria-label={`${slideLabelPrefix} ${idx + 1}: ${item.title}`}
            aria-current={idx === activeIdx}
            className={[
              "rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2",
              idx === activeIdx
                ? "h-2 w-7 bg-primary shadow-[0_0_10px_color-mix(in_srgb,var(--primary)_55%,transparent)]"
                : "h-2 w-2 bg-outline-variant/70 hover:bg-primary/50",
            ].join(" ")}
          />
        ))}
        <span
          dir="ltr"
          className="ms-auto text-[11px] font-semibold tabular-nums text-on-surface-variant"
        >
          {activeIdx + 1}&thinsp;/&thinsp;{banners.length}
        </span>
      </div>
    ) : null;

  return (
    <section aria-label={t("regionAria")} className="content-container my-6">
      <div className="relative overflow-hidden rounded-3xl shadow-md shadow-primary/8 ring-1 ring-outline-variant/25">
        <div className="group relative flex min-h-[240px] flex-col bg-surface-container-low md:min-h-[280px]">
          <div className="absolute inset-0 overflow-hidden" aria-hidden>
            {media}

            <div className={textScrimClass} />

            <div
              className={`pointer-events-none absolute inset-y-0 w-[min(55%,28rem)] ${isRtl ? "inset-e-0 bg-linear-to-l from-primary/12 to-transparent" : "inset-s-0 bg-linear-to-r from-primary/12 to-transparent"}`}
              aria-hidden
            />

            <div
              className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-outline-variant/15"
              aria-hidden
            />

            {banners.length > 1 ? (
              <div className="absolute inset-x-0 bottom-0 z-1 h-[3px] bg-outline-variant/25">
                <div
                  className="clinical-gradient h-full transition-all duration-500 ease-linear"
                  style={{ width: `${((activeIdx + 1) / banners.length) * 100}%` }}
                  aria-hidden
                />
              </div>
            ) : null}
          </div>

          <div className="relative flex min-h-0 flex-1 flex-col">
            {contentPanel}
            {carouselDots}
          </div>
        </div>
      </div>
    </section>
  );
}
