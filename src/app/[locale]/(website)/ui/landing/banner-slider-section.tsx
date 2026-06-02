"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  BANNER_PLACEMENT,
  useBannerCarousel,
  usePublicBanners,
} from "@/lib/banners";
import type { BannerItem } from "@/types/banner";
import { SlideCardsSidebar } from "./slide-cards-section";

const isVideoUrl = (url: string) => /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);

export function BannerSliderSection() {
  const t = useTranslations("landing.banners");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const slideLabelPrefix = locale === "ar" ? "الانتقال إلى الشريحة" : "Go to slide";

  const { banners, isLoading } = usePublicBanners({
    placement: BANNER_PLACEMENT.HOME_PAGE,
    fallbackToHomepage: false,
  });

  const { activeIdx, setActiveIdx } = useBannerCarousel({
    count: banners.length,
    enabled: banners.length > 1,
  });

  if (isLoading || banners.length === 0) return null;

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
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
    />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={banner.mediaUrl}
      alt={banner.title}
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
    />
  );

  const content = (
    <>
      <div
        style={{
          flex: 1,
          minWidth: 0,
          zIndex: 2,
          color: "var(--on-surface)",
        }}
      >
        <p style={{ margin: 0, fontSize: 13, opacity: 0.9 }}>{banner.type || t("fallback")}</p>
        <h2 style={{ margin: "8px 0", fontSize: 30, lineHeight: 1.15 }}>{banner.title}</h2>
        <p style={{ margin: 0, fontSize: 15, opacity: 0.9 }}>{t("learnMore")}</p>
        {href ? (
          <span
            style={{
              display: "inline-block",
              marginTop: 12,
              padding: "10px 20px",
              borderRadius: 999,
              background: "var(--primary)",
              color: "var(--on-primary)",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {ctaLabel}
          </span>
        ) : null}
      </div>
      <div
        style={{
          width: 280,
          maxWidth: "40%",
          borderRadius: 16,
          overflow: "hidden",
          border: "1px solid rgba(0,0,0,0.12)",
          background: "rgba(255,255,255,0.3)",
        }}
      >
        {media}
      </div>
    </>
  );

  return (
    <section aria-label={t("regionAria")} className="content-container mt-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-8">
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: 20,
              border: "1px solid var(--outline-variant)",
              background:
                "linear-gradient(130deg, rgba(200,233,255,0.95) 0%, rgba(189,220,255,0.9) 45%, rgba(182,255,244,0.9) 100%)",
              padding: "20px",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.5), rgba(255,255,255,0) 45%)",
                pointerEvents: "none",
              }}
            />
            {href ? (
              isExternal ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "flex",
                    gap: 16,
                    alignItems: "center",
                    textDecoration: "none",
                  }}
                >
                  {content}
                </a>
              ) : (
                <Link
                  href={href}
                  style={{
                    display: "flex",
                    gap: 16,
                    alignItems: "center",
                    textDecoration: "none",
                  }}
                >
                  {content}
                </Link>
              )
            ) : (
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  alignItems: "center",
                  textDecoration: "none",
                }}
              >
                {content}
              </div>
            )}
            {banners.length > 1 ? (
              <div
                style={{
                  position: "absolute",
                  bottom: 12,
                  [isRtl ? "left" : "right"]: 12,
                  display: "flex",
                  gap: 6,
                }}
              >
                {banners.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveIdx(idx)}
                    aria-label={`${slideLabelPrefix} ${idx + 1}: ${item.title}`}
                    aria-current={idx === activeIdx}
                    style={{
                      width: idx === activeIdx ? 22 : 8,
                      height: 8,
                      borderRadius: 99,
                      border: "none",
                      cursor: "pointer",
                      background:
                        idx === activeIdx ? "var(--primary)" : "rgba(0,0,0,0.25)",
                    }}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="lg:col-span-4">
          <SlideCardsSidebar />
        </div>
      </div>
    </section>
  );
}
