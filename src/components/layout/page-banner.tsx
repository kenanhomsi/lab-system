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

  const media = mediaIsVideo ? (
    <video
      key={banner.id}
      src={banner.mediaUrl}
      muted
      loop
      autoPlay
      playsInline
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
    />
  ) : (
    <Image
      key={banner.id}
      src={banner.mediaUrl}
      alt={banner.title}
      fill
      sizes="100vw"
      priority
      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
    />
  );

  const contentAlign = "items-start text-start";

  const textInner: ReactNode = (
    <div className={`relative flex w-full max-w-xl flex-col gap-4 md:max-w-[min(32rem,48%)] ${contentAlign}`}>
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" aria-hidden />
        {banner.type || t("fallback")}
      </span>

      <h2 className="font-headline text-2xl font-extrabold leading-[1.15] tracking-tight text-white drop-shadow-sm md:text-3xl lg:text-[2.1rem]">
        {banner.title}
      </h2>

      <p className="text-sm leading-relaxed text-white/85 md:text-base">{t("learnMore")}</p>

      {href ? (
        <span
          className={`clinical-gradient mt-1 inline-flex w-fit items-center gap-2.5 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg shadow-black/25 transition-all duration-200 group-hover:shadow-primary/40 group-hover:brightness-105 ${isRtl ? "flex-row-reverse" : ""}`}
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

  const contentPanel = href ? (
    isExternal ? (
      <a
        href={href}
        target={target ?? "_blank"}
        rel={rel ?? "noreferrer"}
        className={`group relative z-10 flex min-h-[280px] flex-1 flex-col justify-center px-7 py-10 no-underline md:min-h-[320px] md:px-12 md:py-12 ${contentAlign}`}
      >
        {textInner}
      </a>
    ) : (
      <Link
        href={href}
        target={target}
        rel={rel}
        className={`group relative z-10 flex min-h-[280px] flex-1 flex-col justify-center px-7 py-10 no-underline md:min-h-[320px] md:px-12 md:py-12 ${contentAlign}`}
      >
        {textInner}
      </Link>
    )
  ) : (
    <div
      className={`group relative z-10 flex min-h-[280px] flex-1 flex-col justify-center px-7 py-10 md:min-h-[320px] md:px-12 md:py-12 ${contentAlign}`}
    >
      {textInner}
    </div>
  );

  const carouselDots =
    banners.length > 1 ? (
      <div
        className={`relative z-10 flex items-center gap-2 border-t border-white/15 bg-black/25 px-7 py-4 backdrop-blur-sm md:px-12 ${isRtl ? "flex-row-reverse" : ""}`}
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
              "rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2",
              idx === activeIdx ? "h-2 w-7 bg-white" : "h-2 w-2 bg-white/40 hover:bg-white/70",
            ].join(" ")}
          />
        ))}
        <span
          dir="ltr"
          className="ms-auto text-[11px] font-semibold tabular-nums text-white/70"
        >
          {activeIdx + 1}&thinsp;/&thinsp;{banners.length}
        </span>
      </div>
    ) : null;

  return (
    <section aria-label={t("regionAria")} className="content-container my-6">
      <div className="relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-outline-variant/30">
        <div className="group relative flex min-h-[280px] flex-col md:min-h-[320px]">
          <div className="absolute inset-0 overflow-hidden" aria-hidden>
            {media}

            <div className="absolute inset-0 bg-black/35" />

            <div
              className={
                isRtl
                  ? "absolute inset-0 bg-linear-to-l from-black/80 via-black/55 to-black/15"
                  : "absolute inset-0 bg-linear-to-r from-black/80 via-black/55 to-black/15"
              }
            />

            {banners.length > 1 ? (
              <div className="absolute bottom-0 inset-x-0 z-1 h-[3px] bg-white/15">
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
