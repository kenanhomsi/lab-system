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
  const mediaIsVideo = isVideoUrl(banner.mediaUrl);

  const ctaLabel = isExternal ? t("ctaExternal") : t("cta");

  const media = mediaIsVideo ? (
    <video
      src={banner.mediaUrl}
      muted
      loop
      autoPlay
      playsInline
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
    />
  ) : (
    <Image
      src={banner.mediaUrl}
      alt={banner.title}
      fill
      sizes="(max-width: 768px) 100vw, 46vw"
      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
    />
  );

  const imagePanel = (
    <div className="relative h-full min-h-52 w-full overflow-hidden">
      {media}

      <div
        className={`pointer-events-none absolute inset-y-0 w-24 bg-linear-to-r from-surface to-transparent ${isRtl ? "right-0 bg-linear-to-l" : "left-0"}`}
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/30 to-transparent md:hidden" />

      {banners.length > 1 ? (
        <div className="absolute bottom-0 inset-x-0 h-[3px] bg-white/15">
          <div
            className="clinical-gradient h-full transition-all duration-500 ease-linear"
            style={{ width: `${((activeIdx + 1) / banners.length) * 100}%` }}
            aria-hidden
          />
        </div>
      ) : null}
    </div>
  );

  const textInner: ReactNode = (
    <div className="relative flex flex-col gap-4">
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/25 bg-primary-container/60 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-on-primary-container">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" aria-hidden />
        {banner.type || t("fallback")}
      </span>

      <h2
        className={`font-headline text-2xl font-extrabold leading-[1.15] tracking-tight text-on-surface md:text-3xl lg:text-[2.1rem] ${isRtl ? "text-right" : "text-left"}`}
      >
        {banner.title}
      </h2>

      <p
        className={`text-sm leading-relaxed text-on-surface-variant md:text-base ${isRtl ? "text-right" : "text-left"}`}
      >
        {t("learnMore")}
      </p>

      {href ? (
        <span
          className={`clinical-gradient mt-1 inline-flex w-fit items-center gap-2.5 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/30 transition-all duration-200 group-hover:shadow-primary/50 group-hover:brightness-105 ${isRtl ? "flex-row-reverse self-end" : "self-start"}`}
        >
          {ctaLabel}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`h-4 w-4 transition-transform duration-200 shrink-0 ${isRtl ? "-scale-x-100 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}
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

  const textPanelBody = href ? (
    isExternal ? (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="group flex flex-1 flex-col justify-center gap-5 px-7 py-8 no-underline md:px-10 md:py-10"
      >
        {textInner}
      </a>
    ) : (
      <Link href={href} className="group flex flex-1 flex-col justify-center gap-5 px-7 py-8 no-underline md:px-10 md:py-10">
        {textInner}
      </Link>
    )
  ) : (
    <div className="group flex flex-1 flex-col justify-center gap-5 px-7 py-8 md:px-10 md:py-10">
      {textInner}
    </div>
  );

  const carouselDots =
    banners.length > 1 ? (
      <div
        className={`flex items-center gap-2 border-t border-outline-variant/10 bg-surface px-7 py-4 md:px-10 ${isRtl ? "flex-row-reverse" : ""}`}
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
              idx === activeIdx ? "h-2 w-7 bg-primary" : "h-2 w-2 bg-outline-variant hover:bg-primary/50",
            ].join(" ")}
          />
        ))}
        <span className="ms-auto text-[11px] font-semibold tabular-nums text-on-surface-variant/70">
          {activeIdx + 1}&thinsp;/&thinsp;{banners.length}
        </span>
      </div>
    ) : null;

  const imageColumn = href ? (
    isExternal ? (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        tabIndex={-1}
        aria-hidden
        className="group relative flex h-full min-h-52 shrink-0 self-stretch overflow-hidden md:w-[46%] lg:w-[44%] no-underline"
      >
        {imagePanel}
      </a>
    ) : (
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden
        className="group relative flex h-full min-h-52 shrink-0 self-stretch overflow-hidden md:w-[46%] lg:w-[44%] no-underline"
      >
        {imagePanel}
      </Link>
    )
  ) : (
    <div className="group relative flex h-full min-h-52 shrink-0 self-stretch md:w-[46%] lg:w-[44%]">
      {imagePanel}
    </div>
  );

  return (
    <section
      aria-label={t("regionAria")}
      className="mx-auto my-6 max-w-screen-2xl px-4 sm:px-6 md:px-8"
    >
      <div className="relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-outline-variant/30">
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]"
          aria-hidden
          style={{
            backgroundImage: `linear-gradient(var(--on-surface) 1px, transparent 1px),
                              linear-gradient(90deg, var(--on-surface) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />

        <div
          className={`relative z-10 flex min-h-[260px] flex-col md:min-h-[280px] md:flex-row ${isRtl ? "md:flex-row-reverse" : ""}`}
        >
          <div className="relative flex min-w-0 flex-1 flex-col bg-surface">
            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent" />
            <div
              className={`clinical-gradient pointer-events-none absolute top-0 z-1 h-[3px] w-24 rounded-full ${isRtl ? "right-7 md:right-10" : "left-7 md:left-10"}`}
            />
            <div className="relative z-1 flex min-h-0 flex-1 flex-col">{textPanelBody}</div>
            {carouselDots}
          </div>

          {imageColumn}
        </div>
      </div>
    </section>
  );
}
